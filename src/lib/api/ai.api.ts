import apiClient from "./client";
import type {
    AIGenerateRequest,
    AIGenerateResponse,
    AIEnhanceRequest,
    AIEnhanceResponse,
} from "@/types/ai.types";

// ─── API Functions ─────────────────────────────────────────────────────────

export async function generateContent(
    request: AIGenerateRequest
): Promise<AIGenerateResponse> {
    const res = await apiClient.post<AIGenerateResponse>("/ai/generate", {
        rawCaption: request.rawCaption,
        mediaType: request.mediaType,
        platforms: request.platforms,
    });
    return res.data;
}

export async function enhanceContent(
    request: AIEnhanceRequest
): Promise<AIEnhanceResponse> {
    const res = await apiClient.post<AIEnhanceResponse>("/ai/enhance", {
        title: request.title,
        description: request.description,
        hashtags: request.hashtags,
        platforms: request.platforms,
    });
    return res.data;
}
