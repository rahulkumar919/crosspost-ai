"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchAnalyticsOverview,
    fetchPostAnalytics,
    syncPlatformAnalytics,
    type AnalyticsOverviewData,
    type PostPerformanceData,
} from "@/lib/api/analytics.api";

export function useAnalyticsOverview(range = "30d") {
    return useQuery<AnalyticsOverviewData>({
        queryKey: ["analyticsOverview", range],
        queryFn: () => fetchAnalyticsOverview(range),
        staleTime: 60_000,
        refetchOnWindowFocus: true,
    });
}

export function usePostAnalytics(range = "all") {
    return useQuery<PostPerformanceData[]>({
        queryKey: ["postAnalytics", range],
        queryFn: () => fetchPostAnalytics(range),
        staleTime: 60_000,
    });
}

export function useSyncAnalytics() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (range?: string) => syncPlatformAnalytics(range || "30d"),
        onSuccess: (data) => {
            queryClient.setQueryData(["analyticsOverview", "30d"], data);
            queryClient.invalidateQueries({ queryKey: ["analyticsOverview"] });
            queryClient.invalidateQueries({ queryKey: ["postAnalytics"] });
        },
    });
}
