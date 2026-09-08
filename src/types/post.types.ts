import type { Platform } from "./account.types";

export type MediaType = "video" | "image";

export type PublishStatus =
    | "idle"
    | "queued"
    | "uploading"
    | "published"
    | "failed";

export interface MediaFile {
    file: File;
    previewUrl: string;
    type: MediaType;
    durationSeconds?: number;
    // Compression metadata (populated after FFmpeg pass)
    originalSize?: number;
    optimizedSize?: number;
    width?: number;
    height?: number;
    aspectRatio?: number;
}

/**
 * Deterministic upload state machine for the Upload step.
 * Replaces scattered boolean flags.
 */
export type UploadStage =
    | "idle"
    | "selected"
    | "validating"
    | "compressing"
    | "ready"
    | "error";


export interface PlatformDraft {
    platform: Platform;
    title: string;
    description: string;
    hashtags: string[];
    isIncluded: boolean;
}

export interface DraftPost {
    mediaFile: MediaFile | null;
    rawCaption: string;
    generatedTitle: string;
    generatedDescription: string;
    generatedHashtags: string[];
    platformDrafts: Record<Platform, PlatformDraft>;
}

export interface PublishPlatformResult {
    platform: Platform;
    status: PublishStatus;
    postUrl?: string;
    errorMessage?: string;
    retryable: boolean;
}

export interface PublishJob {
    jobId: string;
    createdAt: string;
    results: PublishPlatformResult[];
}

export type CreateStep = "upload" | "generate" | "preview" | "publish";
