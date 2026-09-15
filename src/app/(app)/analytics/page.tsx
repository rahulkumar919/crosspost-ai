"use client";

import * as React from "react";
import Link from "next/link";
import {
    Eye, Heart, MessageCircle, Share2, Bookmark, Users,
    TrendingUp, RefreshCw, ExternalLink, Sparkles, Filter,
    Search, ArrowUpRight, CheckCircle2, Film, Image as ImageIcon,
} from "lucide-react";
import { useAnalyticsOverview, usePostAnalytics, useSyncAnalytics } from "@/hooks/useAnalytics";
import { YoutubeIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/platform-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Platform } from "@/types/account.types";

const TIME_RANGES = [
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "90 Days", value: "90d" },
    { label: "All Time", value: "all" },
];

function formatNumber(num: number): string {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
}

export default function AnalyticsPage() {
    const [range, setRange] = React.useState("30d");
    const [search, setSearch] = React.useState("");
    const [platformFilter, setPlatformFilter] = React.useState<string>("all");

    const { data: overview, isLoading: isOverviewLoading, refetch: refetchOverview } = useAnalyticsOverview(range);
    const { data: posts, isLoading: isPostsLoading } = usePostAnalytics(range);
    const syncMutation = useSyncAnalytics();

    const handleSync = async () => {
        await syncMutation.mutateAsync(range);
        await refetchOverview();
    };

    const summary = overview?.summary;
    const platforms = overview?.platforms;
    const timeSeries = overview?.timeSeries || [];

    // Filter posts
    const filteredPosts = React.useMemo(() => {
        if (!posts) return [];
        return posts.filter((p) => {
            const matchesSearch =
                p.title.toLowerCase().includes(search.toLowerCase()) ||
                (p.caption && p.caption.toLowerCase().includes(search.toLowerCase()));
            const matchesPlatform = platformFilter === "all" || p.platform.toLowerCase() === platformFilter.toLowerCase();
            return matchesSearch && matchesPlatform;
        });
    }, [posts, search, platformFilter]);

    // Calculate max views in time series for chart scaling
    const maxSeriesViews = React.useMemo(() => {
        if (timeSeries.length === 0) return 100;
        return Math.max(...timeSeries.map((d) => d.views), 100);
    }, [timeSeries]);

    return (
        <div className="flex flex-col flex-1 min-h-0 p-4 sm:p-6 lg:p-8" style={{ background: "var(--background)" }}>
            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full" style={{ background: "rgba(108,92,231,0.12)", color: "#6C5CE7" }}>
                            Real-Time Intelligence
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[var(--foreground-color)] tracking-tight">
                        Analytics <span style={{ color: "#6C5CE7" }}>Dashboard</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1">
                        Unified performance metrics across all your connected social platforms.
                    </p>
                </div>

                {/* Range selectors & Sync button */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Time range pill buttons */}
                    <div className="flex items-center p-1 bg-[var(--surface)] rounded-xl border border-[var(--border-color)] shadow-sm">
                        {TIME_RANGES.map((item) => (
                            <button
                                key={item.value}
                                onClick={() => setRange(item.value)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                    range === item.value
                                        ? "text-white shadow-sm"
                                        : "text-[var(--foreground-muted)] hover:text-[var(--foreground-color)] hover:bg-[var(--surface-elevated)]"
                                )}
                                style={range === item.value ? { background: "linear-gradient(135deg, #5b21b6, #6C5CE7)" } : {}}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Sync Platform Data */}
                    <button
                        onClick={handleSync}
                        disabled={syncMutation.isPending || isOverviewLoading}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm disabled:opacity-60"
                        style={{ background: "linear-gradient(135deg, #6C5CE7, #a29bfe)", boxShadow: "0 4px 14px rgba(108,92,231,0.3)" }}
                    >
                        <RefreshCw className={cn("h-3.5 w-3.5", (syncMutation.isPending || isOverviewLoading) && "animate-spin")} />
                        <span>{syncMutation.isPending ? "Syncing..." : "Sync Live Data"}</span>
                    </button>
                </div>
            </div>

            {/* ── Summary KPI Cards ───────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4">
                {/* 1. Total Views / Reach */}
                <KPICard
                    title="Total Reach"
                    value={summary ? formatNumber(summary.totalViews) : "0"}
                    growth="+14.8%"
                    isUp={true}
                    icon={Eye}
                    color="#6C5CE7"
                    isLoading={isOverviewLoading}
                    sub="Across all platforms"
                />

                {/* 2. Total Likes */}
                <KPICard
                    title="Total Likes"
                    value={summary ? formatNumber(summary.totalLikes) : "0"}
                    growth="+9.4%"
                    isUp={true}
                    icon={Heart}
                    color="#E1306C"
                    isLoading={isOverviewLoading}
                    sub="Audience reactions"
                />

                {/* 3. Total Comments */}
                <KPICard
                    title="Comments"
                    value={summary ? formatNumber(summary.totalComments) : "0"}
                    growth="+12.1%"
                    isUp={true}
                    icon={MessageCircle}
                    color="#0984e3"
                    isLoading={isOverviewLoading}
                    sub="Conversations"
                />

                {/* 4. Total Shares */}
                <KPICard
                    title="Shares"
                    value={summary ? formatNumber(summary.totalShares) : "0"}
                    growth="+18.5%"
                    isUp={true}
                    icon={Share2}
                    color="#00b894"
                    isLoading={isOverviewLoading}
                    sub="Amplified reach"
                />

                {/* 5. Total Saves */}
                <KPICard
                    title="Saves"
                    value={summary ? formatNumber(summary.totalSaves) : "0"}
                    growth="+6.2%"
                    isUp={true}
                    icon={Bookmark}
                    color="#fdcb6e"
                    isLoading={isOverviewLoading}
                    sub="Bookmarks"
                />

                {/* 6. Total Audience / Subscribers */}
                <KPICard
                    title="Audience"
                    value={summary ? formatNumber(summary.totalFollowers) : "0"}
                    growth="+4.5%"
                    isUp={true}
                    icon={Users}
                    color="#6c5ce7"
                    isLoading={isOverviewLoading}
                    sub="Total followers"
                />
            </div>

            {/* ── Engagement Banner + Trend Chart ─────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                {/* Engagement Highlights Card */}
                <div
                    className="flex flex-col justify-between rounded-2xl p-6 text-white relative overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #0D0A2E 0%, #1a1040 60%, #2e1065 100%)",
                        boxShadow: "0 4px 20px rgba(108,92,231,0.25)",
                    }}
                >
                    <div className="absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl" style={{ background: "rgba(108,92,231,0.4)" }} />

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="h-4 w-4 text-purple-300" />
                            <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
                                Overall Health
                            </span>
                        </div>
                        <h2 className="text-3xl font-black text-white mb-1">
                            {summary ? `${summary.engagementRate}%` : "0.0%"}
                        </h2>
                        <p className="text-xs text-purple-200 leading-relaxed">
                            Average Engagement Rate across all published content in this period.
                        </p>
                    </div>

                    <div className="relative z-10 grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-white/10">
                        <div>
                            <p className="text-[11px] text-purple-200 uppercase font-semibold">Total Posts</p>
                            <p className="text-lg font-black text-white mt-0.5">{summary?.totalPosts ?? 0}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-purple-200 uppercase font-semibold">Growth Benchmark</p>
                            <div className="flex items-center gap-1 mt-0.5">
                                <TrendingUp className="h-4 w-4 text-emerald-400" />
                                <span className="text-sm font-bold text-emerald-400">High Velocity</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 7-Day Performance Chart */}
                <div
                    className="lg:col-span-2 rounded-2xl p-6 bg-[var(--surface)] flex flex-col justify-between shadow-sm border border-[var(--border-color)]"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base font-black text-[var(--foreground-color)]">Reach &amp; Views Trend</h3>
                            <p className="text-xs text-[var(--foreground-muted)] mt-0.5">Daily performance across all active networks</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-semibold">
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-purple-600" />
                                <span className="text-[var(--foreground-muted)]">Views</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-pink-500" />
                                <span className="text-[var(--foreground-muted)]">Likes</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart Bars */}
                    <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-4 px-2">
                        {timeSeries.map((item, idx) => {
                            const heightPct = Math.max(15, Math.round((item.views / maxSeriesViews) * 100));
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                                    {/* Tooltip */}
                                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-20">
                                        <p>{item.views} views</p>
                                        <p className="text-pink-300">{item.likes} likes</p>
                                    </div>

                                    {/* Bar column */}
                                    <div className="w-full flex items-end justify-center h-32 bg-[var(--surface-elevated)]/60 rounded-xl overflow-hidden p-1">
                                        <div
                                            className="w-full rounded-lg transition-all duration-500 group-hover:brightness-110"
                                            style={{
                                                height: `${heightPct}%`,
                                                background: "linear-gradient(180deg, #6C5CE7 0%, #a29bfe 100%)",
                                                boxShadow: "0 2px 8px rgba(108,92,231,0.25)",
                                            }}
                                        />
                                    </div>

                                    {/* Date label */}
                                    <span className="text-[11px] font-bold text-[var(--foreground-muted)] group-hover:text-purple-600 transition-colors">
                                        {item.date}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Cross-Platform Comparison ───────────────────────────────────── */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-black text-[var(--foreground-color)]">Platform Comparison</h2>
                        <p className="text-xs text-[var(--foreground-muted)]">Live audience, engagement, and reach breakdown per channel.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* YouTube */}
                    <PlatformBreakdownCard
                        platform="YOUTUBE"
                        title="YouTube"
                        icon={YoutubeIcon}
                        color="#ff0000"
                        gradient="linear-gradient(135deg, #ff0000, #ff4757)"
                        metrics={platforms?.youtube}
                        isLoading={isOverviewLoading}
                    />

                    {/* Instagram */}
                    <PlatformBreakdownCard
                        platform="INSTAGRAM"
                        title="Instagram"
                        icon={InstagramIcon}
                        color="#E1306C"
                        gradient="linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)"
                        metrics={platforms?.instagram}
                        isLoading={isOverviewLoading}
                    />

                    {/* LinkedIn */}
                    <PlatformBreakdownCard
                        platform="LINKEDIN"
                        title="LinkedIn"
                        icon={LinkedinIcon}
                        color="#0077B5"
                        gradient="linear-gradient(135deg, #0077b5, #00a0dc)"
                        metrics={platforms?.linkedin}
                        isLoading={isOverviewLoading}
                    />
                </div>
            </div>

            {/* ── Post-Level Performance Table ────────────────────────────────── */}
            <div className="rounded-2xl bg-[var(--surface)] shadow-sm border border-[var(--border-color)] overflow-hidden">
                {/* Table Top Controls */}
                <div className="p-5 border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h3 className="text-base font-black text-[var(--foreground-color)]">Post-Level Performance</h3>
                        <p className="text-xs text-[var(--foreground-muted)] mt-0.5">Individual metrics and live links for all published content.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search input */}
                        <div className="relative">
                            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                            <input
                                type="text"
                                placeholder="Search posts..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--foreground-muted)] bg-[var(--surface-elevated)] border border-[var(--border-color)] outline-none focus:border-purple-400 focus:bg-[var(--surface)] transition-all w-44 sm:w-56"
                            />
                        </div>

                        {/* Platform filter */}
                        <div className="flex items-center gap-1 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-xl p-1 text-xs font-semibold text-[var(--foreground-muted)]">
                            <Filter className="h-3 w-3 text-[var(--foreground-muted)] ml-1.5" />
                            <select
                                value={platformFilter}
                                onChange={(e) => setPlatformFilter(e.target.value)}
                                className="bg-transparent border-none outline-none text-xs font-semibold text-[var(--foreground-muted)] pr-2 py-0.5 cursor-pointer"
                            >
                                <option value="all">All Channels</option>
                                <option value="youtube">YouTube</option>
                                <option value="instagram">Instagram</option>
                                <option value="linkedin">LinkedIn</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="bg-[var(--surface-elevated)]/70 border-b border-[var(--border-color)] text-[var(--foreground-muted)] font-bold uppercase tracking-wider text-[10px]">
                                <th className="py-3.5 px-5">Content / Title</th>
                                <th className="py-3.5 px-4">Channel</th>
                                <th className="py-3.5 px-4 text-right">Views</th>
                                <th className="py-3.5 px-4 text-right">Likes</th>
                                <th className="py-3.5 px-4 text-right">Comments</th>
                                <th className="py-3.5 px-4 text-right">Shares</th>
                                <th className="py-3.5 px-4 text-center">Eng. Rate</th>
                                <th className="py-3.5 px-5 text-right">Live Link</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium text-[var(--foreground-muted)]">
                            {isPostsLoading && !posts ? (
                                Array.from({ length: 3 }).map((_, idx) => (
                                    <tr key={idx} className="animate-pulse">
                                        <td className="py-4 px-5"><Skeleton height="h-4" width="w-48" /></td>
                                        <td className="py-4 px-4"><Skeleton height="h-4" width="w-20" /></td>
                                        <td className="py-4 px-4"><Skeleton height="h-4" width="w-12" /></td>
                                        <td className="py-4 px-4"><Skeleton height="h-4" width="w-12" /></td>
                                        <td className="py-4 px-4"><Skeleton height="h-4" width="w-12" /></td>
                                        <td className="py-4 px-4"><Skeleton height="h-4" width="w-12" /></td>
                                        <td className="py-4 px-4"><Skeleton height="h-4" width="w-12" /></td>
                                        <td className="py-4 px-5"><Skeleton height="h-4" width="w-16" /></td>
                                    </tr>
                                ))
                            ) : filteredPosts.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-[var(--foreground-muted)]">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="h-10 w-10 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center text-purple-600">
                                                <Film className="h-5 w-5" />
                                            </div>
                                            <p className="text-sm font-bold text-[var(--foreground-muted)]">No published posts found</p>
                                            <p className="text-xs text-[var(--foreground-muted)] max-w-sm">
                                                Publish your first video or image to see real-time engagement and view counts here.
                                            </p>
                                            <Link
                                                href="/create"
                                                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm"
                                            >
                                                Create New Post →
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPosts.map((item) => (
                                    <tr key={item.id} className="hover:bg-[var(--surface-elevated)]/30 transition-colors">
                                        {/* Post title & media type */}
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-lg bg-[var(--surface-elevated)] overflow-hidden shrink-0 flex items-center justify-center border border-[var(--border-color)]">
                                                    {item.mediaType === "VIDEO" ? (
                                                        <Film className="h-4 w-4 text-purple-600" />
                                                    ) : (
                                                        <ImageIcon className="h-4 w-4 text-purple-600" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 max-w-xs sm:max-w-sm">
                                                    <p className="font-bold text-[var(--foreground-color)] truncate">{item.title || "Untitled Post"}</p>
                                                    <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5">
                                                        {new Date(item.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Channel */}
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-1.5">
                                                {item.platform === "YOUTUBE" && <YoutubeIcon className="h-4 w-4 text-red-600" />}
                                                {item.platform === "INSTAGRAM" && <InstagramIcon className="h-4 w-4 text-pink-600" />}
                                                {item.platform === "LINKEDIN" && <LinkedinIcon className="h-4 w-4 text-blue-600" />}
                                                <span className="font-bold text-[11px] capitalize">{item.platform.toLowerCase()}</span>
                                            </div>
                                        </td>

                                        {/* Views */}
                                        <td className="py-3.5 px-4 text-right font-bold text-[var(--foreground-color)] tabular-nums">
                                            {formatNumber(item.views)}
                                        </td>

                                        {/* Likes */}
                                        <td className="py-3.5 px-4 text-right font-bold text-[var(--foreground-color)] tabular-nums">
                                            {formatNumber(item.likes)}
                                        </td>

                                        {/* Comments */}
                                        <td className="py-3.5 px-4 text-right font-bold text-[var(--foreground-color)] tabular-nums">
                                            {formatNumber(item.comments)}
                                        </td>

                                        {/* Shares */}
                                        <td className="py-3.5 px-4 text-right font-bold text-[var(--foreground-color)] tabular-nums">
                                            {formatNumber(item.shares)}
                                        </td>

                                        {/* Engagement rate */}
                                        <td className="py-3.5 px-4 text-center">
                                            <span
                                                className="inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px]"
                                                style={{
                                                    background: item.engagementRate > 5 ? "#D1FAE5" : "#EDE9FE",
                                                    color: item.engagementRate > 5 ? "#059669" : "#6C5CE7",
                                                }}
                                            >
                                                {item.engagementRate}%
                                            </span>
                                        </td>

                                        {/* Action link */}
                                        <td className="py-3.5 px-5 text-right">
                                            {item.platformPostUrl ? (
                                                <a
                                                    href={item.platformPostUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors"
                                                >
                                                    <span>View</span>
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </a>
                                            ) : (
                                                <span className="text-[var(--foreground-muted)] text-[11px]">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function KPICard({
    title,
    value,
    growth,
    isUp,
    icon: Icon,
    color,
    isLoading,
    sub,
}: {
    title: string;
    value: string;
    growth: string;
    isUp: boolean;
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    color: string;
    isLoading: boolean;
    sub: string;
}) {
    return (
        <div
            className="bg-[var(--surface)] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm border border-[var(--border-color)] hover:shadow-none transition-all"
        >
            <div className="flex items-center justify-between mb-3">
                <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: `${color}15` }}
                >
                    <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <span
                    className="flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: isUp ? "#D1FAE5" : "#FEE2E2", color: isUp ? "#059669" : "#DC2626" }}
                >
                    <ArrowUpRight className="h-3 w-3" />
                    {growth}
                </span>
            </div>

            <div>
                <p className={cn("text-xl sm:text-2xl font-black text-[var(--foreground-color)] tracking-tight", isLoading && "opacity-60 animate-pulse")}>
                    {value}
                </p>
                <p className="text-xs font-bold text-[var(--foreground-muted)] mt-0.5">{title}</p>
                <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5">{sub}</p>
            </div>
        </div>
    );
}

function PlatformBreakdownCard({
    title,
    icon: Icon,
    color,
    gradient,
    metrics,
    isLoading,
}: {
    platform: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    gradient: string;
    metrics: any;
    isLoading: boolean;
}) {
    const isConnected = metrics?.connected;
    const views = metrics?.views ?? 0;
    const followers = metrics?.followers ?? 0;
    const postCount = metrics?.postCount ?? 0;
    const shareOfTotal = metrics?.shareOfTotal ?? 0;
    const rate = metrics?.engagementRate ?? 0;

    return (
        <div
            className="bg-[var(--surface)] rounded-2xl p-5 shadow-sm border border-[var(--border-color)] flex flex-col justify-between"
        >
            <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
                            style={{ background: gradient }}
                        >
                            <Icon className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-black text-sm text-[var(--foreground-color)] leading-tight">{title}</h4>
                            <p className="text-[11px] text-[var(--foreground-muted)]">
                                {metrics?.accountName || (isConnected ? "Connected Account" : "Not connected")}
                            </p>
                        </div>
                    </div>

                    {isConnected ? (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Active</span>
                        </div>
                    ) : (
                        <Link
                            href="/accounts"
                            className="px-2.5 py-1 rounded-full bg-[var(--surface-elevated)] text-purple-600 hover:bg-purple-100 text-[10px] font-bold transition-colors"
                        >
                            Connect +
                        </Link>
                    )}
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-[var(--border-color)] text-center">
                    <div>
                        <p className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase">Reach</p>
                        <p className={cn("text-sm font-black text-[var(--foreground-color)] mt-0.5", isLoading && "opacity-60")}>
                            {formatNumber(views)}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase">Audience</p>
                        <p className={cn("text-sm font-black text-[var(--foreground-color)] mt-0.5", isLoading && "opacity-60")}>
                            {formatNumber(followers)}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase">Posts</p>
                        <p className={cn("text-sm font-black text-[var(--foreground-color)] mt-0.5", isLoading && "opacity-60")}>
                            {postCount}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                    <span className="text-[var(--foreground-muted)]">Share of Total Reach</span>
                    <span className="text-[var(--foreground-color)]">{shareOfTotal}%</span>
                </div>
                <div className="h-2 w-full bg-[var(--surface-elevated)] rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.max(5, shareOfTotal)}%`, background: color }}
                    />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[var(--foreground-muted)] mt-2 font-medium">
                    <span>Engagement rate</span>
                    <span className="font-bold text-[var(--foreground-muted)]">{rate}%</span>
                </div>
            </div>
        </div>
    );
}


