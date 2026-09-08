import apiClient from "./client";
import type { Platform } from "@/types/account.types";
import type {
    PublishJob,
    PublishPlatformResult,
    PlatformDraft,
} from "@/types/post.types";

export interface PublishRequest {
    mediaId: string;
    platformDrafts: PlatformDraft[];
    // These are passed from the draft store after upload
    mediaUrl?: string;
    mediaType?: "video" | "image";
    rawCaption?: string;
    aiTitle?: string;
    aiDescription?: string;
    aiHashtags?: string[];
}

// ─── Backend response shapes ──────────────────────────────────────────────────

interface BackendPostTarget {
    id: string;
    platform: string;
    publish_status: string;
    platform_post_url: string | null;
    error_message: string | null;
    retry_count: number;
    published_at: string | null;
}

interface BackendPost {
    id: string;
    status: string;
    targets: BackendPostTarget[];
}

interface BackendStatusResponse {
    id: string;
    status: string;
    media_url: string;
    media_type: string;
    ai_title: string | null;
    created_at: string;
    targets: BackendPostTarget[];
}

// ─── Status mapping ────────────────────────────────────────────────────────

function mapPublishStatus(
    backendStatus: string
): PublishPlatformResult["status"] {
    switch (backendStatus) {
        case "PENDING": return "queued";
        case "QUEUED": return "queued";
        case "UPLOADING": return "uploading";
        case "PUBLISHED": return "published";
        case "FAILED": return "failed";
        default: return "queued";
    }
}

function mapTargetToResult(target: BackendPostTarget): PublishPlatformResult {
    const status = mapPublishStatus(target.publish_status);
    return {
        platform: target.platform.toLowerCase() as Platform,
        status,
        postUrl: target.platform_post_url ?? undefined,
        errorMessage: target.error_message ?? undefined,
        retryable: status === "failed" && target.retry_count < 3,
    };
}

// ─── API Functions ─────────────────────────────────────────────────────────

/**
 * Creates a draft post and immediately triggers publishing.
 * Returns a PublishJob with the post ID as jobId for polling.
 */
export async function publishPost(request: PublishRequest): Promise<PublishJob> {
    const includedDrafts = request.platformDrafts.filter((d) => d.isIncluded);

    // Step 1: Create the post draft
    const createRes = await apiClient.post<BackendPost>("/posts", {
        mediaUrl: request.mediaUrl ?? "",
        mediaType: (request.mediaType ?? "image").toUpperCase(),
        cloudinaryId: request.mediaId,
        rawCaption: request.rawCaption ?? null,
        aiTitle: request.aiTitle ?? null,
        aiDescription: request.aiDescription ?? null,
        aiHashtags: request.aiHashtags ?? [],
        targets: includedDrafts.map((d) => {
            const fallbackTitle = request.aiTitle || request.rawCaption || "New Post";
            const fallbackDesc = request.aiDescription || request.rawCaption || "Published via CrossPost AI";
            return {
                platform: d.platform.toUpperCase(),
                finalTitle: (d.title && d.title.trim()) || fallbackTitle,
                finalDescription: (d.description && d.description.trim()) || fallbackDesc,
                finalHashtags: Array.isArray(d.hashtags) ? d.hashtags : [],
            };
        }),
    });

    const postId = createRes.data.id;

    // Step 2: Trigger publish (enqueues BullMQ jobs)
    await apiClient.post(`/posts/${postId}/publish`);

    // Step 3: Return job info for polling
    return {
        jobId: postId,
        createdAt: new Date().toISOString(),
        results: createRes.data.targets.map(mapTargetToResult),
    };
}

export async function getPublishStatus(jobId: string): Promise<PublishJob> {
    const res = await apiClient.get<BackendStatusResponse>(`/posts/${jobId}/status`);

    return {
        jobId: res.data.id,
        createdAt: res.data.created_at,
        results: res.data.targets.map(mapTargetToResult),
    };
}

export async function retryPlatform(
    jobId: string,
    platform: Platform
): Promise<void> {
    await apiClient.post(`/posts/${jobId}/retry/${platform.toUpperCase()}`);
}

export interface HistoryPostTarget {
    id: string;
    platform: string;
    publish_status: string;
    platform_post_url: string | null;
    error_message: string | null;
    retry_count: number;
    published_at: string | null;
    final_title: string | null;
}

export interface HistoryPostItem {
    id: string;
    status: string;
    media_url: string;
    media_type: string;
    ai_title: string | null;
    raw_caption: string | null;
    created_at: string;
    updated_at: string;
    targets: HistoryPostTarget[];
}

export interface HistoryPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
}

export interface PostHistoryResponse {
    posts: HistoryPostItem[];
    pagination: HistoryPagination;
}

export async function fetchPostHistory(params?: {
    page?: number;
    limit?: number;
    status?: string;
    platform?: string;
    search?: string;
}): Promise<PostHistoryResponse> {
    const res = await apiClient.get<PostHistoryResponse>("/posts", { params });
    return res.data;
}

export async function deletePost(postId: string): Promise<void> {
    await apiClient.delete(`/posts/${postId}`);
}
