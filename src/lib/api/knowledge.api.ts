import apiClient from "./client";

export interface KnowledgeBase {
    id: string;
    user_id: string;
    creator_name: string;
    about: string;
    topics: string[];
    services: Array<{ name: string; description: string }>;
    courses: Array<{ name: string; url?: string; description?: string }>;
    resources: Array<{ name: string; url: string; description?: string }>;
    faqs: Array<{ question: string; answer: string }>;
    links: Array<{ label: string; url: string }>;
    contact: Record<string, string>;
    policies: string;
    ai_system_prompt: string | null;
    created_at: string;
    updated_at: string;
}

export type KnowledgeBaseInput = Partial<Omit<KnowledgeBase, "id" | "user_id" | "created_at" | "updated_at">>;

export async function fetchKnowledgeBase(): Promise<KnowledgeBase | null> {
    try {
        const res = await apiClient.get<KnowledgeBase>("/knowledge");
        return res.data;
    } catch {
        return null;
    }
}

export async function upsertKnowledgeBase(input: KnowledgeBaseInput): Promise<KnowledgeBase> {
    const res = await apiClient.put<KnowledgeBase>("/knowledge", input);
    return res.data;
}

export async function deleteKnowledgeBase(): Promise<void> {
    await apiClient.delete("/knowledge");
}
