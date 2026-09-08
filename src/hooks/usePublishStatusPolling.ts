"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublishStatus } from "@/lib/api/posts.api";
import { useDraftPostStore } from "@/store/useDraftPostStore";

const FINAL_STATUSES = new Set(["published", "failed"]);

export function usePublishStatusPolling(jobId: string | null) {
    const updatePublishJobResult = useDraftPostStore(
        (s) => s.updatePublishJobResult
    );

    return useQuery({
        queryKey: ["publishStatus", jobId],
        queryFn: async () => {
            if (!jobId) throw new Error("No job ID");
            const job = await getPublishStatus(jobId);
            updatePublishJobResult(jobId, job);
            return job;
        },
        enabled: !!jobId,
        // Poll while any result is not in a final state
        refetchInterval: (query) => {
            const job = query.state.data;
            if (!job) return 2000;
            const allDone = job.results.every((r) => FINAL_STATUSES.has(r.status));
            return allDone ? false : 2000;
        },
        staleTime: 0,
    });
}
