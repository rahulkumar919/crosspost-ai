"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw, ExternalLink, CheckCircle2, AlertCircle, Plus, ArrowLeft, Rocket } from "lucide-react";
import { cn, platformLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { YoutubeIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/platform-icons";
import { useDraftPostStore } from "@/store/useDraftPostStore";
import { usePublishPost } from "@/hooks/usePublishPost";
import { usePublishStatusPolling } from "@/hooks/usePublishStatusPolling";
import { uploadMedia } from "@/lib/api/media.api";
import { retryPlatform } from "@/lib/api/posts.api";
import type { Platform } from "@/types/account.types";
import type { PublishPlatformResult, PublishStatus } from "@/types/post.types";

const platformIcons: Record<Platform, React.ComponentType<{ className?: string }>> = {
    youtube: YoutubeIcon,
    instagram: InstagramIcon,
    linkedin: LinkedinIcon,
};

const platformConfig: Record<Platform, {
    gradient: string;
    glow: string;
    bg: string;
    successBorder: string;
    failBorder: string;
}> = {
    youtube: {
        gradient: "linear-gradient(135deg, #ff0000, #ff4757)",
        glow: "0 0 20px rgba(255, 0, 0, 0.2)",
        bg: "rgba(255, 0, 0, 0.06)",
        successBorder: "rgba(0, 184, 148, 0.3)",
        failBorder: "rgba(214, 48, 49, 0.3)",
    },
    instagram: {
        gradient: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
        glow: "0 0 20px rgba(225, 48, 108, 0.2)",
        bg: "rgba(225, 48, 108, 0.06)",
        successBorder: "rgba(0, 184, 148, 0.3)",
        failBorder: "rgba(214, 48, 49, 0.3)",
    },
    linkedin: {
        gradient: "linear-gradient(135deg, #0077b5, #00a0dc)",
        glow: "0 0 20px rgba(0, 119, 181, 0.2)",
        bg: "rgba(0, 119, 181, 0.06)",
        successBorder: "rgba(0, 184, 148, 0.3)",
        failBorder: "rgba(214, 48, 49, 0.3)",
    },
};

// ─── Animated dots loader ──────────────────────────────────────────────────────
function PublishingDots() {
    return (
        <div className="flex items-center gap-1" aria-hidden="true">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft"
                    style={{ animationDelay: `${i * 0.25}s` }}
                />
            ))}
        </div>
    );
}

