/**
 * Browser-side adaptive video compression using FFmpeg.wasm.
 *
 * Architecture:
 *   Browser → FFmpeg.wasm → Compressed File → Cloudinary
 *
 * FFmpeg is NEVER loaded on initial page load — it is lazy-loaded
 * only when needed (video.size > TARGET_UPLOAD_BYTES).
 *
 * Compression Strategy (3 adaptive passes):
 *   Pass 1: Original resolution, 30fps, target bitrate for ~85MB
 *   Pass 2: Original resolution, 30fps, lower bitrate for ~75MB
 *   Pass 3: 720p max, 30fps, lower bitrate
 *
 * Memory management:
 *   - FFmpeg virtual filesystem is cleaned after each attempt
 *   - Object URLs are revoked
 *   - AbortSignal is respected for cancellation
 */

import { TARGET_UPLOAD_BYTES, MAX_UPLOAD_BYTES, formatBytes } from "./video-validator";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CompressionProgress {
    stage: "loading" | "compressing" | "done";
    /** 0-100 */
    percent: number;
    /** Current compressed size in bytes (known after each pass attempt) */
    currentBytes?: number;
    pass?: number;
    totalPasses?: number;
}

export interface CompressionResult {
    file: File;
    originalBytes: number;
    optimizedBytes: number;
    reductionPercent: number;
}

export class CompressionError extends Error {
    constructor(
        message: string,
        public readonly reason:
            | "QUALITY_LOSS"     // Could not compress without destroying quality
            | "CANCELLED"        // User cancelled
            | "BROWSER_ERROR"    // FFmpeg/browser crash
            | "LOAD_ERROR"       // Failed to load FFmpeg.wasm
    ) {
        super(message);
        this.name = "CompressionError";
    }
}

// ─── Compression pass configurations ─────────────────────────────────────────

interface CompressionPass {
    label: string;
    /** Max height (null = keep original) */
    maxHeight: number | null;
    /** Target video bitrate in kbps */
    videoBitrateKbps: number;
    /** Max frames per second */
    fps: number;
}

/**
 * Three adaptive passes: preserve quality as long as possible,
 * reduce resolution only as a last resort.
 */
function buildPasses(durationSeconds: number): CompressionPass[] {
    // Calculate bitrate needed to hit ~85MB for this duration
    // Formula: target_bytes * 8 / duration_seconds / 1000 = kbps
    // Reserve ~128kbps for audio
    const targetBytes = 85 * 1024 * 1024;
    const audioBitrateKbps = 128;
    const totalBitrateKbps = Math.floor((targetBytes * 8) / durationSeconds / 1000);
    const videoBitratePass1 = Math.max(totalBitrateKbps - audioBitrateKbps, 400);

    return [
        {
            label: "Reducing bitrate (preserving resolution)…",
            maxHeight: null,          // keep original resolution
            videoBitrateKbps: videoBitratePass1,
            fps: 30,
        },
        {
            label: "Reducing bitrate further…",
            maxHeight: null,
            videoBitrateKbps: Math.floor(videoBitratePass1 * 0.75),
            fps: 30,
        },
        {
            label: "Reducing resolution to 720p…",
            maxHeight: 720,
            videoBitrateKbps: Math.max(Math.floor(videoBitratePass1 * 0.65), 350),
            fps: 30,
        },
    ];
}

// ─── FFmpeg lazy-loader (singleton) ──────────────────────────────────────────

type FFmpegInstance = import("@ffmpeg/ffmpeg").FFmpeg;
let _ffmpegInstance: FFmpegInstance | null = null;
let _ffmpegLoading: Promise<FFmpegInstance> | null = null;

/**
 * Lazy-loads FFmpeg.wasm.
 * Returns the same instance on repeated calls (singleton).
 * Throws CompressionError("LOAD_ERROR") if loading fails.
 */
