"use client";

import { useMutation } from "@tanstack/react-query";
import { generateContent } from "@/lib/api/ai.api";
import { useDraftPostStore } from "@/store/useDraftPostStore";
import type { AIGenerateRequest } from "@/types/ai.types";

export function useGenerateContent() {
    const setGeneratedContent = useDraftPostStore((s) => s.setGeneratedContent);

    return useMutation({
        mutationFn: (request: AIGenerateRequest) => generateContent(request),
        onSuccess: (data) => {
            setGeneratedContent(data.title, data.description, data.hashtags);
        },
    });
}
