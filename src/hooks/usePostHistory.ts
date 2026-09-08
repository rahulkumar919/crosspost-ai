import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPostHistory, retryPlatform, deletePost } from "@/lib/api/posts.api";
import type { Platform } from "@/types/account.types";

export interface PostHistoryFilters {
    page: number;
    limit: number;
    status: string;
    platform: string;
    search: string;
}

export function usePostHistory(filters: PostHistoryFilters) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["posts-history", filters],
        queryFn: () => fetchPostHistory(filters),
        staleTime: 5000,
        refetchInterval: (data) => {
            // Auto-refresh every 4 seconds if there are any publishing or queued posts
            const hasActiveJobs = data?.state?.data?.posts?.some((p) =>
                p.status === "PUBLISHING" ||
                p.targets?.some((t) => t.publish_status === "QUEUED" || t.publish_status === "UPLOADING" || t.publish_status === "PENDING")
            );
            return hasActiveJobs ? 4000 : false;
        },
    });

    const retryMutation = useMutation({
        mutationFn: ({ postId, platform }: { postId: string; platform: Platform }) =>
            retryPlatform(postId, platform),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts-history"] });
            queryClient.invalidateQueries({ queryKey: ["analytics"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (postId: string) => deletePost(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts-history"] });
            queryClient.invalidateQueries({ queryKey: ["analytics"] });
        },
    });

    return {
        ...query,
        retryMutation,
        deleteMutation,
    };
}