// ─── Per-platform result card ──────────────────────────────────────────────────
function PlatformResultCard({
    platform,
    result,
    isUploading,
    isRetrying,
    onRetry,
}: {
    platform: Platform;
    result: { status: PublishStatus; errorMessage?: string; postUrl?: string; retryable?: boolean } | undefined;
    isUploading: boolean;
    isRetrying: boolean;
    onRetry: () => void;
}) {

    const Icon = platformIcons[platform];
    const cfg = platformConfig[platform];

    const isPublished = result?.status === "published";
    const isFailed = result?.status === "failed";
    const isProcessing = !result && !isUploading;

    return (
        <div
            className={cn(
                "flex items-center gap-4 rounded-[var(--radius-xl)] border-2 overflow-hidden",
                "transition-all duration-500"
            )}
            style={{
                borderColor: isPublished
                    ? "rgba(0, 184, 148, 0.4)"
                    : isFailed
                        ? "rgba(214, 48, 49, 0.35)"
                        : "var(--border-color)",
                background: isPublished
                    ? "rgba(0, 184, 148, 0.06)"
                    : isFailed
                        ? "rgba(214, 48, 49, 0.05)"
                        : "var(--surface)",
                boxShadow: isPublished ? "0 0 20px rgba(0,184,148,0.1)" : "none",
            }}
            role="listitem"
        >
            {/* Platform colored left strip */}
            <div
                className="self-stretch w-1.5 shrink-0"
                style={{
                    background: isPublished
                        ? "linear-gradient(180deg, #00b894, #00cec9)"
                        : isFailed
                            ? "linear-gradient(180deg, #d63031, #e17055)"
                            : cfg.gradient,
                }}
            />

            <div className="flex items-center gap-4 flex-1 py-4 pr-4">
                {/* Platform icon */}
                <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)]"
                    style={{
                        background: cfg.gradient,
                        boxShadow: cfg.glow,
                    }}
                >
                    <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-foreground">
                        {platformLabel(platform)}
                    </p>
                    {result?.errorMessage && (
                        <p className="text-xs text-error mt-0.5 line-clamp-2 leading-relaxed">
                            {result.errorMessage}
                        </p>
                    )}
                    {result?.postUrl && (
                        <a
                            href={result.postUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-success hover:underline mt-0.5 font-bold"
                        >
                            View post
                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                    )}
                    {isProcessing && !isUploading && (
                        <div className="flex items-center gap-2 mt-0.5">
                            <PublishingDots />
                            <p className="text-xs text-foreground-muted font-medium">In queue…</p>
                        </div>
                    )}
                </div>

                {/* Status + actions */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                    {/* Status icon */}
                    {isPublished ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-950/40">
                            <CheckCircle2 className="h-3.5 w-3.5 text-success animate-check-in" />
                            <span className="text-xs font-black text-success">Live</span>
                        </div>
                    ) : isFailed ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950/40">
                            <AlertCircle className="h-3.5 w-3.5 text-error" />
                            <span className="text-xs font-black text-error">Failed</span>
                        </div>
                    ) : (
                        <StatusBadge status={result?.status ?? "queued"} />
                    )}

                    {/* Connect Account button if error is due to missing connection */}
                    {isFailed && (result?.errorMessage?.toLowerCase().includes("not connected") || result?.errorMessage?.toLowerCase().includes("account is no")) && (
                        <a
                            href="/accounts"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:scale-105 active:scale-95"
                            style={{
                                background: "linear-gradient(135deg, #6C5CE7, #a29bfe)",
                                boxShadow: "0 2px 10px rgba(108,92,231,0.35)",
                            }}
                        >
                            <span>Connect {platformLabel(platform)}</span>
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    )}

                    {/* Retry button */}
                    {isFailed && (
                        <Button
                            variant="outline"
                            size="sm"
                            isLoading={isRetrying}
                            loadingText="Retrying…"
                            onClick={onRetry}
                            className="gap-1.5 text-xs font-bold border-primary/30 text-primary hover:bg-primary/5"
                        >
                            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                            Retry
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PublishStep() {
    const draft = useDraftPostStore((s) => s.draft);
    const publishJob = useDraftPostStore((s) => s.publishJob);
    const resetDraft = useDraftPostStore((s) => s.resetDraft);
    const setStep = useDraftPostStore((s) => s.setStep);

    const publishMutation = usePublishPost();
    const queryClient = useQueryClient();
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadError, setUploadError] = React.useState<string | null>(null);
    const [retryingPlatform, setRetryingPlatform] = React.useState<Platform | null>(null);
    const hasStartedRef = React.useRef(false);

    const isPublishStarted = publishJob !== null || publishMutation.isPending || isUploading;

    usePublishStatusPolling(publishJob?.jobId ?? null);

    const includedDrafts = Object.values(draft.platformDrafts).filter((d) => d.isIncluded);

    const handlePublish = React.useCallback(async () => {
        if (!draft.mediaFile) {
            setUploadError("No media file found. Please go back and upload a file.");
            return;
        }

        setUploadError(null);
        setIsUploading(true);

        try {
            const uploaded = await uploadMedia(draft.mediaFile.file, setUploadProgress);
            setIsUploading(false);

            const fallbackTitle = draft.generatedTitle || draft.rawCaption || draft.mediaFile.file.name.replace(/\.[^/.]+$/, "") || "New Post";
            const fallbackDesc = draft.generatedDescription || draft.rawCaption || "Published via CrossPost AI";

            const preparedDrafts = includedDrafts.map((d) => ({
                ...d,
                title: (d.title && d.title.trim()) || fallbackTitle,
                description: (d.description && d.description.trim()) || fallbackDesc,
                hashtags: Array.isArray(d.hashtags) ? d.hashtags : [],
            }));

            publishMutation.mutate({
                mediaId: uploaded.mediaId,
                mediaUrl: uploaded.url,
                mediaType: uploaded.type,
                rawCaption: draft.rawCaption || undefined,
                aiTitle: draft.generatedTitle || fallbackTitle,
                aiDescription: draft.generatedDescription || fallbackDesc,
                aiHashtags: draft.generatedHashtags.length ? draft.generatedHashtags : undefined,
                platformDrafts: preparedDrafts,
            });
        } catch (err) {
            setIsUploading(false);
            setUploadError(
                err instanceof Error ? err.message : "Upload failed. Please try again."
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draft.mediaFile, draft.generatedTitle, draft.generatedDescription, draft.rawCaption, includedDrafts]);

    const handleRetry = async (platform: Platform) => {
        if (!publishJob) return;
        setRetryingPlatform(platform);
        try {
            await retryPlatform(publishJob.jobId, platform);
            await queryClient.invalidateQueries({
                queryKey: ["publishStatus", publishJob.jobId],
            });
        } finally {
            setRetryingPlatform(null);
        }
    };

    // Auto-start publish on mount exactly once
    React.useEffect(() => {
        if (!hasStartedRef.current && !publishJob) {
            hasStartedRef.current = true;
            handlePublish();
        }
    }, [handlePublish, publishJob]);

    const allDone = publishJob?.results.every(
        (r) => r.status === "published" || r.status === "failed"
    );
    const allPublished = publishJob?.results.every((r) => r.status === "published");
    const failedCount = publishJob?.results.filter((r) => r.status === "failed").length ?? 0;
    const publishedCount = publishJob?.results.filter((r) => r.status === "published").length ?? 0;

    return (
        <div className="flex flex-col gap-8 animate-fade-in-up">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-black text-foreground tracking-tight">
                    {allDone
                        ? allPublished
                            ? "🎉 Content is live!"
                            : "Published with some issues"
                        : "Publishing…"}
                </h2>
                <p className="text-sm text-foreground-muted mt-2 leading-relaxed">
                    {isUploading
                        ? "Uploading your media file…"
                        : allDone
                            ? allPublished
                                ? `Your content is now live on ${publishedCount} platform${publishedCount !== 1 ? "s" : ""}.`
                                : `Published to ${publishedCount}, failed on ${failedCount} — retry below.`
                            : "Publishing your content to selected platforms…"}
                </p>
            </div>

            {/* Upload or Publish error */}
            {(uploadError || publishMutation.error) && (
                <div className={cn(
                    "flex items-start gap-4 rounded-[var(--radius-xl)] border border-error/20",
                    "bg-red-50 dark:bg-red-950/20 p-5 animate-fade-in"
                )}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-red-100 dark:bg-red-950/50 shrink-0">
                        <AlertCircle className="h-5 w-5 text-error" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-error">
                            {uploadError ? "Upload failed" : "Publish failed"}
                        </p>
                        <p className="text-xs text-error/80 mt-0.5">
                            {uploadError || (publishMutation.error instanceof Error ? publishMutation.error.message : "Something went wrong while initiating publishing.")}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-xs font-bold"
                                onClick={() => {
                                    setUploadError(null);
                                    hasStartedRef.current = false;
                                    handlePublish();
                                }}
                            >
                                Try again
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs font-bold text-foreground-muted"
                                onClick={() => setStep("preview")}
                            >
                                Back to Preview
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload progress bar */}
            {isUploading && (
                <div className={cn(
                    "flex flex-col gap-4 rounded-[var(--radius-xl)] border border-primary/20 overflow-hidden",
                    "animate-fade-in"
                )}
                    style={{ background: "var(--gradient-primary-subtle)" }}
                >
                    <div className="h-1 animate-gradient-shift" style={{ background: "var(--gradient-primary)", backgroundSize: "200% 200%" }} />
                    <div className="px-6 pb-6 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div
                                className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] shrink-0"
                                style={{ background: "rgba(108,92,231,0.15)" }}
                            >
                                <Rocket className="h-5 w-5 text-primary animate-pulse" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-foreground">Uploading media</span>
                                    <span className="font-black text-primary text-sm tabular-nums">{uploadProgress}%</span>
                                </div>
                                <p className="text-xs text-foreground-muted mt-0.5 truncate">{draft.mediaFile?.file.name}</p>
                            </div>
                        </div>
                        <div className="relative h-2 w-full rounded-full bg-border/60 overflow-hidden">
                            <div
                                className="absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out"
                                style={{
                                    width: `${uploadProgress}%`,
                                    background: "var(--gradient-primary)",
                                    boxShadow: "0 0 8px rgba(108,92,231,0.5)",
                                }}
                                role="progressbar"
                                aria-valuenow={uploadProgress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label="Upload progress"
                            />
                            <div
                                className="absolute inset-y-0 left-0 rounded-full animate-shimmer pointer-events-none"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Platform result cards */}
            <div className="flex flex-col gap-3" role="list" aria-label="Publishing status per platform">
                {includedDrafts.map((platformDraft, idx) => {
                    const platform = platformDraft.platform as Platform;
                    const result = publishJob?.results.find((r) => r.platform === platform);
                    const isRetrying = retryingPlatform === platform;

                    return (
                        <div key={platform} className={cn("animate-fade-in-up", `stagger-${idx + 1}`)}>
                            <PlatformResultCard
                                platform={platform}
                                result={result}
                                isUploading={isUploading}
                                isRetrying={isRetrying}
                                onRetry={() => handleRetry(platform)}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Summary banner */}
            {allDone && (
                <div
                    className={cn(
                        "flex items-center gap-4 rounded-[var(--radius-xl)] border-2 overflow-hidden",
                        "animate-scale-in"
                    )}
                    style={{
                        borderColor: allPublished ? "rgba(0,184,148,0.4)" : "rgba(253,203,110,0.5)",
                        background: allPublished ? "rgba(0,184,148,0.06)" : "rgba(253,203,110,0.08)",
                        boxShadow: allPublished ? "0 0 30px rgba(0,184,148,0.1)" : "none",
                    }}
                    role="status"
                >
                    {/* Left strip */}
                    <div
                        className="self-stretch w-1.5 shrink-0"
                        style={{
                            background: allPublished
                                ? "linear-gradient(180deg, #00b894, #00cec9)"
                                : "linear-gradient(180deg, #fdcb6e, #f0932b)",
                        }}
                    />

                    <div className="flex items-center gap-4 flex-1 py-5 pr-5">
                        <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)]"
                            style={{
                                background: allPublished
                                    ? "linear-gradient(135deg, #00b894, #00cec9)"
                                    : "linear-gradient(135deg, #fdcb6e, #f0932b)",
                            }}
                        >
                            {allPublished ? (
                                <CheckCircle2 className="h-6 w-6 text-white animate-check-in" />
                            ) : (
                                <AlertCircle className="h-6 w-6 text-white" />
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-black text-foreground">
                                {allPublished ? "Published successfully!" : "Partially published"}
                            </p>
                            <p className="text-xs text-foreground-muted mt-0.5">
                                {allPublished
                                    ? `Your content is now live on ${publishedCount} platform${publishedCount !== 1 ? "s" : ""}.`
                                    : `${publishedCount} succeeded, ${failedCount} failed. Use the Retry button above.`}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer nav */}
            {allDone && (
                <div className="flex items-center justify-between pt-2 animate-fade-in">
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={() => setStep("preview")}
                        className="gap-1.5 text-foreground-muted hover:text-foreground font-semibold"
                    >
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        Back to Preview
                    </Button>

                    <button
                        onClick={resetDraft}
                        className={cn(
                            "flex items-center gap-2 px-6 h-11 rounded-[var(--radius-md)]",
                            "text-sm font-bold text-white tracking-wide",
                            "transition-all duration-200 active:scale-[0.97]"
                        )}
                        style={{
                            background: "var(--gradient-primary)",
                            boxShadow: "var(--shadow-primary)",
                        }}
                    >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Create New Post
                    </button>
                </div>
            )}
        </div>
    );
}
