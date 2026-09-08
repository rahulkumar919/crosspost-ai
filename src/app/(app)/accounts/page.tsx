"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import {
    AlertCircle, ChevronDown, ChevronUp,
    Wand2, Hash, Lightbulb, CalendarDays, ChevronRight,
    CloudUpload, MoreVertical,
} from "lucide-react";
import { useConnectedAccounts } from "@/hooks/useConnectedAccounts";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { YoutubeIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/platform-icons";
import type { Platform } from "@/types/account.types";

// ─── Platform config ──────────────────────────────────────────────────────────

const PLATFORMS: Platform[] = ["youtube", "instagram", "linkedin"];

interface PlatformCfg {
    label: string;
    defaultHandle: string;
    icon: React.ComponentType<{ className?: string }>;
    iconBg: string;
    iconColor: string;
}

const PLATFORM_CONFIG: Record<Platform, PlatformCfg> = {
    youtube: {
        label: "YouTube",
        defaultHandle: "Video platform",
        icon: YoutubeIcon,
        iconBg: "#FFF1F0",
        iconColor: "#FF0000",
    },
    instagram: {
        label: "Instagram",
        defaultHandle: "Photo & Reels platform",
        icon: InstagramIcon,
        iconBg: "linear-gradient(135deg, #fdf2f8, #fff7ed)",
        iconColor: "#E1306C",
    },
    linkedin: {
        label: "LinkedIn",
        defaultHandle: "Professional network",
        icon: LinkedinIcon,
        iconBg: "#EFF6FF",
        iconColor: "#0077B5",
    },
};

// ─── AI tools data ────────────────────────────────────────────────────────────

const aiTools = [
    { icon: Wand2, label: "AI Caption Generator", desc: "Generate engaging captions", color: "#8B5CF6", bg: "#F3F0FF" },
    { icon: Hash, label: "Hashtag Generator", desc: "Find trending hashtags", color: "#F59E0B", bg: "#FFFBEB" },
    { icon: Lightbulb, label: "Content Ideas", desc: "Get inspired content ideas", color: "#6C5CE7", bg: "#EDE9FE" },
    { icon: CalendarDays, label: "Content Calendar", desc: "Plan your schedule", color: "#EF4444", bg: "#FFF1F0" },
];

// ─── Page wrapper ─────────────────────────────────────────────────────────────

export default function AccountsPage() {
    return (
        <Suspense fallback={<div className="flex-1 min-h-screen" style={{ background: "#F5F3FF" }} />}>
            <AccountsPageInner />
        </Suspense>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function AccountsPageInner() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const [showAll, setShowAll] = React.useState(false);

    const {
        accounts,
        isLoading,
        connect,
        disconnect,
        connectError,
        isConnecting,
        isDisconnecting,
        connectingPlatform,
        disconnectingPlatform,
    } = useConnectedAccounts();

    const connectedCount = accounts.length;
    const availableCount = PLATFORMS.length + 1 - connectedCount; // +1 for Facebook

    const [oauthErrorMsg, setOauthErrorMsg] = React.useState<string | null>(null);

    // Invalidate on OAuth callback
    React.useEffect(() => {
        const connected = searchParams.get("connected");
        const oauthError = searchParams.get("error");
        if (oauthError) {
            setOauthErrorMsg(decodeURIComponent(oauthError));
        }
        if (connected || oauthError) {
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            window.history.replaceState({}, "", "/accounts");
        }
    }, [searchParams, queryClient]);

    const connectApiError = connectError instanceof Error ? connectError.message : null;
    const currentError = oauthErrorMsg || connectApiError;

    return (
        <div
            className="flex flex-col flex-1 min-h-0"
            style={{ background: "#F5F3FF" }}
        >
            {/* ── Main content ──────────────────────────────────── */}
            <div className="flex flex-col flex-1 px-4 sm:px-6 lg:px-8 pt-6 pb-8">

                {/* Error banner */}
                {currentError && (
                    <div className="mb-4 flex items-start justify-between gap-3 rounded-2xl p-4 border border-red-200 bg-red-50 animate-fade-in shadow-sm">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
                            <div>
                                <p className="text-sm font-semibold text-red-700">Connection error</p>
                                <p className="text-xs text-red-600 mt-1 whitespace-pre-line leading-relaxed">
                                    {currentError}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setOauthErrorMsg(null)}
                            className="text-red-400 hover:text-red-700 p-1 rounded-lg transition-colors font-bold text-sm shrink-0"
                            aria-label="Dismiss error"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* ── Heading + Stats ────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                    <div>
                        <p className="text-sm font-semibold mb-1" style={{ color: "#6C5CE7" }}>
                            Welcome back! 👋
                        </p>
                        <h1 className="text-2xl font-black text-gray-900">
                            Connected{" "}
                            <span style={{ color: "#6C5CE7" }}>Platforms</span>
                        </h1>
                        <p className="text-sm text-gray-500 mt-1.5 max-w-sm leading-relaxed">
                            Manage your social accounts and publish content across all platforms in one place.
                        </p>
                    </div>

                    {/* Stats cards */}
                    <div className="flex gap-3 shrink-0">
                        {/* Connected */}
                        <div
                            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white"
                            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)" }}
                        >
                            <div
                                className="flex h-9 w-9 items-center justify-center rounded-xl"
                                style={{ background: "rgba(108,92,231,0.1)" }}
                            >
                                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" style={{ color: "#6C5CE7" }} aria-hidden="true">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xl font-black" style={{ color: "#6C5CE7" }}>
                                    {isLoading ? "–" : connectedCount}
                                </p>
                                <p className="text-[11px] font-medium text-gray-400">Connected</p>
                            </div>
                        </div>

                        {/* Available */}
                        <div
                            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white"
                            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)" }}
                        >
                            <div
                                className="flex h-9 w-9 items-center justify-center rounded-xl"
                                style={{ background: "rgba(16,185,129,0.1)" }}
                            >
                                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-emerald-500" aria-hidden="true">
                                    <path d="M1 6s4-2 11-2 11 2 11 2M1 12s4-2 11-2 11 2 11 2M1 18s4-2 11-2 11 2 11 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xl font-black text-emerald-500">
                                    {isLoading ? "–" : availableCount}
                                </p>
                                <p className="text-[11px] font-medium text-gray-400">Available</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Two-column layout ────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">

                    {/* ─ Left: Platform cards ─ */}
                    <div className="flex flex-col gap-4">

                        {/* Mobile: Upload banner on top of platforms */}
                        <UploadBanner className="lg:hidden" />

                        {/* Platform list */}
                        <div className="flex flex-col gap-3">
                            {isLoading ? (
                                <>
                                    <Skeleton height="h-[76px]" rounded="lg" />
                                    <Skeleton height="h-[76px]" rounded="lg" />
                                    <Skeleton height="h-[76px]" rounded="lg" />
                                    <Skeleton height="h-[76px]" rounded="lg" />
                                </>
                            ) : (
                                <>
                                    {PLATFORMS.map((platform) => {
                                        const account = accounts.find((a) => a.platform === platform);
                                        const isThisLoading =
                                            (isConnecting && connectingPlatform === platform) ||
                                            (isDisconnecting && disconnectingPlatform === platform);
                                        const cfg = PLATFORM_CONFIG[platform];

                                        return (
                                            <PlatformCard
                                                key={platform}
                                                label={cfg.label}
                                                handle={account?.handle ?? cfg.defaultHandle}
                                                connectedAt={account?.connectedAt}
                                                icon={cfg.icon}
                                                iconBg={cfg.iconBg}
                                                iconColor={cfg.iconColor}
                                                isConnected={!!account}
                                                isLoading={isThisLoading}
                                                onConnect={() => connect(platform)}
                                                onDisconnect={() => disconnect(platform)}
                                            />
                                        );
                                    })}


                                </>
                            )}
                        </div>


                    </div>

                    {/* ─ Right column (desktop) ─ */}
                    <div className="hidden lg:flex flex-col gap-4">
                        <UploadBanner />
                        <AIToolsPanel />
                    </div>
                </div>

                {/* Mobile / Tablet: AI Tools Section */}
                <div className="mt-6 lg:hidden">
                    <AIToolsPanel />
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-xs text-gray-400">
                    © 2026 CrossPost AI. All rights reserved.
                </p>
            </div>
        </div>
    );
}

// ─── Platform Card ────────────────────────────────────────────────────────────

function PlatformCard({
    label, handle, connectedAt, icon: Icon, iconBg, iconColor,
    isConnected, isLoading, onConnect, onDisconnect,
    badge, badgeStyle, comingSoon,
}: {
    label: string;
    handle: string;
    connectedAt?: string;
    icon: React.ComponentType<{ className?: string }>;
    iconBg: string;
    iconColor: string;
    isConnected: boolean;
    isLoading: boolean;
    onConnect: () => void;
    onDisconnect: () => void;
    badge?: string;
    badgeStyle?: React.CSSProperties;
    comingSoon?: boolean;
}) {
    const formattedDate = connectedAt
        ? new Date(connectedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : null;

    return (
        <div
            className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white transition-all duration-200 hover:shadow-md"
            style={{
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                border: "1px solid rgba(0,0,0,0.05)",
            }}
        >
            {/* Icon */}
            <div
                className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl"
                style={{ background: iconBg, color: iconColor }}
            >
                <Icon className="h-[28px] w-[28px]" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-sm font-bold text-gray-900">{label}</span>
                    {isConnected && (
                        <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: "#DCFCE7", color: "#16A34A" }}
                        >
                            Connected
                        </span>
                    )}
                    {!isConnected && badge && (
                        <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={badgeStyle}
                        >
                            {badge}
                        </span>
                    )}
                </div>
                <p className="text-xs text-gray-400 truncate">{handle}</p>
                {formattedDate && (
                    <p className="text-[10px] text-gray-400 mt-0.5">
                        Connected {formattedDate}
                    </p>
                )}
            </div>

            {/* Action */}
            {isConnected ? (
                <button
                    onClick={onDisconnect}
                    disabled={isLoading}
                    className="shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:border-red-200 hover:text-red-500 transition-all disabled:opacity-50"
                >
                    {isLoading ? "…" : "Disconnect"}
                </button>
            ) : (
                <button
                    onClick={onConnect}
                    disabled={isLoading}
                    className="shrink-0 px-5 py-1.5 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50 hover:shadow-lg"
                    style={{
                        background: "linear-gradient(135deg, #6C5CE7, #a29bfe)",
                        boxShadow: "0 4px 12px rgba(108,92,231,0.35)",
                    }}
                >
                    {isLoading ? "…" : "Connect"}
                </button>
            )}

            {/* More button */}
            <button
                className="shrink-0 flex items-center justify-center h-8 w-8 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all"
                aria-label={`More options for ${label}`}
            >
                <MoreVertical className="h-4 w-4" />
            </button>
        </div>
    );
}

