import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchCalendarEvents,
    fetchUpcomingPosts,
    scheduleNewPost,
    updateScheduledPost,
    cancelScheduledPost,
    type SchedulePostPayload,
    type UpdateSchedulePayload,
} from "@/lib/api/calendar.api";

export function useCalendarEvents(filters?: {
    start?: string;
    end?: string;
    platform?: string;
    status?: string;
}) {
    return useQuery({
        queryKey: ["calendar-events", filters],
        queryFn: () => fetchCalendarEvents(filters),
        staleTime: 10000,
    });
}

export function useUpcomingPosts() {
    return useQuery({
        queryKey: ["calendar-upcoming"],
        queryFn: fetchUpcomingPosts,
        staleTime: 10000,
    });
}

export function useScheduleMutations() {
    const queryClient = useQueryClient();

    const scheduleMutation = useMutation({
        mutationFn: (payload: SchedulePostPayload) => scheduleNewPost(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
            queryClient.invalidateQueries({ queryKey: ["calendar-upcoming"] });
            queryClient.invalidateQueries({ queryKey: ["posts-history"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateSchedulePayload }) =>
            updateScheduledPost(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
            queryClient.invalidateQueries({ queryKey: ["calendar-upcoming"] });
            queryClient.invalidateQueries({ queryKey: ["posts-history"] });
        },
    });

    const cancelMutation = useMutation({
        mutationFn: (id: string) => cancelScheduledPost(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
            queryClient.invalidateQueries({ queryKey: ["calendar-upcoming"] });
            queryClient.invalidateQueries({ queryKey: ["posts-history"] });
        },
    });

    return {
        scheduleMutation,
        updateMutation,
        cancelMutation,
    };
}
