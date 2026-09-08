/**
 * Client-side video validation.
 *
 * Validation is intentionally sequential and fast-failing:
 *   1. MIME type
 *   2. Source file size (≤500 MB)
 *   3. Duration (≤180 s) — requires loading video metadata
 *   4. Aspect ratio (9:16 or 1:1 for MVP)
 *
 * Validation happens BEFORE any FFmpeg processing so we never waste
 * CPU/RAM compressing files that will ultimately be rejected.
 */

// ─── Limits ───────────────────────────────────────────────────────────────────

export const MAX_SOURCE_BYTES = 500 * 1024 * 1024;   // 500 MB — source limit
export const MAX_DURATION_SECONDS = 180;              // 3 minutes
export const TARGET_UPLOAD_BYTES = 90 * 1024 * 1024; // 90 MB — compress target
export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;   // 100 MB — hard Cloudinary limit

// Aspect ratio tolerance — allows slight deviation from perfect 9:16 or 1:1
const ASPECT_RATIO_TOLERANCE = 0.15;

// ─── Result types ─────────────────────────────────────────────────────────────

export interface VideoMetadata {
    durationSeconds: number;
    width: number;
    height: number;
    aspectRatio: number;    // width / height
    aspectLabel: string;    // "9:16", "1:1", "16:9", etc.
}

export type ValidationResult =
    | { ok: true; metadata: VideoMetadata }
    | { ok: false; error: string };

// ─── Accepted types ───────────────────────────────────────────────────────────

const ACCEPTED_VIDEO_TYPES = new Set([
    "video/mp4",
    "video/quicktime",
    "video/webm",
]);

const ACCEPTED_IMAGE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

// ─── Public helpers ───────────────────────────────────────────────────────────

/** Quick synchronous check: is this file type supported at all? */
export function isAcceptedFileType(file: File): boolean {
    return ACCEPTED_VIDEO_TYPES.has(file.type) || ACCEPTED_IMAGE_TYPES.has(file.type);
}

export function isVideoFile(file: File): boolean {
    return ACCEPTED_VIDEO_TYPES.has(file.type);
}

export function isImageFile(file: File): boolean {
    return ACCEPTED_IMAGE_TYPES.has(file.type);
}

// ─── Full video validation pipeline ──────────────────────────────────────────

/**
 * Full sequential video validation.
 *
 * Returns { ok: true, metadata } on success.
 * Returns { ok: false, error: "<user-friendly message>" } on any failure.
 *
 * Does NOT start compression — caller decides what to do after this.
 */
export async function validateVideoFile(file: File): Promise<ValidationResult> {
    // ── Step 1: MIME type ──────────────────────────────────────────────────────
    if (!ACCEPTED_VIDEO_TYPES.has(file.type)) {
        return {
            ok: false,
            error: "Only MP4, MOV, and WebM videos are supported.",
        };
    }

    // ── Step 2: Source file size ───────────────────────────────────────────────
    if (file.size > MAX_SOURCE_BYTES) {
        return {
            ok: false,
            error: `Video is too large. CrossPost AI supports source videos up to ${formatBytes(MAX_SOURCE_BYTES)}.`,
        };
    }

    // ── Step 3 + 4: Duration + Aspect Ratio (requires loading metadata) ────────
    try {
        const metadata = await loadVideoMetadata(file);

        // Duration check — reject BEFORE compression
        if (metadata.durationSeconds > MAX_DURATION_SECONDS) {
            const mins = Math.floor(metadata.durationSeconds / 60);
            const secs = Math.floor(metadata.durationSeconds % 60);
            return {
                ok: false,
                error: `Your video is ${mins}:${String(secs).padStart(2, "0")} long. CrossPost AI currently supports short-form videos up to 3 minutes.`,
            };
        }

        // Aspect ratio check
        const aspectError = validateAspectRatio(metadata);
        if (aspectError) {
            return { ok: false, error: aspectError };
        }

        return { ok: true, metadata };
    } catch {
        return {
            ok: false,
            error: "Could not read video metadata. Please check the file is not corrupted.",
        };
    }
}

/** Image-only validation (simpler — just type + size) */
export function validateImageFile(file: File): { ok: true } | { ok: false; error: string } {
    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
        return { ok: false, error: "Only JPEG, PNG, and WebP images are supported." };
    }

    const IMAGE_MAX = 50 * 1024 * 1024; // 50 MB for images
    if (file.size > IMAGE_MAX) {
        return { ok: false, error: `Image is too large. Maximum size is ${formatBytes(IMAGE_MAX)}.` };
    }

    return { ok: true };
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Loads duration + resolution from a video file via a hidden <video> element.
 * Resolves after `loadedmetadata` fires. Rejects on error or timeout.
 */
function loadVideoMetadata(file: File): Promise<VideoMetadata> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const video = document.createElement("video");
        video.preload = "metadata";
        video.muted = true;

        const cleanup = () => {
            URL.revokeObjectURL(url);
            video.removeAttribute("src");
            video.load();
        };

        // Timeout: if metadata takes >15s something is very wrong
        const timeout = setTimeout(() => {
            cleanup();
            reject(new Error("Metadata load timed out"));
        }, 15_000);

        video.onloadedmetadata = () => {
            clearTimeout(timeout);
            const { videoWidth: width, videoHeight: height, duration } = video;
            cleanup();

            if (!width || !height) {
                reject(new Error("Could not read video dimensions"));
                return;
            }

            const aspectRatio = width / height;

            resolve({
                durationSeconds: duration,
                width,
                height,
                aspectRatio,
                aspectLabel: describeAspectRatio(width, height),
            });
        };

        video.onerror = () => {
            clearTimeout(timeout);
            cleanup();
            reject(new Error("Video element error"));
        };

        video.src = url;
    });
}

/**
 * Validates that the video has a valid, standard aspect ratio.
 * Supports vertical (9:16), square (1:1), portrait (4:5), widescreen (16:9), and standard (4:3) formats.
 */
function validateAspectRatio(metadata: VideoMetadata): string | null {
    const { aspectRatio } = metadata;

    // Accept standard video ratios between 0.4 (ultra-tall vertical) and 2.5 (cinematic widescreen)
    if (aspectRatio >= 0.4 && aspectRatio <= 2.5) {
        return null; // Supported
    }

    const label = metadata.aspectLabel;
    return `Your video format is ${label}. Please upload a video in a standard format (16:9 widescreen, 9:16 vertical, 1:1 square, or 4:5 portrait).`;
}


function describeAspectRatio(width: number, height: number): string {
    const ratio = width / height;

    if (Math.abs(ratio - 9 / 16) < 0.05) return "9:16";
    if (Math.abs(ratio - 1) < 0.05) return "1:1";
    if (Math.abs(ratio - 4 / 5) < 0.05) return "4:5";
    if (Math.abs(ratio - 16 / 9) < 0.05) return "16:9";
    if (Math.abs(ratio - 4 / 3) < 0.05) return "4:3";

    // Generic fraction
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const d = gcd(width, height);
    return `${width / d}:${height / d}`;
}

export function formatBytes(bytes: number): string {
    if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${bytes} B`;
}
