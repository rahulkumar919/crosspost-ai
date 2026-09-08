import * as React from "react";
import { ThumbsUp, Eye, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlatformDraft } from "@/types/post.types";
import type { MediaFile } from "@/types/post.types";

interface YoutubePreviewCardProps {
    draft: PlatformDraft;
    media: MediaFile | null;
}

export function YoutubePreviewCard({ draft, media }: YoutubePreviewCardProps) {
    return (
        <div className="w-full max-w-md mx-auto font-sans">
            {/* Thumbnail */}
            <div
                className={cn(
                    "relative w-full aspect-video rounded-[var(--radius-md)] overflow-hidden",
                    "bg-gray-900"
                )}
                aria-label="Video thumbnail"
            >
                {media?.previewUrl ? (
                    media.type === "video" ? (
                        <video
                            src={media.previewUrl}
                            className="w-full h-full object-cover"
                            controls={false}
                            muted
                            playsInline
                        />
                    ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={media.previewUrl}
                            alt="Post thumbnail"
                            className="w-full h-full object-cover"
                        />
                    )
                ) : (
                    <div className="flex h-full items-center justify-center text-white/30 text-sm">
                        No media
                    </div>
                )}
                {/* Duration badge */}
                {media?.durationSeconds && (
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                        {Math.floor(media.durationSeconds / 60)}:
                        {String(Math.floor(media.durationSeconds % 60)).padStart(2, "0")}
                    </span>
                )}
            </div>

            {/* Video info */}
            <div className="mt-3 flex gap-3">
                {/* Avatar */}
                <div className="h-9 w-9 rounded-full bg-primary shrink-0 flex items-center justify-center text-white text-xs font-bold">
                    Y
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
                        {draft.title || "Your video title will appear here"}
                    </h3>
                    <p className="text-xs text-foreground-muted mt-1">
                        Your Channel • 0 views • Just now
                    </p>
                </div>
            </div>

            {/* Mock engagement */}
            <div className="mt-3 flex gap-3 text-xs text-foreground-muted border-t border-border pt-3">
                <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" /> 0
                </span>
                <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" /> 0 views
                </span>
                <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" /> 0
                </span>
            </div>

            {/* Description preview */}
            {draft.description && (
                <p className="mt-2 text-xs text-foreground-muted line-clamp-3">
                    {draft.description}
                </p>
            )}
        </div>
    );
}
