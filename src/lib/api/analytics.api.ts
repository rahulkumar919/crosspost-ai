import apiClient from "./client";

export interface AnalyticsOverviewData {
    summary: {
        totalViews: number;
        totalLikes: number;
        totalComments: number;
        totalShares: number;
        totalSaves: number;
        totalFollowers: number;
        totalPosts: number;
        engagementRate: number;
        viewsGrowth: number;
        engagementGrowth: number;
        followerGrowth: number;
    };
    platforms: {
        youtube: PlatformMetricData;
        instagram: PlatformMetricData;
        linkedin: PlatformMetricData;
    };
    timeSeries: Array<{
        date: string;
        views: number;
        likes: number;
        comments: number;
        shares: number;
    }>;
}

export interface PlatformMetricData {
    connected: boolean;
    accountName: string | null;
    followers: number;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    postCount: number;
    engagementRate: number;
    shareOfTotal: number;
}

export interface PostPerformanceData {
    id: string;
    postId: string;
    title: string;
    caption: string | null;
    mediaUrl: string;
    mediaType: string;
    platform: "YOUTUBE" | "INSTAGRAM" | "LINKEDIN";
    platformPostUrl: string | null;
    publishedAt: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    engagementRate: number;
}

export async function fetchAnalyticsOverview(range = "30d"): Promise<AnalyticsOverviewData> {
    const res = await apiClient.get<AnalyticsOverviewData>(`/analytics/overview?range=${range}`);
    return res.data;
}

export async function fetchPostAnalytics(range = "all"): Promise<PostPerformanceData[]> {
    const res = await apiClient.get<PostPerformanceData[]>(`/analytics/posts?range=${range}`);
    return res.data;
}

export async function syncPlatformAnalytics(range = "30d"): Promise<AnalyticsOverviewData> {
    const res = await apiClient.post<{ success: boolean; data: AnalyticsOverviewData }>(`/analytics/sync?range=${range}`);
    return res.data.data;
}
