"use client";

import * as React from "react";
import {
    Upload, Film, Image as ImageIcon, X, CloudUpload,
    CheckCircle2, AlertCircle, Loader2, Zap, XCircle, Sparkles,
} from "lucide-react";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useDraftPostStore } from "@/store/useDraftPostStore";
import { useConnectedAccounts } from "@/hooks/useConnectedAccounts";
import {
    validateVideoFile,
    validateImageFile,
    isVideoFile,
    isImageFile,
    formatBytes,
    TARGET_UPLOAD_BYTES,
} from "@/lib/video-validator";
import { needsCompression } from "@/lib/ffmpeg-compressor";
import type { CompressionProgress } from "@/lib/ffmpeg-compressor";
import type { UploadStage } from "@/types/post.types";

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCEPTED = "video/mp4,video/quicktime,video/webm,image/jpeg,image/png,image/webp";

// ─── Sub-components ───────────────────────────────────────────────────────────

function CompressionProgressBar({
    progress,
    originalBytes,
    onCancel,
}: {
    progress: CompressionProgress;
    originalBytes: number;
    onCancel: () => void;
}) {
    const passLabel = progress.pass != null && progress.totalPasses != null
        ? `Pass ${progress.pass} of ${progress.totalPasses}`
        : "";

    return (
        <div className={cn(
            "flex flex-col gap-5 rounded-[var(--radius-xl)] border border-primary/20 overflow-hidden",
            "animate-fade-in"
        )}
            style={{ background: "var(--gradient-primary-subtle)" }}
        >
            {/* Gradient header strip */}
            <div className="h-1" style={{ background: "var(--gradient-primary)" }} />

            <div className="px-6 pb-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)]"
                            style={{ background: "rgba(108,92,231,0.15)" }}
                        >
                            <Zap className="h-5 w-5 text-primary animate-pulse" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground">
                                {progress.stage === "loading"
                                    ? "Loading video processor…"
                                    : "Optimizing your video…"}
                            </p>
                            <p className="text-xs text-foreground-muted mt-0.5">
                                {progress.stage === "loading"
                                    ? "Downloading FFmpeg (one-time, ~10 MB)…"
                                    : "Please keep this tab open."}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        aria-label="Cancel compression"
                        className={cn(
                            "flex items-center gap-1.5 text-xs font-semibold",
                            "text-foreground-muted hover:text-error transition-colors",
                            "rounded-[var(--radius-md)] px-3 py-2",
                            "border border-border hover:border-error/30 hover:bg-red-50 dark:hover:bg-red-950/20"
                        )}
                    >
                        <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        Cancel
                    </button>
                </div>

                {/* Progress bar */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground-muted font-medium">{passLabel}</span>
                        <span className="font-black text-primary tabular-nums text-sm">{progress.percent}%</span>
                    </div>
                    <div className="relative h-2 w-full rounded-full bg-border/60 overflow-hidden">
                        <div
                            className="absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out"
                            style={{
                                width: `${progress.percent}%`,
                                background: "var(--gradient-primary)",
                                boxShadow: "0 0 8px rgba(108,92,231,0.4)",
                            }}
                            role="progressbar"
                            aria-valuenow={progress.percent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label="Compression progress"
                        />
                        {/* Shimmer overlay */}
                        <div
                            className="absolute inset-y-0 left-0 rounded-full animate-shimmer pointer-events-none"
                            style={{ width: `${progress.percent}%` }}
                        />
                    </div>
                    <div className="flex items-center justify-between text-xs text-foreground-muted">
                        <span>Original: <span className="font-semibold">{formatBytes(originalBytes)}</span></span>
                        {progress.currentBytes != null && progress.currentBytes < originalBytes && (
                            <span>Current: <span className="font-semibold text-success">{formatBytes(progress.currentBytes)}</span></span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CompressionSuccessBanner({
    originalBytes,
    optimizedBytes,
}: {
    originalBytes: number;
    optimizedBytes: number;
}) {
    const reductionPct = Math.round((1 - optimizedBytes / originalBytes) * 100);
    return (
        <div className={cn(
            "flex items-center gap-3 rounded-[var(--radius-lg)] border border-green-200/60",
            "bg-green-50 dark:border-green-800/40 dark:bg-green-950/20 px-4 py-3 animate-fade-in"
        )}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 shrink-0">
                <CheckCircle2 className="h-4 w-4 text-success animate-check-in" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-0.5">
                <p className="text-sm font-bold text-foreground">Video optimized</p>
                <p className="text-xs text-foreground-muted">
                    {formatBytes(originalBytes)} → <span className="font-semibold text-success">{formatBytes(optimizedBytes)}</span>
                    <span className="ml-2 font-bold text-success">↓{reductionPct}% smaller</span>
                </p>
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function UploadStep() {
    const mediaFile = useDraftPostStore((s) => s.draft.mediaFile);
    const rawCaption = useDraftPostStore((s) => s.draft.rawCaption);
    const setMediaFile = useDraftPostStore((s) => s.setMediaFile);
    const setRawCaption = useDraftPostStore((s) => s.setRawCaption);
    const setStep = useDraftPostStore((s) => s.setStep);
    const { accounts } = useConnectedAccounts();

    const [isDragging, setIsDragging] = React.useState(false);
    const [stage, setStage] = React.useState<UploadStage>(mediaFile ? "ready" : "idle");
    const [error, setError] = React.useState<string | null>(null);
    const [compressionProgress, setCompressionProgress] = React.useState<CompressionProgress | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const abortRef = React.useRef<AbortController | null>(null);

    // ── File processing pipeline ────────────────────────────────────────────

    const processFile = React.useCallback(async (file: File) => {
        setError(null);
        setMediaFile(null);
        setStage("selected");

        // ── Image path ─────────────────────────────────────────────────────
        if (isImageFile(file)) {
            const imgResult = validateImageFile(file);
            if (!imgResult.ok) {
                setError(imgResult.error);
                setStage("error");
                return;
            }
            const previewUrl = URL.createObjectURL(file);
            setMediaFile({ file, previewUrl, type: "image", originalSize: file.size });
            setStage("ready");
            return;
        }

        // ── Unknown type ───────────────────────────────────────────────────
        if (!isVideoFile(file)) {
            setError("Only video and image files are supported.");
            setStage("error");
            return;
        }

        // ── Video path ─────────────────────────────────────────────────────
        setStage("validating");

        const validationResult = await validateVideoFile(file);
        if (!validationResult.ok) {
            setError(validationResult.error);
            setStage("error");
            return;
        }

        const { metadata } = validationResult;

        // Small enough — skip compression
        if (!needsCompression(file)) {
            const previewUrl = URL.createObjectURL(file);
            setMediaFile({
                file,
                previewUrl,
                type: "video",
                durationSeconds: metadata.durationSeconds,
                originalSize: file.size,
                optimizedSize: file.size,
                width: metadata.width,
                height: metadata.height,
                aspectRatio: metadata.aspectRatio,
            });
            setStage("ready");
            return;
        }

        // Needs compression
        setStage("compressing");
        setCompressionProgress({ stage: "loading", percent: 0 });

        const abort = new AbortController();
        abortRef.current = abort;

        try {
            const { compressVideo, CompressionError } = await import("@/lib/ffmpeg-compressor");

            const result = await compressVideo(
                file,
                metadata.durationSeconds,
                (p) => setCompressionProgress(p),
                abort.signal
            );

            const previewUrl = URL.createObjectURL(result.file);
            setMediaFile({
                file: result.file,
                previewUrl,
                type: "video",
                durationSeconds: metadata.durationSeconds,
                originalSize: result.originalBytes,
                optimizedSize: result.optimizedBytes,
                width: metadata.width,
                height: metadata.height,
                aspectRatio: metadata.aspectRatio,
            });
            setStage("ready");
        } catch (err) {
            const { CompressionError } = await import("@/lib/ffmpeg-compressor");

            if (err instanceof CompressionError) {
                if (err.reason === "CANCELLED") {
                    setStage("idle");
                    setCompressionProgress(null);
                    return;
                }
                setError(err.message);
            } else {
                setError("An unexpected error occurred. Please try a different file.");
            }
            setStage("error");
        } finally {
            abortRef.current = null;
            setCompressionProgress(null);
        }
    }, [setMediaFile]);

    const handleCancel = () => {
        abortRef.current?.abort();
    };

    const handleRemove = () => {
        if (mediaFile?.previewUrl) URL.revokeObjectURL(mediaFile.previewUrl);
        setMediaFile(null);
        setStage("idle");
        setError(null);
        setCompressionProgress(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
        e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    const isProcessing = stage === "validating" || stage === "compressing";

    return (
        <div className="flex flex-col gap-6 animate-fade-in-up">
            {/* Header */}
            <div
                className="rounded-2xl p-5"
                style={{
                    background: "white",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                    border: "1px solid rgba(108,92,231,0.1)",
                }}
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                        {/* Brand logo */}
                        <div
                            className="relative h-12 w-12 shrink-0 rounded-2xl overflow-hidden"
                            style={{ boxShadow: "0 6px 20px rgba(108,92,231,0.4)" }}
                        >
                            <NextImage
                                src="/logo.png"
                                alt="CrossPost AI"
                                fill
                                sizes="48px"
                                className="object-cover"
                                priority
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-gray-900 leading-tight">
                                Upload your media
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                                Short-form videos up to 3 minutes · Vertical (9:16) or square (1:1) · Images supported
                            </p>
                        </div>
                    </div>

                    {/* Connected Accounts Indicator */}
                    <a
                        href="/accounts"
                        className={cn(
                            "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all self-start sm:self-auto shrink-0",
                            accounts.length > 0
                                ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : "bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
                        )}
                    >
                        <span>{accounts.length} {accounts.length === 1 ? "Account" : "Accounts"} Connected</span>
                        <span className="text-[10px] font-normal opacity-80">{accounts.length > 0 ? "Manage →" : "Connect →"}</span>
                    </a>
                </div>
            </div>

            {/* Drop zone — shown when no file selected */}
            {stage === "idle" && (
                <div
                    role="button"
                    tabIndex={0}
                    aria-label="Upload media file — click or drag and drop"
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false);
                    }}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
                    className="group relative flex flex-col items-center justify-center gap-6 cursor-pointer select-none overflow-hidden py-16 px-8 rounded-2xl bg-white transition-all duration-300"
                    style={{
                        border: isDragging
                            ? "2px solid #6C5CE7"
                            : "2px dashed rgba(108,92,231,0.3)",
                        boxShadow: isDragging
                            ? "0 0 0 4px rgba(108,92,231,0.1), 0 8px 32px rgba(108,92,231,0.15)"
                            : "0 2px 12px rgba(0,0,0,0.04)",
                        background: isDragging
                            ? "rgba(108,92,231,0.04)"
                            : "white",
                        transform: isDragging ? "scale(1.01)" : undefined,
                    }}
                >
                    {/* Background decoration */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(108,92,231,0.06) 0%, transparent 70%)" }}
                    />

                    {/* Floating upload icon */}
                    <div
                        className={cn(
                            "relative flex h-20 w-20 items-center justify-center rounded-[var(--radius-xl)]",
                            "transition-all duration-300",
                            isDragging ? "scale-110" : "animate-float group-hover:scale-105"
                        )}
                        style={{
                            background: isDragging ? "var(--gradient-primary)" : "rgba(108,92,231,0.12)",
                            boxShadow: isDragging ? "var(--glow-primary)" : "0 8px 32px rgba(108,92,231,0.12)",
                        }}
                    >
                        {isDragging ? (
                            <CloudUpload className="h-10 w-10 text-white" aria-hidden="true" />
                        ) : (
                            <Upload className="h-10 w-10 text-primary transition-all" aria-hidden="true" />
                        )}
                        {/* Shine overlay */}
                        <div className="absolute inset-0 rounded-[var(--radius-xl)] bg-white/10" />
                    </div>

                    <div className="text-center relative z-10">
                        <p className="text-lg font-black text-foreground tracking-tight">
                            {isDragging ? "Release to upload" : "Drag & drop your media"}
                        </p>
                        <p className="text-sm text-foreground-muted mt-1.5">
                            or{" "}
                            <span className="text-primary font-semibold underline underline-offset-2 decoration-primary/40">
                                browse files
                            </span>
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                            {["MP4", "MOV", "WebM", "JPEG", "PNG", "WebP"].map((fmt) => (
                                <span
                                    key={fmt}
                                    className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide"
                                    style={{
                                        background: "rgba(108,92,231,0.1)",
                                        color: "var(--color-primary)",
                                        border: "1px solid rgba(108,92,231,0.2)",
                                    }}
                                >
                                    {fmt}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-foreground-muted/60 mt-3">
                            Videos up to {formatBytes(TARGET_UPLOAD_BYTES)} upload directly · Larger files auto-optimized
                        </p>
                    </div>

                    <input
                        ref={inputRef}
                        type="file"
                        accept={ACCEPTED}
                        className="sr-only"
                        onChange={handleInputChange}
                        aria-hidden="true"
                    />
                </div>
            )}

            {/* Validating spinner */}
            {stage === "validating" && (
                <div className={cn(
                    "flex items-center gap-4 rounded-[var(--radius-xl)] border border-border",
                    "bg-surface px-6 py-5 animate-fade-in shadow-sm"
                )}>
                    <div
                        className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] shrink-0"
                        style={{ background: "rgba(108,92,231,0.12)" }}
                    >
                        <Loader2 className="h-5 w-5 text-primary animate-spin" aria-hidden="true" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-foreground">Checking your video…</p>
                        <p className="text-xs text-foreground-muted mt-0.5">
                            Verifying duration, aspect ratio, and file size.
                        </p>
                    </div>
                </div>
            )}

            {/* Compression progress */}
            {stage === "compressing" && compressionProgress && (
                <CompressionProgressBar
                    progress={compressionProgress}
                    originalBytes={compressionProgress.currentBytes ?? 0}
                    onCancel={handleCancel}
                />
            )}

            {/* File preview — shown after successful processing */}
            {stage === "ready" && mediaFile && (
                <div className={cn(
                    "rounded-[var(--radius-xl)] border border-border bg-surface overflow-hidden",
                    "shadow-md animate-scale-in"
                )}>
                    {/* Gradient top strip */}
                    <div className="h-[3px]" style={{ background: "var(--gradient-primary)" }} />

                    {/* Compression success banner */}
                    {mediaFile.originalSize != null &&
                        mediaFile.optimizedSize != null &&
                        mediaFile.optimizedSize < mediaFile.originalSize && (
                            <div className="px-5 pt-4">
                                <CompressionSuccessBanner
                                    originalBytes={mediaFile.originalSize}
                                    optimizedBytes={mediaFile.optimizedSize}
                                />
                            </div>
                        )}

                    {/* Preview */}
                    <div className="aspect-video w-full bg-gray-950 relative mt-4">
                        {mediaFile.type === "video" ? (
                            <video
                                src={mediaFile.previewUrl}
                                className="w-full h-full object-contain"
                                controls
                                muted
                                playsInline
                            />
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={mediaFile.previewUrl}
                                alt="Preview"
                                className="w-full h-full object-contain"
                            />
                        )}

                        {/* Type badge */}
                        <div className={cn(
                            "absolute top-3 left-3 flex items-center gap-1.5",
                            "rounded-full px-3 py-1.5 bg-black/70 backdrop-blur-md",
                            "text-white text-xs font-bold"
                        )}>
                            {mediaFile.type === "video" ? (
                                <Film className="h-3 w-3" aria-hidden="true" />
                            ) : (
                                <ImageIcon className="h-3 w-3" aria-hidden="true" />
                            )}
                            {mediaFile.type === "video" ? "Video" : "Image"}
                        </div>
                    </div>

                    {/* File info */}
                    <div className="flex items-center gap-3 px-5 py-4 bg-surface border-t border-border">
                        <div className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)]",
                        )}
                            style={{ background: "rgba(108,92,231,0.12)" }}
                        >
                            {mediaFile.type === "video" ? (
                                <Film className="h-4 w-4 text-primary" aria-hidden="true" />
                            ) : (
                                <ImageIcon className="h-4 w-4 text-primary" aria-hidden="true" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">
                                {mediaFile.file.name}
                            </p>
                            <p className="text-xs text-foreground-muted mt-0.5">
                                {formatBytes(mediaFile.file.size)}
                                {mediaFile.durationSeconds != null &&
                                    ` · ${Math.floor(mediaFile.durationSeconds / 60)}:${String(
                                        Math.floor(mediaFile.durationSeconds % 60)
                                    ).padStart(2, "0")}`}
                                {mediaFile.width && mediaFile.height &&
                                    ` · ${mediaFile.width}×${mediaFile.height}`}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-950/40">
                                <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                                <span className="text-xs font-bold text-success">Ready</span>
                            </div>
                            <button
                                type="button"
                                onClick={handleRemove}
                                aria-label="Remove file"
                                className={cn(
                                    "rounded-full p-1.5 text-foreground-muted",
                                    "hover:text-error hover:bg-red-50 dark:hover:bg-red-950/30",
                                    "transition-colors duration-100",
                                    "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                                )}
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error state */}
            {stage === "error" && error && (
                <div className={cn(
                    "flex items-start gap-4 rounded-[var(--radius-xl)] border border-error/20",
                    "bg-red-50 dark:bg-red-950/20 px-5 py-5 animate-fade-in"
                )}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-red-100 dark:bg-red-950/50 shrink-0">
                        <AlertCircle className="h-5 w-5 text-error" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p role="alert" className="text-sm font-bold text-error">
                            Upload failed
                        </p>
                        <p className="text-xs text-error/80 mt-1 leading-relaxed">{error}</p>
                        <button
                            type="button"
                            onClick={() => {
                                setStage("idle");
                                setError(null);
                                inputRef.current?.click();
                            }}
                            className="mt-3 text-xs font-bold text-primary hover:underline"
                        >
                            Try another file →
                        </button>
                    </div>
                </div>
            )}

            {/* Caption */}
            <div className="flex flex-col gap-2">
                <Textarea
                    label="Caption / brief description (optional)"
                    placeholder="What's this post about? The AI uses this to craft better titles and descriptions…"
                    value={rawCaption}
                    onChange={(e) => setRawCaption(e.target.value)}
                    rows={3}
                    showCharCount
                    maxLength={500}
                    description="The more context you give, the better the AI output."
                />
            </div>

            {/* Footer nav */}
            <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                    {stage === "ready" ? (
                        <>
                            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                            <p className="text-sm font-semibold text-success">Media ready</p>
                        </>
                    ) : isProcessing ? (
                        <>
                            <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                            <p className="text-sm text-foreground-muted">Processing…</p>
                        </>
                    ) : (
                        <p className="text-sm text-foreground-muted">Upload a file to continue</p>
                    )}
                </div>
                <button
                    disabled={stage !== "ready"}
                    onClick={() => setStep("generate")}
                    className={cn(
                        "flex items-center gap-2 px-6 h-11 rounded-[var(--radius-md)]",
                        "text-sm font-bold text-white tracking-wide",
                        "transition-all duration-200 active:scale-[0.97]",
                        "disabled:opacity-40 disabled:pointer-events-none",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    )}
                    style={{
                        background: "var(--gradient-primary)",
                        boxShadow: stage === "ready" ? "var(--shadow-primary)" : "none",
                    }}
                >
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    Continue
                    <span aria-hidden="true">→</span>
                </button>
            </div>
        </div>
    );
}
