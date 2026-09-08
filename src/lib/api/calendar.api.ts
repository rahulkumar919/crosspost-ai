import apiClient from "./client";
import type { Platform } from "@/types/account.types";

export interface CalendarEventTarget {
    id: string;
    platform: string;
    title: string;
    description: string;
    hashtags: string[];
    status: string;
    scheduledAt: string | null;
    publishedAt: string | null;
    platformPostUrl: string | null;
    errorMessage: string | null;
    retryCount: number;
}

export interface CalendarEvent {
    id: string;
    postId: string;
    title: string;
    rawCaption: string | null;
    mediaUrl: string;
    mediaType: "VIDEO" | "IMAGE";
    scheduledAt: string | null;
    createdAt: string;
    effectiveDate: string;
    status: "SCHEDULED" | "PUBLISHED" | "FAILED" | "PUBLISHING" | "DRAFT" | "PARTIALLY_DELIVERED";
    targets: CalendarEventTarget[];
}

export interface UpcomingPost {
    id: string;
    title: string;
    mediaUrl: string;
    mediaType: "VIDEO" | "IMAGE";
    rawCaption: string | null;
    scheduledAt: string;
    createdAt: string;
    targets: {
        id: string;
        platform: string;
        scheduledAt: string;
        status: string;
    }[];
}

export interface SchedulePostPayload {
    mediaUrl: string;
    mediaType: "video" | "image" | "VIDEO" | "IMAGE";
    cloudinaryId: string;
    rawCaption?: string;
    aiTitle?: string;
    aiDescription?: string;
    aiHashtags?: string[];
    scheduledAt: string;
    targets: {
        platform: Platform | string;
        finalTitle?: string;
        finalDescription?: string;
        finalHashtags?: string[];
        scheduledAt?: string;
    }[];
}

export interface UpdateSchedulePayload {
    aiTitle?: string;
    rawCaption?: string;
    scheduledAt?: string;
    targets?: {
        platform: Platform | string;
        finalTitle?: string;
        finalDescription?: string;
        finalHashtags?: string[];
        scheduledAt?: string;
    }[];
}

export async function fetchCalendarEvents(params?: {
    start?: string;
    end?: string;
    platform?: string;
    status?: string;
}): Promise<{ events: CalendarEvent[] }> {
    const res = await apiClient.get<{ events: CalendarEvent[] }>("/calendar/events", { params });
    return res.data;
}

export async function fetchUpcomingPosts(): Promise<{ upcoming: UpcomingPost[] }> {
    const res = await apiClient.get<{ upcoming: UpcomingPost[] }>("/calendar/upcoming");
    return res.data;
}

export async function scheduleNewPost(payload: SchedulePostPayload): Promise<any> {
    const res = await apiClient.post("/calendar/schedule", payload);
    return res.data;
}

export async function updateScheduledPost(id: string, payload: UpdateSchedulePayload): Promise<any> {
    const res = await apiClient.patch(`/calendar/schedule/${id}`, payload);
    return res.data;
}

export async function cancelScheduledPost(id: string): Promise<void> {
    await apiClient.delete(`/calendar/schedule/${id}`);
}
