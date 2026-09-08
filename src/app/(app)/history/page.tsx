"use client";

import * as React from "react";
import Link from "next/link";
import {
    Search, Filter, RefreshCw, ExternalLink, RotateCcw,
    Trash2, Eye, Copy, Check, AlertCircle, CheckCircle2,
    Clock, AlertTriangle, ChevronRight, X, Film, Image as ImageIcon,
    Calendar, Sparkles, ArrowUpDown, ChevronLeft
} from "lucide-react";
import { usePostHistory } from "@/hooks/usePostHistory";
import { YoutubeIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/platform-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { HistoryPostItem, HistoryPostTarget } from "@/lib/api/posts.api";
import type { Platform } from "@/types/account.types";

export default function PostHistoryPage() {
    const [search, setSearch] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState("ALL");
    const [platformFilter, setPlatformFilter] = React.useState("ALL");
    const [page, setPage] = React.useState(1);
    const [selectedPost, setSelectedPost] = React.useState<HistoryPostItem | null>(null);
    const [copiedPostId, setCopiedPostId] = React.useState<string | null>(null);
    const [retryingTargetId, setRetryingTargetId] = React.useState<string | null>(null);

    const {
        data,
        isLoading,
        isFetching,
        refetch,
        retryMutation,
        deleteMutation,
    } = usePostHistory({
        page,
        limit: 10,
        status: statusFilter,
        platform: platformFilter,
        search,
    });

    const posts = data?.posts || [];
    const pagination = data?.pagination;

    // Derived summary statistics
    const totalPosts = pagination?.total || posts.length;
    const publishedCount = posts.filter((p) => p.status === "PUBLISHED" || p.targets?.some((t) => t.publish_status === "PUBLISHED")).length;
    const failedCount = posts.filter((p) => p.targets?.some((t) => t.publish_status === "FAILED")).length;
    const queuedCount = posts.filter((p) => p.status === "PUBLISHING" || p.targets?.some((t) => t.publish_status === "QUEUED" || t.publish_status === "UPLOADING")).length;

    const handleCopyCaption = (post: HistoryPostItem) => {
        const text = `${post.ai_title || ""}\n\n${post.raw_caption || ""}`;
        navigator.clipboard.writeText(text.trim());
        setCopiedPostId(post.id);
        setTimeout(() => setCopiedPostId(null), 2000);
    };

    const handleRetry = async (postId: string, platform: string, targetId: string) => {
        setRetryingTargetId(targetId);
        try {
            await retryMutation.mutateAsync({
                postId,
                platform: platform.toLowerCase() as Platform,
            });
            // Also update the selected post if the modal is open
            if (selectedPost && selectedPost.id === postId) {
                const updatedTargets = selectedPost.targets.map((t) =>
                    t.id === targetId ? { ...t, publish_status: "QUEUED", error_message: null } : t
                );
                setSelectedPost({ ...selectedPost, targets: updatedTargets });
            }
        } catch {
            // error handled in mutation
        } finally {
            setRetryingTargetId(null);
        }
    };

    const handleDelete = async (postId: string) => {
        if (window.confirm("Are you sure you want to remove this post from your history?")) {
            await deleteMutation.mutateAsync(postId);
            if (selectedPost?.id === postId) {
                setSelectedPost(null);
            }
        }
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 p-4 sm:p-6 lg:p-8" style={{ background: "#F5F3FF" }}>
            {/* ── Top Header ────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/80 text-purple-700 text-xs font-bold mb-2">
                        <Clock className="h-3.5 w-3.5" />
                        <span>PUBLISHING LOGS & ARCHIVE</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                        Post <span style={{ color: "#6C5CE7" }}>History</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Track multi-platform delivery statuses, inspect errors, retry failed targets, and view live posts.
                    </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-purple-100 text-xs font-bold text-gray-700 shadow-sm hover:bg-purple-50/50 hover:text-purple-600 transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin text-purple-600")} />
                        <span>{isFetching ? "Refreshing..." : "Refresh"}</span>
                    </button>

                    <Link
                        href="/create"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:shadow-md transition-all"
                        style={{
                            background: "linear-gradient(135deg, #6C5CE7, #a29bfe)",
                            boxShadow: "0 4px 14px rgba(108,92,231,0.35)",
                        }}
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Create Post</span>
                    </Link>
                </div>
            </div>

            {/* ── KPI Stat Chips ────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100/80 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Posts</p>
                        <p className="text-xl font-black text-gray-900 mt-0.5">{isLoading ? "..." : totalPosts}</p>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                        <Clock className="h-4 w-4" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100/80 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Live & Delivered</p>
                        <p className="text-xl font-black text-emerald-600 mt-0.5">{isLoading ? "..." : publishedCount}</p>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                        <CheckCircle2 className="h-4 w-4" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100/80 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Needs Attention</p>
                        <p className="text-xl font-black text-red-600 mt-0.5">{isLoading ? "..." : failedCount}</p>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
                        <AlertTriangle className="h-4 w-4" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100/80 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">In Progress</p>
                        <p className="text-xl font-black text-amber-600 mt-0.5">{isLoading ? "..." : queuedCount}</p>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                        <RefreshCw className="h-4 w-4" />
                    </div>
                </div>
            </div>

            {/* ── Search & Filter Controls ──────────────────────────────── */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100/80 mb-6">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                    {/* Search bar */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search by title, caption, or keywords..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs font-medium bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-400 focus:bg-white transition-all text-gray-800 placeholder:text-gray-400"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Platform Filter */}
                    <div className="flex items-center gap-2">
                        <div className="relative shrink-0">
                            <select
                                value={platformFilter}
                                onChange={(e) => {
                                    setPlatformFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 focus:outline-none focus:border-purple-400 transition-colors cursor-pointer"
                            >
                                <option value="ALL">All Platforms</option>
                                <option value="YOUTUBE">YouTube</option>
                                <option value="INSTAGRAM">Instagram</option>
                                <option value="LINKEDIN">LinkedIn</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="relative shrink-0">
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 focus:outline-none focus:border-purple-400 transition-colors cursor-pointer"
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="PUBLISHED">Published</option>
                                <option value="FAILED">Failed / Error</option>
                                <option value="PUBLISHING">Publishing</option>
                                <option value="DRAFT">Draft</option>
                            </select>
                        </div>

                        {(search || statusFilter !== "ALL" || platformFilter !== "ALL") && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("ALL");
                                    setPlatformFilter("ALL");
                                    setPage(1);
                                }}
                                className="px-3 py-2 rounded-xl text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors shrink-0"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Posts List / Table Section ────────────────────────────── */}
            <div className="flex-1 flex flex-col min-h-0">
                {isLoading ? (
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100 flex items-center gap-4 animate-pulse">
                                <Skeleton height="h-16" width="w-20" rounded="lg" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton height="h-4" width="w-3/4" />
                                    <Skeleton height="h-3" width="w-1/2" />
                                </div>
                                <Skeleton height="h-8" width="w-24" rounded="lg" />
                            </div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div
                        className="flex flex-col items-center justify-center flex-1 rounded-2xl bg-white py-16 px-4 text-center border border-purple-100/80 shadow-sm"
                    >
                        <div
                            className="flex h-16 w-16 items-center justify-center rounded-2xl mb-4"
                            style={{ background: "linear-gradient(135deg, #6C5CE7, #a29bfe)", boxShadow: "0 8px 24px rgba(108,92,231,0.35)" }}
                        >
                            <Film className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-lg font-black text-gray-900 mb-1">
                            {search || statusFilter !== "ALL" || platformFilter !== "ALL"
                                ? "No matching posts found"
                                : "No published posts yet"}
                        </h2>
                        <p className="text-xs text-gray-500 max-w-sm mb-5 leading-relaxed">
                            {search || statusFilter !== "ALL" || platformFilter !== "ALL"
                                ? "Try adjusting your search query or reset your filters to view all posts."
                                : "Your post history and real-time delivery logs will appear here once you publish content across your channels."}
                        </p>
                        <Link
                            href="/create"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:shadow-lg transition-all"
                            style={{ background: "linear-gradient(135deg, #6C5CE7, #a29bfe)" }}
                        >
                            <Sparkles className="h-4 w-4" />
                            <span>Create Your First Post →</span>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3.5">
                        {posts.map((post) => {
                            const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            });

                            return (
                                <div
                                    key={post.id}
                                    className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-purple-100/80 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                                >
                                    {/* Left: Thumbnail + Title + Meta */}
                                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                                        {/* Media thumbnail container */}
                                        <div
                                            onClick={() => setSelectedPost(post)}
                                            className="relative h-16 w-20 sm:h-20 sm:w-24 rounded-xl overflow-hidden bg-gray-900 shrink-0 border border-gray-200 cursor-pointer group-hover:ring-2 group-hover:ring-purple-400 transition-all flex items-center justify-center"
                                        >
                                            {post.media_url ? (
                                                post.media_type === "VIDEO" ? (
                                                    <video
                                                        src={post.media_url}
                                                        className="h-full w-full object-cover"
                                                        muted
                                                        playsInline
                                                        preload="metadata"
                                                    />
                                                ) : (
                                                    <img
                                                        src={post.media_url}
                                                        alt={post.ai_title || "Post media"}
                                                        className="h-full w-full object-cover"
                                                    />
                                                )
                                            ) : (
                                                <Film className="h-6 w-6 text-gray-500" />
                                            )}

                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Eye className="h-5 w-5 text-white" />
                                            </div>

                                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white uppercase">
                                                {post.media_type || "MEDIA"}
                                            </span>
                                        </div>

                                        {/* Post title & details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <h3
                                                    onClick={() => setSelectedPost(post)}
                                                    className="font-black text-sm sm:text-base text-gray-900 truncate hover:text-purple-600 transition-colors cursor-pointer"
                                                >
                                                    {post.ai_title || post.raw_caption || "Untitled Post"}
                                                </h3>
                                            </div>

                                            <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                                                {post.raw_caption || "No extra description provided."}
                                            </p>

                                            <div className="flex items-center gap-3 text-[11px] text-gray-400">
                                                <span className="flex items-center gap-1 font-medium">
                                                    <Calendar className="h-3 w-3" />
                                                    {formattedDate}
                                                </span>
                                                <span>•</span>
                                                <span className="font-semibold text-gray-600">
                                                    {post.targets?.length || 0} {post.targets?.length === 1 ? "Target" : "Targets"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle: Platform delivery badges */}
                                    <div className="flex flex-wrap items-center gap-2 shrink-0 py-2 border-t border-gray-100 md:border-0">
                                        {post.targets?.map((target) => (
                                            <PlatformStatusBadge
                                                key={target.id}
                                                target={target}
                                                postId={post.id}
                                                isRetrying={retryingTargetId === target.id}
                                                onRetry={() => handleRetry(post.id, target.platform, target.id)}
                                                onSelectDetails={() => setSelectedPost(post)}
                                            />
                                        ))}
                                    </div>

                                    {/* Right: Actions menu */}
                                    <div className="flex items-center gap-1.5 shrink-0 self-end md:self-auto">
                                        <button
                                            onClick={() => setSelectedPost(post)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 bg-gray-50 hover:bg-purple-50 hover:text-purple-600 border border-gray-200 transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                            <span className="hidden sm:inline">Details</span>
                                        </button>

                                        <button
                                            onClick={() => handleCopyCaption(post)}
                                            className="p-1.5 rounded-xl text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors border border-transparent hover:border-purple-100"
                                            title="Copy Caption"
                                        >
                                            {copiedPostId === post.id ? (
                                                <Check className="h-4 w-4 text-emerald-600" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </button>

                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="p-1.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                                            title="Delete Post"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Pagination Bar */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4 pb-2 px-2">
                                <p className="text-xs font-bold text-gray-500">
                                    Showing page <span className="text-gray-900">{pagination.page}</span> of {pagination.totalPages} ({pagination.total} posts)
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                                    >
                                        <ChevronLeft className="h-3.5 w-3.5" />
                                        <span>Prev</span>
                                    </button>
                                    <button
                                        onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                        disabled={!pagination.hasMore}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                                    >
                                        <span>Next</span>
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Detailed Modal / Drawer ───────────────────────────────── */}
            {selectedPost && (
                <PostDetailsModal
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                    retryingTargetId={retryingTargetId}
                    onRetryTarget={handleRetry}
                    onDeletePost={handleDelete}
                />
            )}
        </div>
    );
}

// ─── Platform Status Badge ────────────────────────────────────────────────────

function PlatformStatusBadge({
    target,
    postId,
    isRetrying,
    onRetry,
    onSelectDetails,
}: {
    target: HistoryPostTarget;
    postId: string;
    isRetrying: boolean;
    onRetry: () => void;
    onSelectDetails: () => void;
}) {
    const isPublished = target.publish_status === "PUBLISHED";
    const isFailed = target.publish_status === "FAILED";
    const isQueued = target.publish_status === "QUEUED" || target.publish_status === "UPLOADING" || target.publish_status === "PENDING";

    const platformIcon = {
        YOUTUBE: <YoutubeIcon className="h-3.5 w-3.5 text-red-600" />,
        INSTAGRAM: <InstagramIcon className="h-3.5 w-3.5 text-pink-600" />,
        LINKEDIN: <LinkedinIcon className="h-3.5 w-3.5 text-blue-600" />,
    }[target.platform] || null;

    if (isPublished) {
        return (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
                {platformIcon}
                <span>Delivered</span>
                {target.platform_post_url && (
                    <a
                        href={target.platform_post_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 hover:text-emerald-900 ml-0.5"
                        title="View Live Post"
                    >
                        <ExternalLink className="h-3 w-3" />
                    </a>
                )}
            </div>
        );
    }

    if (isFailed) {
        return (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-red-50 border border-red-200 text-[11px] font-bold text-red-700">
                {platformIcon}
                <span className="cursor-pointer" onClick={onSelectDetails} title={target.error_message || "Failed"}>
                    Failed
                </span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRetry();
                    }}
                    disabled={isRetrying}
                    className="p-0.5 rounded hover:bg-red-200 text-red-700 ml-0.5 transition-colors"
                    title="Retry this target"
                >
                    <RotateCcw className={cn("h-3 w-3", isRetrying && "animate-spin")} />
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-700">
            {platformIcon}
            <RefreshCw className="h-3 w-3 animate-spin text-amber-600" />
            <span className="capitalize">{target.publish_status.toLowerCase()}</span>
        </div>
    );
}

// ─── Post Details Modal ───────────────────────────────────────────────────────

function PostDetailsModal({
    post,
    onClose,
    retryingTargetId,
    onRetryTarget,
    onDeletePost,
}: {
    post: HistoryPostItem;
    onClose: () => void;
    retryingTargetId: string | null;
    onRetryTarget: (postId: string, platform: string, targetId: string) => void;
    onDeletePost: (postId: string) => void;
}) {
    const formattedDate = new Date(post.created_at).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-100 flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                            <Eye className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="font-black text-lg text-gray-900">Post Inspection</h2>
                            <p className="text-xs text-gray-400">Created on {formattedDate}</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="h-8 w-8 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-5 sm:p-6 space-y-6">
                    {/* Media preview section */}
                    {post.media_url && (
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Media Asset</p>
                            <div className="relative rounded-2xl overflow-hidden bg-black max-h-64 flex items-center justify-center border border-gray-200">
                                {post.media_type === "VIDEO" ? (
                                    <video
                                        src={post.media_url}
                                        controls
                                        className="max-h-64 w-full object-contain"
                                        playsInline
                                    />
                                ) : (
                                    <img
                                        src={post.media_url}
                                        alt={post.ai_title || "Post preview"}
                                        className="max-h-64 w-full object-contain"
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Title & Caption */}
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Content Details</p>
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3">
                            <div>
                                <span className="text-[10px] font-bold text-purple-600 uppercase">Title</span>
                                <p className="font-bold text-sm text-gray-900 mt-0.5">{post.ai_title || "—"}</p>
                            </div>
                            {post.raw_caption && (
                                <div>
                                    <span className="text-[10px] font-bold text-purple-600 uppercase">Caption / Description</span>
                                    <p className="text-xs text-gray-700 whitespace-pre-wrap mt-0.5 leading-relaxed">{post.raw_caption}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Platform Target Statuses */}
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Platform Delivery Statuses</p>
                        <div className="space-y-3">
                            {post.targets?.map((target) => {
                                const isPublished = target.publish_status === "PUBLISHED";
                                const isFailed = target.publish_status === "FAILED";
                                const isRetrying = retryingTargetId === target.id;

                                return (
                                    <div
                                        key={target.id}
                                        className={cn(
                                            "rounded-2xl p-4 border transition-all",
                                            isPublished && "bg-emerald-50/50 border-emerald-200",
                                            isFailed && "bg-red-50/50 border-red-200",
                                            !isPublished && !isFailed && "bg-amber-50/50 border-amber-200"
                                        )}
                                    >
                                        <div className="flex items-center justify-between gap-3 mb-2">
                                            <div className="flex items-center gap-2">
                                                {target.platform === "YOUTUBE" && <YoutubeIcon className="h-4 w-4 text-red-600" />}
                                                {target.platform === "INSTAGRAM" && <InstagramIcon className="h-4 w-4 text-pink-600" />}
                                                {target.platform === "LINKEDIN" && <LinkedinIcon className="h-4 w-4 text-blue-600" />}
                                                <span className="font-black text-sm text-gray-900">{target.platform}</span>
                                            </div>

                                            <span
                                                className={cn(
                                                    "px-2.5 py-0.5 rounded-full text-[11px] font-bold",
                                                    isPublished && "bg-emerald-100 text-emerald-800",
                                                    isFailed && "bg-red-100 text-red-800",
                                                    !isPublished && !isFailed && "bg-amber-100 text-amber-800"
                                                )}
                                            >
                                                {target.publish_status}
                                            </span>
                                        </div>

                                        {/* Published at or error message */}
                                        {target.published_at && (
                                            <p className="text-xs text-emerald-700 font-medium mb-2">
                                                Published at: {new Date(target.published_at).toLocaleString()}
                                            </p>
                                        )}

                                        {target.error_message && (
                                            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-red-100/70 text-red-800 text-xs font-medium mb-3">
                                                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold">Failure Reason:</p>
                                                    <p className="text-[11px] mt-0.5 break-words">{target.error_message}</p>
                                                    <p className="text-[10px] text-red-600 mt-1">Retries used: {target.retry_count || 0}/3</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Action buttons */}
                                        <div className="flex items-center gap-2">
                                            {target.platform_post_url && (
                                                <a
                                                    href={target.platform_post_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm"
                                                >
                                                    <span>View Live Post</span>
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            )}

                                            {isFailed && (
                                                <button
                                                    onClick={() => onRetryTarget(post.id, target.platform, target.id)}
                                                    disabled={isRetrying || (target.retry_count || 0) >= 3}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 transition-colors disabled:opacity-50"
                                                >
                                                    <RotateCcw className={cn("h-3 w-3", isRetrying && "animate-spin")} />
                                                    <span>{isRetrying ? "Retrying..." : (target.retry_count || 0) >= 3 ? "Max retries reached" : "Retry Platform"}</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between rounded-b-3xl">
                    <button
                        onClick={() => onDeletePost(post.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-100/50 transition-colors"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete Archive</span>
                    </button>

                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
