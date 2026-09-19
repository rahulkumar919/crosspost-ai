"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import {
    AlertCircle, Wand2, Hash, Lightbulb, CalendarDays,
    ChevronRight, CloudUpload, MoreVertical, Loader2,
    CheckCircle2, Radio,
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
    gradient: string;
    glow: string;
    color: string;
}

const PLATFORM_CONFIG: Record<Platform, PlatformCfg> = {
    youtube: {
        label: "YouTube",
        defaultHandle: "Video platform",
        icon: YoutubeIcon,
        gradient: "linear-gradient(135deg, #FF0000, #FF4444)",
        glow: "rgba(255,0,0,0.2)",
        color: "#FF0000",
    },
    instagram: {
        label: "Instagram",
        defaultHandle: "Photo & Reels platform",
        icon: InstagramIcon,
        gradient: "linear-gradient(135deg, #833AB4, #E1306C, #F77737)",
        glow: "rgba(225,48,108,0.2)",
        color: "#E1306C",
    },
    linkedin: {
        label: "LinkedIn",
        defaultHandle: "Professional network",
        icon: LinkedinIcon,
        gradient: "linear-gradient(135deg, #0077B5, #00a0dc)",
        glow: "rgba(0,119,181,0.2)",
        color: "#0077B5",
    },
};

// ─── AI tools data ────────────────────────────────────────────────────────────

