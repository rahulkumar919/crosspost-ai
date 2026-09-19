export type ContentPillar =
    | "AI Full Stack Development"
    | "Generative AI & LLMs"
    | "RAG & LangGraph"
    | "AI Agents"
    | "Web Development"
    | "Coding Tutorial"
    | "Project Showcase"
    | "Developer Journey"
    | "BCA Placement"
    | "Freelancing & Clients"
    | "Software Career Education";

export interface AIContentAnalysis {
    pillar: ContentPillar;
    targetAudience: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
    contentObjective: "education" | "project_demo" | "career_growth" | "authority";
    hookType: "problem_solution" | "technical_curiosity" | "case_study" | "contrarian";
    ctaType: "discussion" | "follow" | "github_repo" | "resource";
}

export interface PlatformContent {
    title: string;
    description: string;
    hashtags: string[];
}

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
    // Backward-compatible primary fields
    title: string;
    description: string;
    hashtags: string[];

    // Advanced strategy & platform-specific outputs
    analysis?: AIContentAnalysis;
    platforms?: {
        youtube: PlatformContent;
        instagram: PlatformContent;
        linkedin: PlatformContent;
    };
}

export type AIEnhanceResponse = AIGenerateResponse;

export interface AIGenerationState {
    isGenerating: boolean;
    isEnhancing: boolean;
    elapsedSeconds: number;
}