// ─── Upload Banner ────────────────────────────────────────────────────────────

function UploadBanner({ className }: { className?: string }) {
    return (
        <Link
            href="/create"
            className={cn("relative block rounded-2xl overflow-hidden group", className)}
            style={{
                background: "linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 60%, #C7D2FE 100%)",
                border: "1px solid rgba(108,92,231,0.2)",
            }}
        >
            <div className="p-5 relative z-10">
                <div className="flex items-start gap-4">
                    {/* Left content */}
                    <div className="flex-1 min-w-0">
                        <div
                            className="flex h-[52px] w-[52px] mb-3 items-center justify-center rounded-2xl"
                            style={{
                                background: "linear-gradient(135deg, #6C5CE7, #a29bfe)",
                                boxShadow: "0 6px 20px rgba(108,92,231,0.5)",
                            }}
                        >
                            <CloudUpload className="h-6 w-6 text-white" aria-hidden="true" />
                        </div>
                        <p className="font-black text-gray-900 text-[16px] leading-snug">
                            Upload Your{" "}
                            <span style={{ color: "#6C5CE7" }}>Video</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed max-w-[200px]">
                            Upload your video and let AI optimize it for all your connected platforms.
                        </p>

                        {/* CTA Button */}
                        <button
                            className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all group-hover:shadow-lg group-hover:scale-[1.02]"
                            style={{
                                background: "linear-gradient(135deg, #6C5CE7, #a29bfe)",
                                boxShadow: "0 4px 14px rgba(108,92,231,0.4)",
                            }}
                            tabIndex={-1}
                        >
                            <CloudUpload className="h-3.5 w-3.5" aria-hidden="true" />
                            Upload Your Video
                        </button>
                    </div>

                    {/* Right: floating platform icon cluster */}
                    <div className="relative shrink-0 w-[100px] h-[110px]">
                        {/* Big center screen */}
                        <div
                            className="absolute top-2 right-0 w-16 h-[72px] rounded-xl flex items-center justify-center shadow-lg"
                            style={{ background: "linear-gradient(135deg, #7C3AED, #6366F1)" }}
                        >
                            {/* Play button */}
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                <svg viewBox="0 0 24 24" fill="white" className="h-4 w-4 ml-0.5">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                            </div>
                        </div>
                        {/* Instagram pill */}
                        <div
                            className="absolute top-0 right-14 flex h-8 w-8 items-center justify-center rounded-full shadow-md"
                            style={{ background: "linear-gradient(135deg, #E1306C, #833AB4)" }}
                        >
                            <svg viewBox="0 0 24 24" fill="white" className="h-4 w-4">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2" />
                                <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="2" />
                                <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
                            </svg>
                        </div>
                        {/* YouTube pill */}
                        <div
                            className="absolute bottom-4 right-16 flex h-8 w-8 items-center justify-center rounded-full shadow-md"
                            style={{ background: "#FF0000" }}
                        >
                            <svg viewBox="0 0 24 24" fill="white" className="h-4 w-4">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-2.75 1 1 0 0 0-1.82 0A4.83 4.83 0 0 1 10.23 6.7 4.73 4.73 0 0 1 5.5 2a1 1 0 0 0-2 0 13.5 13.5 0 0 0 13 13 13.5 13.5 0 0 0 13-13 1 1 0 0 0-2 0 4.73 4.73 0 0 1-4.91 4.69z" />
                            </svg>
                        </div>
                        {/* LinkedIn pill */}
                        <div
                            className="absolute bottom-0 right-2 flex h-8 w-8 items-center justify-center rounded-full shadow-md"
                            style={{ background: "#0077B5" }}
                        >
                            <svg viewBox="0 0 24 24" fill="white" className="h-4 w-4">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                                <circle cx="4" cy="4" r="2" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// ─── AI Tools Panel ───────────────────────────────────────────────────────────

function AIToolsPanel() {
    return (
        <div
            className="rounded-2xl bg-white p-5"
            style={{
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.05)",
            }}
        >
            <div className="flex items-center gap-2 mb-4">
                <span style={{ fontSize: "18px" }} aria-hidden="true">✨</span>
                <div>
                    <h2 className="text-sm font-black text-gray-900">AI Tools</h2>
                    <p className="text-xs text-gray-400">Smart tools to create better content</p>
                </div>
            </div>

            {/* 2x2 Grid matching reference */}
            <div className="grid grid-cols-2 gap-2.5">
                {aiTools.map(({ icon: Icon, label, desc, color, bg }) => (
                    <button
                        key={label}
                        className="flex items-center gap-2.5 p-3 rounded-2xl text-left transition-all hover:shadow-md active:scale-95 group"
                        style={{
                            background: "#FAFAFA",
                            border: "1px solid rgba(0,0,0,0.06)",
                        }}
                    >
                        <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                            style={{ background: bg }}
                        >
                            <Icon className="h-4 w-4" style={{ color }} aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-gray-800 leading-tight">{label}</p>
                            <p className="text-[9px] text-gray-400 mt-0.5 leading-tight">{desc}</p>
                        </div>
                        <ChevronRight className="h-3 w-3 text-gray-300 shrink-0 group-hover:text-purple-400 transition-colors" aria-hidden="true" />
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── Facebook Icon ────────────────────────────────────────────────────────────

function FacebookIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    );
}
