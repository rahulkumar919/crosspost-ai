import apiClient from "./client";
import type { ConnectedAccount, Platform } from "@/types/account.types";

// ─── Backend response shapes ──────────────────────────────────────────────────

interface BackendAccount {
    id: string;
    platform: string;
    platform_account_id: string;
    platform_account_name: string;
    status: string;
    token_expires_at: string | null;
    scopes: string | null;
    created_at: string;
    updated_at: string;
}

function mapAccount(raw: BackendAccount): ConnectedAccount {
    return {
        id: raw.id,
        platform: raw.platform.toLowerCase() as Platform,
        handle: raw.platform_account_name,
        connectedAt: raw.created_at,
        isActive: raw.status === "CONNECTED",
    };
}

// ─── API Functions ─────────────────────────────────────────────────────────

export async function fetchConnectedAccounts(): Promise<ConnectedAccount[]> {
    const res = await apiClient.get<{ accounts: BackendAccount[] }>("/accounts");
    return res.data.accounts.map(mapAccount);
}

/**
 * Starts the OAuth flow for a platform.
 *
 * Calls the authenticated backend endpoint to get the OAuth redirect URL,
 * then navigates the browser to it. The platform redirects back to the
 * backend callback, which validates state and redirects to
 * /accounts?connected=<platform>.
 *
 * This promise intentionally never resolves — the page navigates away.
 */
export async function connectAccount(platform: Platform): Promise<void> {
    const res = await apiClient.get<{ redirectUrl: string }>(
        `/accounts/connect/${platform.toUpperCase()}`
    );

    if (res.data?.redirectUrl) {
        window.location.href = res.data.redirectUrl;
    }

    return new Promise(() => undefined);
}

export async function disconnectAccount(platform: Platform): Promise<void> {
    await apiClient.delete(`/accounts/${platform.toUpperCase()}`);
}

// ─── Instagram media listing ──────────────────────────────────────────────────

export interface InstagramMediaItem {
    id: string;
    media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
    media_url?: string;
    thumbnail_url?: string;
    permalink: string;
    caption?: string;
    timestamp: string;
    like_count?: number;
    comments_count?: number;
}

export interface InstagramMediaPage {
    items: InstagramMediaItem[];
    next_cursor: string | null;
}

/** Fetch paginated Instagram media. Pass cursor from previous response for next page. */
export async function fetchInstagramMedia(
    limit = 20,
    cursor?: string
): Promise<InstagramMediaPage> {
    const params: Record<string, string | number> = { limit };
    if (cursor) params.cursor = cursor;
    const res = await apiClient.get<InstagramMediaPage>(`/accounts/instagram/media`, { params });
    return res.data;
}

/** Fetch a single Instagram media item by ID (for card thumbnails). */
export async function fetchInstagramMediaById(mediaId: string): Promise<InstagramMediaItem> {
    const res = await apiClient.get<InstagramMediaItem>(`/accounts/instagram/media/${mediaId}`);
    return res.data;
}
