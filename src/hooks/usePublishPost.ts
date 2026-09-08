"use client";

import { useMutation } from "@tanstack/react-query";
import { publishPost } from "@/lib/api/posts.api";
import { useDraftPostStore } from "@/store/useDraftPostStore";
import type { PublishRequest } from "@/lib/api/posts.api";

export function usePublishPost() {
    const setPublishJob = useDraftPostStore((s) => s.setPublishJob);

    return useMutation({
        mutationFn: (request: PublishRequest) => publishPost(request),
        // onMutate intentionally removed — PublishStep already manages the
        // upload → publish transition with its own state. Setting the step
        // here caused it to fire before the upload even started (BUG-09).
        onSuccess: (job) => {
            setPublishJob(job);
        },
    });
}