async function getFFmpeg(
    onProgress?: (p: CompressionProgress) => void
): Promise<FFmpegInstance> {
    // Return cached instance
    if (_ffmpegInstance) return _ffmpegInstance;

    // Coalesce concurrent load attempts
    if (_ffmpegLoading) return _ffmpegLoading;

    _ffmpegLoading = (async () => {
        onProgress?.({ stage: "loading", percent: 0 });

        try {
            // Dynamic import — never included in the initial bundle
            const { FFmpeg } = await import("@ffmpeg/ffmpeg");
            const { fetchFile, toBlobURL } = await import("@ffmpeg/util");

            // Silence unused warning — fetchFile is used inside compression loop
            void fetchFile;

            const ffmpeg = new FFmpeg();

            // Load from CDN — use jsDelivr for reliability
            const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";

            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
            });

            onProgress?.({ stage: "loading", percent: 100 });
            _ffmpegInstance = ffmpeg;
            return ffmpeg;
        } catch (err) {
            _ffmpegLoading = null; // Allow retry
            throw new CompressionError(
                "Failed to load video processor. Please check your internet connection and try again.",
                "LOAD_ERROR"
            );
        } finally {
            _ffmpegLoading = null;
        }
    })();

    return _ffmpegLoading;
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Compresses a video file browser-side using FFmpeg.wasm.
 *
 * Only call this when file.size > TARGET_UPLOAD_BYTES (90 MB).
 *
 * @param file - Source video file (≤500 MB, ≤180s, validated)
 * @param durationSeconds - Pre-validated duration from video-validator
 * @param onProgress - Callback for live progress updates
 * @param signal - AbortSignal for cancellation support
 * @returns CompressionResult with the compressed File
 * @throws CompressionError if cannot compress below MAX_UPLOAD_BYTES
 */
export async function compressVideo(
    file: File,
    durationSeconds: number,
    onProgress: (p: CompressionProgress) => void,
    signal?: AbortSignal
): Promise<CompressionResult> {
    const { fetchFile } = await import("@ffmpeg/util");

    const ffmpeg = await getFFmpeg(onProgress);

    const passes = buildPasses(durationSeconds);
    const inputName = "input.mp4";
    let lastOutputBytes = file.size;

    // Write source file to FFmpeg virtual filesystem once
    onProgress({ stage: "compressing", percent: 0, pass: 0, totalPasses: passes.length });
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    for (let i = 0; i < passes.length; i++) {
        // Respect cancellation
        if (signal?.aborted) {
            await cleanupFFmpeg(ffmpeg, inputName);
            throw new CompressionError("Compression cancelled by user.", "CANCELLED");
        }

        const pass = passes[i];
        const outputName = `output_pass${i}.mp4`;

        onProgress({
            stage: "compressing",
            percent: Math.round(((i) / passes.length) * 90),
            pass: i + 1,
            totalPasses: passes.length,
            currentBytes: lastOutputBytes,
        });

        // Build FFmpeg args
        const args = buildFFmpegArgs(inputName, outputName, pass);

        // Wire FFmpeg progress to our callback
        ffmpeg.on("progress", ({ progress }) => {
            if (signal?.aborted) return;
            const basePercent = Math.round((i / passes.length) * 90);
            const passPercent = Math.round((progress / passes.length) * 90);
            onProgress({
                stage: "compressing",
                percent: Math.min(basePercent + passPercent, 89),
                pass: i + 1,
                totalPasses: passes.length,
                currentBytes: lastOutputBytes,
            });
        });

        try {
            await ffmpeg.exec(args);
        } catch (execErr) {
            // Might be cancelled
            if (signal?.aborted) {
                await cleanupFFmpeg(ffmpeg, inputName, outputName);
                throw new CompressionError("Compression cancelled by user.", "CANCELLED");
            }
            throw new CompressionError(
                "Your device could not process this video. Please use a smaller video or compress it before uploading.",
                "BROWSER_ERROR"
            );
        }

        ffmpeg.off("progress", () => undefined);

        // Read the output and check size
        let outputData: Uint8Array;
        try {
            outputData = (await ffmpeg.readFile(outputName)) as Uint8Array;
        } catch {
            // Output file not created — FFmpeg likely failed silently
            await cleanupFFmpeg(ffmpeg, inputName, outputName);
            throw new CompressionError(
                "Video processing failed. Please try a different video.",
                "BROWSER_ERROR"
            );
        }

        lastOutputBytes = outputData.length;

        // Clean output from FS before next pass
        try { await ffmpeg.deleteFile(outputName); } catch { /* ignore */ }

        // Check if we hit the target
        if (outputData.length <= TARGET_UPLOAD_BYTES) {
            await cleanupFFmpeg(ffmpeg, inputName);
            onProgress({ stage: "done", percent: 100, currentBytes: outputData.length });

            const compressedFile = new File(
                // Cast to ensure Uint8Array<ArrayBuffer> (not SharedArrayBuffer) for BlobPart
                [new Uint8Array(outputData.buffer as ArrayBuffer)],
                file.name.replace(/\.[^.]+$/, "") + "_optimized.mp4",
                { type: "video/mp4" }
            );

            return {
                file: compressedFile,
                originalBytes: file.size,
                optimizedBytes: outputData.length,
                reductionPercent: Math.round((1 - outputData.length / file.size) * 100),
            };
        }

        // Not small enough yet — but still within hard limit after all passes?
        if (i === passes.length - 1) {
            await cleanupFFmpeg(ffmpeg, inputName);

            if (outputData.length <= MAX_UPLOAD_BYTES) {
                // Between 90–100 MB — still acceptable
                onProgress({ stage: "done", percent: 100, currentBytes: outputData.length });

                const compressedFile = new File(
                    // Cast to ensure Uint8Array<ArrayBuffer> (not SharedArrayBuffer) for BlobPart
                    [new Uint8Array(outputData.buffer as ArrayBuffer)],
                    file.name.replace(/\.[^.]+$/, "") + "_optimized.mp4",
                    { type: "video/mp4" }
                );

                return {
                    file: compressedFile,
                    originalBytes: file.size,
                    optimizedBytes: outputData.length,
                    reductionPercent: Math.round((1 - outputData.length / file.size) * 100),
                };
            }

            // Could not reach ≤100 MB
            throw new CompressionError(
                `We couldn't optimize this video below the ${formatBytes(MAX_UPLOAD_BYTES)} upload limit without significant quality loss. The best we achieved was ${formatBytes(outputData.length)}. Please choose a shorter or smaller video.`,
                "QUALITY_LOSS"
            );
        }
    }

    // Should not reach here — the loop always returns or throws
    await cleanupFFmpeg(ffmpeg, inputName);
    throw new CompressionError("Compression failed unexpectedly.", "BROWSER_ERROR");
}

