"use client";

import { useMutation } from "@tanstack/react-query";
import { enhanceContent } from "@/lib/api/ai.api";
import { useDraftPostStore } from "@/store/useDraftPostStore";
import type { AIEnhanceRequest } from "@/types/ai.types";

export function useEnhanceContent() {
    const setGeneratedContent = useDraftPostStore((s) => s.setGeneratedContent);

    return useMutation({
        mutationFn: (request: AIEnhanceRequest) => enhanceContent(request),
        onSuccess: (data) => {
            setGeneratedContent(data.title, data.description, data.hashtags);
        },
    });
}