const aiTools = [
    { icon: Wand2, label: "AI Captions", desc: "Generate engaging captions", color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
    { icon: Hash, label: "Hashtags", desc: "Find trending hashtags", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
    { icon: Lightbulb, label: "Content Ideas", desc: "Get inspired ideas", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
    { icon: CalendarDays, label: "Calendar", desc: "Plan your schedule", color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
];

// ─── Page wrapper ─────────────────────────────────────────────────────────────

export default function AccountsPage() {
    return (
        <Suspense fallback={<div className="flex-1 min-h-screen" style={{ background: "var(--background)" }} />}>
            <AccountsPageInner />
        </Suspense>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function AccountsPageInner() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();

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
    const totalCount = PLATFORMS.length;

    const [oauthErrorMsg, setOauthErrorMsg] = React.useState<string | null>(null);

    React.useEffect(() => {
        const connected = searchParams.get("connected");
        const oauthError = searchParams.get("error");
        if (oauthError) setOauthErrorMsg(decodeURIComponent(oauthError));
        if (connected || oauthError) {
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            window.history.replaceState({}, "", "/accounts");
        }
    }, [searchParams, queryClient]);

    const connectApiError = connectError instanceof Error ? connectError.message : null;
    const currentError = oauthErrorMsg || connectApiError;
    const firstName = session?.user?.name?.split(" ")[0] ?? "there";

    return (
        <div className="flex flex-col flex-1 min-h-0" style={{ background: "var(--background)" }}>

            {/* ── Page hero strip ──────────────────────────────────── */}
            <div
                className="px-4 sm:px-6 lg:px-8 pt-5 pb-6"
                style={{
                    background: "linear-gradient(135deg, var(--surface) 0%, var(--surface-elevated) 50%, var(--surface) 100%)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Ambient blobs */}
                <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(108,92,231,0.3) 0%, transparent 70%)" }} />
                <div className="absolute -bottom-10 right-0 w-48 h-48 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(162,155,254,0.15) 0%, transparent 70%)" }} />

                <div className="relative max-w-5xl mx-auto">
                    {/* Error banner */}
                    {currentError && (
                        <div className="mb-5 flex items-start justify-between gap-3 rounded-2xl p-4 border border-red-400/30 bg-red-500/10 backdrop-blur-sm">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-red-300">Connection error</p>
                                    <p className="text-xs text-red-400 mt-0.5 leading-relaxed">{currentError}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setOauthErrorMsg(null)}
                                className="text-red-400 hover:text-red-200 transition-colors shrink-0 text-sm font-bold"
                                aria-label="Dismiss error"
                            >✕</button>
                        </div>
                    )}

                    {/* Heading row */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold tracking-widest uppercase mb-1.5 text-[#6C5CE7]">
                                Welcome back, {firstName} 👋
                            </p>
                            <h1 className="text-2xl sm:text-3xl font-black text-[var(--foreground-color)] leading-tight">
                                Connected{" "}
                                <span style={{ background: "linear-gradient(135deg, #6C5CE7, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                    Platforms
                                </span>
                            </h1>
                            <p className="text-sm mt-1.5 leading-relaxed max-w-sm text-[var(--foreground-muted)]">
                                Manage your social accounts and publish content everywhere at once.
                            </p>
                        </div>

                        {/* Stats pills */}
                        <div className="flex gap-3 shrink-0">
                            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-color)] shadow-sm">
                                <div className="h-2.5 w-2.5 rounded-full bg-[#6C5CE7]" style={{ boxShadow: "0 0 8px rgba(108,92,231,0.6)" }} />
                                <div>
                                    <p className="text-lg font-black text-[var(--foreground-color)] leading-none">{isLoading ? "–" : connectedCount}</p>
                                    <p className="text-[10px] mt-0.5 font-medium text-[var(--foreground-muted)]">Connected</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-color)] shadow-sm">
                                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" style={{ boxShadow: "0 0 8px rgba(16,185,129,0.6)" }} />
                                <div>
                                    <p className="text-lg font-black leading-none text-emerald-600 dark:text-emerald-400">{isLoading ? "–" : totalCount - connectedCount}</p>
                                    <p className="text-[10px] mt-0.5 font-medium text-[var(--foreground-muted)]">Available</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    {!isLoading && (
                        <div className="mt-5">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-medium text-[var(--foreground-muted)]">
                                    {connectedCount} of {totalCount} platforms connected
                                </span>
                                <span className="text-xs font-bold text-[#6C5CE7]">
                                    {Math.round((connectedCount / totalCount) * 100)}%
                                </span>
                            </div>
                            <div className="h-2 rounded-full overflow-hidden bg-[var(--border-color)]">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{
                                        width: `${(connectedCount / totalCount) * 100}%`,
                                        background: "linear-gradient(90deg, #6C5CE7, #8B5CF6)",
                                        boxShadow: "0 0 10px rgba(108,92,231,0.5)",
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Content ──────────────────────────────────────────── */}
            <div className="flex flex-col flex-1 px-4 sm:px-6 lg:px-8 py-4 max-w-5xl mx-auto w-full">

                {/* Two-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

                    {/* Left: Platform cards */}
                    <div className="flex flex-col gap-3">

                        {/* Mobile upload banner */}
                        <UploadBanner className="lg:hidden" />

                        {/* Platform list */}
                        <div className="flex flex-col gap-3">
                            {isLoading ? (
                                <>
                                    <Skeleton height="h-[88px]" rounded="lg" />
                                    <Skeleton height="h-[88px]" rounded="lg" />
                                    <Skeleton height="h-[88px]" rounded="lg" />
                                </>
                            ) : (
                                PLATFORMS.map((platform) => {
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
                                            gradient={cfg.gradient}
                                            glow={cfg.glow}
                                            color={cfg.color}
                                            isConnected={!!account}
                                            isLoading={isThisLoading}
                                            onConnect={() => connect(platform)}
                                            onDisconnect={() => disconnect(platform)}
                                        />
                                    );
                                })
                            )}
                        </div>

                        {/* Mobile AI tools */}
                        <div className="mt-2 lg:hidden">
                            <AIToolsPanel />
                        </div>
                    </div>

                    {/* Right column (desktop) */}
                    <div className="hidden lg:flex flex-col gap-4">
                        <UploadBanner />
                        <AIToolsPanel />
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-[11px]" style={{ color: "rgba(0,0,0,0.25)" }}>
                    © 2026 CrossPost AI — All rights reserved
                </p>
            </div>
        </div>
    );
}

// ─── Platform Card ────────────────────────────────────────────────────────────

function PlatformCard({
    label, handle, connectedAt, icon: Icon, gradient, glow, color,
    isConnected, isLoading, onConnect, onDisconnect,
}: {
    label: string;
    handle: string;
    connectedAt?: string;
    icon: React.ComponentType<{ className?: string }>;
    gradient: string;
    glow: string;
    color: string;
    isConnected: boolean;
    isLoading: boolean;
    onConnect: () => void;
    onDisconnect: () => void;
}) {
    const formattedDate = connectedAt
        ? new Date(connectedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : null;

    return (
        <div
            className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-[var(--surface)] transition-all duration-200 hover:shadow-md group"
            style={{
                boxShadow: isConnected
                    ? `0 2px 16px ${glow}`
                    : "0 2px 10px rgba(0,0,0,0.04)",
                border: isConnected
                    ? `1.5px solid ${color}40`
                    : "1px solid var(--border-color)",
            }}
        >
            {/* Platform icon */}
            <div
                className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl relative shadow-md"
                style={{ background: gradient }}
            >
                <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                {/* Connected indicator dot */}
                {isConnected && (
                    <div
                        className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-[var(--surface)] flex items-center justify-center bg-emerald-500 shadow-sm"
                    >
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-sm font-bold text-[var(--foreground-color)]">{label}</span>
                    {isConnected && (
                        <span
                            className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        >
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            Connected
                        </span>
                    )}
                </div>

                {/* Handle */}
                <p className="text-xs text-[var(--foreground-muted)] truncate leading-snug">
                    {isConnected ? `@${handle}` : handle}
                </p>

                {/* Connected date — desktop only */}
                {formattedDate && (
                    <p className="hidden sm:block text-[10px] text-[var(--foreground-muted)] mt-0.5 opacity-80">
                        Since {formattedDate}
                    </p>
                )}
            </div>

            {/* Action button */}
            <div className="flex items-center gap-2 shrink-0">
                {isConnected ? (
                    <button
                        onClick={onDisconnect}
                        disabled={isLoading}
                        className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-95 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20"
                        aria-label={`Disconnect ${label}`}
                    >
                        {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Disconnect"}
                    </button>
                ) : (
                    <button
                        onClick={onConnect}
                        disabled={isLoading}
                        className="px-3 sm:px-5 py-2 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50 hover:shadow-lg hover:scale-[1.02] active:scale-95"
                        style={{
                            background: "linear-gradient(135deg, #6C5CE7, #8B5CF6)",
                            boxShadow: "0 4px 12px rgba(108,92,231,0.35)",
                        }}
                        aria-label={`Connect ${label}`}
                    >
                        {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Connect"}
                    </button>
                )}

                {/* More options */}
                <button
                    className="flex items-center justify-center h-8 w-8 rounded-xl text-[var(--foreground-muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground-color)] transition-all"
                    aria-label={`More options for ${label}`}
                >
                    <MoreVertical className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

// ─── Upload Banner ────────────────────────────────────────────────────────────

function UploadBanner({ className }: { className?: string }) {
    return (
        <Link
            href="/create"
            className={cn(
                "relative block rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-[1.01] hover:shadow-xl active:scale-[0.99]",
                className
            )}
            style={{
                background: "linear-gradient(135deg, #6C5CE7 0%, #4F46E5 50%, #7C3AED 100%)",
                boxShadow: "0 8px 24px rgba(108,92,231,0.35)",
            }}
        >
            {/* Ambient subtle light glow */}
            <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/15 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-purple-300/10 blur-xl pointer-events-none" />

            <div className="relative p-5">
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0 bg-white/20 backdrop-blur-md border border-white/30"
                        style={{
                            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                        }}
                    >
                        <CloudUpload className="h-5 w-5 text-white" />
                    </div>

                    {/* Platform icons */}
                    <div className="flex items-center gap-1.5">
                        {[
                            { color: "#FF0000", label: "YT" },
                            { color: "#E1306C", label: "IG" },
                            { color: "#0077B5", label: "LI" },
                        ].map((p) => (
                            <div
                                key={p.label}
                                className="h-7 w-7 rounded-full flex items-center justify-center text-white text-[9px] font-black border border-white/20 shadow-sm"
                                style={{ background: p.color, boxShadow: `0 2px 8px ${p.color}80` }}
                            >
                                {p.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Text */}
                <p className="font-black text-white text-[17px] leading-snug mb-1">
                    Upload Your <span className="text-violet-200">Video</span>
                </p>
                <p className="text-xs text-white/80 leading-relaxed mb-4">
                    AI optimizes and publishes to all your connected platforms instantly.
                </p>

                {/* CTA */}
                <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#6C5CE7] bg-white transition-all group-hover:shadow-lg group-hover:scale-[1.02]"
                    style={{
                        boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                    }}
                >
                    <CloudUpload className="h-3.5 w-3.5 text-[#6C5CE7]" />
                    <span>Start Uploading</span>
                    <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform text-[#6C5CE7]" />
                </div>
            </div>
        </Link>
    );
}

// ─── AI Tools Panel ───────────────────────────────────────────────────────────

function AIToolsPanel() {
    return (
        <div
            className="rounded-2xl bg-[var(--surface)] p-5 border border-[var(--border-color)] shadow-sm"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div
                        className="h-8 w-8 flex items-center justify-center rounded-xl bg-[#6C5CE7]/10"
                    >
                        <span style={{ fontSize: "15px" }}>✨</span>
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-[var(--foreground-color)]">AI Tools</h2>
                        <p className="text-[10px] text-[var(--foreground-muted)]">Smart content creation</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {aiTools.map(({ icon: Icon, label, desc, color, bg }) => (
                    <button
                        key={label}
                        className="flex flex-col gap-2 p-3 rounded-xl text-left transition-all bg-[var(--surface-elevated)] border border-[var(--border-color)] hover:border-[#6C5CE7]/40 hover:scale-[1.02] active:scale-95 group"
                    >
                        <div
                            className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm"
                            style={{ background: bg }}
                        >
                            <Icon className="h-4 w-4" style={{ color }} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-[var(--foreground-color)] leading-tight">{label}</p>
                            <p className="text-[9px] text-[var(--foreground-muted)] mt-0.5 leading-tight">{desc}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}