// ─── FFmpeg argument builder ──────────────────────────────────────────────────

function buildFFmpegArgs(input: string, output: string, pass: CompressionPass): string[] {
    const args: string[] = ["-i", input];

    // Video codec: H.264 for maximum compatibility
    args.push("-c:v", "libx264");
    args.push("-preset", "fast");         // balance speed vs compression
    args.push("-crf", "23");              // quality anchor (overridden by -maxrate)
    args.push("-maxrate", `${pass.videoBitrateKbps}k`);
    args.push("-bufsize", `${pass.videoBitrateKbps * 2}k`);

    // Resolution constraint (only if downscaling)
    if (pass.maxHeight !== null) {
        // Scale to maxHeight, keep aspect ratio, ensure dimensions are divisible by 2
        args.push("-vf", `scale=-2:${pass.maxHeight}`);
    }

    // Frame rate cap
    args.push("-r", String(pass.fps));

    // Audio: AAC 128kbps stereo
    args.push("-c:a", "aac");
    args.push("-b:a", "128k");
    args.push("-ac", "2");

    // Ensure moov atom at front for streaming
    args.push("-movflags", "+faststart");

    // Overwrite output
    args.push("-y", output);

    return args;
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────

async function cleanupFFmpeg(ffmpeg: FFmpegInstance, ...filenames: string[]): Promise<void> {
    for (const name of filenames) {
        try { await ffmpeg.deleteFile(name); } catch { /* ignore */ }
    }
}

/**
 * Terminates the FFmpeg instance and clears the singleton.
 * Call this on page unload or after a cancel to free memory.
 */
export function terminateFFmpeg(): void {
    if (_ffmpegInstance) {
        try { _ffmpegInstance.terminate(); } catch { /* ignore */ }
        _ffmpegInstance = null;
    }
}

/** Returns true if the file needs compression before uploading */
export function needsCompression(file: File): boolean {
    return file.size > TARGET_UPLOAD_BYTES;
}
