export interface AIGenerateRequest {
    rawCaption: string;
    mediaType: "video" | "image";
    platforms: string[];
}

export interface AIEnhanceRequest {
    title: string;
    description: string;
    hashtags: string[];
    platforms: string[];
}

export interface AIGenerateResponse {
    title: string;
    description: string;
    hashtags: string[];
}

export type AIEnhanceResponse = AIGenerateResponse;

export interface AIGenerationState {
    isGenerating: boolean;
    isEnhancing: boolean;
    elapsedSeconds: number;
}
