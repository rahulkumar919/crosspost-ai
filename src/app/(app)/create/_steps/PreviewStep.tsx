"use client";

import * as React from "react";
import {
    ArrowLeft, Eye, EyeOff, Check, Rocket, AlertTriangle,
    Sparkles, ChevronRight,
} from "lucide-react";
import { cn, platformLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea, Input } from "@/components/ui/input";
import { Chip, AddChip } from "@/components/ui/chip";
import { YoutubePreviewCard } from "@/components/platform/YoutubePreviewCard";
import { YoutubeIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/platform-icons";
import { useDraftPostStore } from "@/store/useDraftPostStore";
import { useConnectedAccounts } from "@/hooks/useConnectedAccounts";
import type { Platform } from "@/types/account.types";

// ─── Platform brand config ────────────────────────────────────────────────────

const platformIcons: Record<Platform, React.ComponentType<{ className?: string }>> = {
    youtube: YoutubeIcon,
    instagram: InstagramIcon,
    linkedin: LinkedinIcon,
};

const platformConfig: Record<Platform, {
    gradient: string;
    glow: string;
    glowColor: string;
    activeBorder: string;
    bg: string;
    toggleOn: string;
    label: string;
    handle: string;
}> = {
    youtube: {
        gradient: "linear-gradient(135deg, #FF0000 0%, #FF4757 100%)",
        glow: "0 0 28px rgba(255,0,0,0.35)",
        glowColor: "rgba(255,0,0,0.2)",
        activeBorder: "rgba(255,71,87,0.5)",
        bg: "rgba(255,0,0,0.06)",
        toggleOn: "linear-gradient(135deg, #FF0000, #FF4757)",
        label: "YouTube",
        handle: "Video & Shorts",
    },
    instagram: {
        gradient: "linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #F77737 100%)",
        glow: "0 0 28px rgba(225,48,108,0.35)",
        glowColor: "rgba(225,48,108,0.2)",
        activeBorder: "rgba(225,48,108,0.5)",
        bg: "rgba(225,48,108,0.06)",
        toggleOn: "linear-gradient(135deg, #833AB4, #E1306C, #F77737)",
        label: "Instagram",
        handle: "Reels & Feed Posts",
    },
    linkedin: {
        gradient: "linear-gradient(135deg, #0077B5 0%, #00A0DC 100%)",
        glow: "0 0 28px rgba(0,119,181,0.35)",
        glowColor: "rgba(0,119,181,0.2)",
        activeBorder: "rgba(0,160,220,0.5)",
        bg: "rgba(0,119,181,0.06)",
        toggleOn: "linear-gradient(135deg, #0077B5, #00A0DC)",
        label: "LinkedIn",
        handle: "Articles & Posts",
    },
};

const PLATFORMS: Platform[] = ["youtube", "instagram", "linkedin"];

// ─── Premium Toggle Switch ────────────────────────────────────────────────────

function PlatformToggle({
    isOn,
    gradient,
    onToggle,
    platform,
}: {
    isOn: boolean;
    gradient: string;
    onToggle: () => void;
    platform: string;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={isOn}
            aria-label={`${isOn ? "Disable" : "Enable"} ${platform}`}
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            className="relative inline-flex h-7 w-[52px] shrink-0 cursor-pointer rounded-full transition-all duration-300 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
            style={{
                background: isOn ? gradient : "rgba(255,255,255,0.1)",
                border: isOn ? "none" : "1px solid rgba(255,255,255,0.15)",
                boxShadow: isOn ? "0 2px 12px rgba(0,0,0,0.3)" : "none",
            }}
        >
            <span
                aria-hidden="true"
                className="pointer-events-none inline-block h-5 w-5 rounded-full shadow-md transition-transform duration-300 ease-in-out"
                style={{
                    background: "#fff",
                    margin: "4px",
                    transform: isOn ? "translateX(24px)" : "translateX(0px)",
                    boxShadow: isOn ? "0 1px 6px rgba(0,0,0,0.35)" : "0 1px 4px rgba(0,0,0,0.25)",
                }}
            />
        </button>
    );
}

// ─── Platform Selection Card ──────────────────────────────────────────────────

function PlatformCard({
    platform,
    isIncluded,
    isActive,
    isConnected,
    onToggle,
    onActivate,
}: {
    platform: Platform;
    isIncluded: boolean;
    isActive: boolean;
    isConnected: boolean;
    onToggle: () => void;
    onActivate: () => void;
}) {
    const Icon = platformIcons[platform];
    const cfg = platformConfig[platform];

    return (
        <button
            type="button"
            onClick={onActivate}
            className="relative flex flex-col items-center gap-2.5 rounded-2xl p-4 pb-3 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-white/40 w-full"
            style={{
                background: isIncluded
                    ? `linear-gradient(160deg, rgba(255,255,255,0.07) 0%, ${cfg.glowColor} 100%)`
                    : "var(--surface-elevated)",
                border: `2px solid ${isActive && isIncluded
                    ? cfg.activeBorder
                    : isIncluded
                        ? "rgba(255,255,255,0.12)"
                        : "var(--border-color)"
                    }`,
                boxShadow: isActive && isIncluded
                    ? cfg.glow
                    : isIncluded
                        ? "0 4px 16px rgba(0,0,0,0.25)"
                        : "none",
                opacity: isIncluded ? 1 : 0.45,
            }}
            aria-pressed={isActive}
        >
            {/* Toggle — top right */}
            <div
                className="absolute top-2.5 right-2.5 z-10"
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
            >
                <PlatformToggle
                    isOn={isIncluded}
                    gradient={cfg.gradient}
                    onToggle={onToggle}
                    platform={cfg.label}
                />
            </div>

            {/* Platform icon */}
            <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 mt-1"
                style={{
                    background: isIncluded ? cfg.gradient : "var(--border-color)",
                    boxShadow: isIncluded ? cfg.glow : "none",
                }}
            >
                <Icon className="h-7 w-7 text-white" aria-hidden="true" />
            </div>

            {/* Label */}
            <p className={cn(
                "text-xs font-black tracking-wide",
                isIncluded ? "text-white" : "text-white/40"
            )}>
                {cfg.label}
            </p>

            {/* Status pill */}
            {isConnected ? (
                <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Connected
                </div>
            ) : (
                <a
                    href="/accounts"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all hover:opacity-80"
                    style={{ background: "rgba(167,139,250,0.15)", color: "#A78BFA" }}
                >
                    Connect +
                </a>
            )}

            {/* Active underline bar */}
            {isActive && isIncluded && (
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-full"
                    style={{ background: cfg.gradient }}
                />
            )}
        </button>
    );
}

// ─── Editor Panel Header ──────────────────────────────────────────────────────

function EditorPanelHeader({
    platform,
    isIncluded,
    onToggle,
}: {
    platform: Platform;
    isIncluded: boolean;
    onToggle: () => void;
}) {
    const Icon = platformIcons[platform];
    const cfg = platformConfig[platform];

    return (
        <div
            className="flex items-center gap-3 px-5 py-4 rounded-t-2xl"
            style={{
                background: isIncluded
                    ? `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, ${cfg.glowColor} 100%)`
                    : "var(--surface-elevated)",
                borderBottom: `1px solid ${isIncluded ? cfg.activeBorder : "var(--border-color)"}`,
            }}
        >
            {/* Icon */}
            <div
                className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
                style={{
                    background: isIncluded ? cfg.gradient : "var(--border-color)",
                    boxShadow: isIncluded ? cfg.glow : "none",
                }}
            >
                <Icon className="h-5 w-5 text-white" aria-hidden="true" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white">{cfg.label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {isIncluded ? `Editing content for ${cfg.handle}` : "Excluded from this post"}
                </p>
            </div>

            {/* Status pill + toggle */}
            <div className="flex items-center gap-3 shrink-0">
                {isIncluded && (
                    <span
                        className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
                        style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Publishing
                    </span>
                )}
                <PlatformToggle
                    isOn={isIncluded}
                    gradient={cfg.gradient}
                    onToggle={onToggle}
                    platform={cfg.label}
                />
            </div>
        </div>
    );
}

// ─── Main PreviewStep ─────────────────────────────────────────────────────────

export function PreviewStep() {
    const draft = useDraftPostStore((s) => s.draft);
    const setPlatformDraft = useDraftPostStore((s) => s.setPlatformDraft);
    const togglePlatformIncluded = useDraftPostStore((s) => s.togglePlatformIncluded);
    const setStep = useDraftPostStore((s) => s.setStep);
    const { accounts } = useConnectedAccounts();

    const [activePlatform, setActivePlatform] = React.useState<Platform>("youtube");
    const [showPreview, setShowPreview] = React.useState(true);

    const activeDraft = draft.platformDrafts[activePlatform];
    const activeCfg = platformConfig[activePlatform];
    const includedPlatforms = PLATFORMS.filter((p) => draft.platformDrafts[p].isIncluded);
    const includedCount = includedPlatforms.length;
    const unconnectedIncluded = includedPlatforms.filter(
        (p) => !accounts.some((a) => a.platform === p && a.isActive)
    );

    const addHashtag = (tag: string) => {
        if (!activeDraft.hashtags.includes(tag)) {
            setPlatformDraft(activePlatform, { hashtags: [...activeDraft.hashtags, tag] });
        }
    };
    const removeHashtag = (tag: string) => {
        setPlatformDraft(activePlatform, { hashtags: activeDraft.hashtags.filter((t) => t !== tag) });
    };

    const handleToggle = (platform: Platform) => {
        togglePlatformIncluded(platform);
        if (platform === activePlatform && draft.platformDrafts[platform].isIncluded) {
            const next = PLATFORMS.find((p) => p !== platform && draft.platformDrafts[p].isIncluded);
            if (next) setActivePlatform(next);
        }
    };

    const handleActivate = (platform: Platform) => {
        setActivePlatform(platform);
        if (!draft.platformDrafts[platform].isIncluded) {
            togglePlatformIncluded(platform);
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in-up">

            {/* ── Section heading ───────────────────────────────────────────── */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4" style={{ color: "#A78BFA" }} />
                    <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "rgba(167,139,250,0.7)" }}>
                        Publishing To
                    </p>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">
                    Preview &amp;{" "}
                    <span style={{ background: "linear-gradient(135deg, #A78BFA, #60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        Publish
                    </span>
                </h2>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Toggle platforms on or off, then fine-tune content for each channel.
                </p>
            </div>

            {/* ── Platform Selection Cards ──────────────────────────────────── */}
            <div
                className="rounded-2xl p-4"
                style={{
                    background: "var(--surface-elevated)",
                    border: "1px solid rgba(255,255,255,0.07)",
                }}
            >
                {/* Hint label */}
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                    <span>Click to edit · Toggle to include/exclude</span>
                </p>

                <div className="grid grid-cols-3 gap-3">
                    {PLATFORMS.map((platform) => (
                        <PlatformCard
                            key={platform}
                            platform={platform}
                            isIncluded={draft.platformDrafts[platform].isIncluded}
                            isActive={activePlatform === platform}
                            isConnected={accounts.some((a) => a.platform === platform && a.isActive)}
                            onToggle={() => handleToggle(platform)}
                            onActivate={() => handleActivate(platform)}
                        />
                    ))}
                </div>

                {/* Posting-to pill strip */}
                <div className="mt-4 pt-3 flex items-center gap-2 flex-wrap" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    {includedCount === 0 ? (
                        <p className="text-xs font-bold text-red-400">⚠ Select at least one platform</p>
                    ) : (
                        <>
                            <span className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.35)" }}>Posting to:</span>
                            {includedPlatforms.map((p) => {
                                const Icon = platformIcons[p];
                                const cfg = platformConfig[p];
                                return (
                                    <div
                                        key={p}
                                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[11px] font-bold"
                                        style={{ background: cfg.gradient, boxShadow: cfg.glow }}
                                    >
                                        <Icon className="h-3 w-3" />
                                        {cfg.label}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            </div>

            {/* ── Editor Panel ─────────────────────────────────────────────── */}
            <div
                className="rounded-2xl overflow-hidden"
                style={{
                    background: "var(--surface)",
                    border: `1px solid ${activeDraft.isIncluded ? activeCfg.activeBorder : "var(--border-color)"}`,
                    boxShadow: activeDraft.isIncluded ? activeCfg.glow : "none",
                    transition: "border-color 0.3s, box-shadow 0.3s",
                }}
            >
                {/* Gradient top strip */}
                <div className="h-[2px]" style={{ background: activeDraft.isIncluded ? activeCfg.gradient : "var(--border-color)" }} />

                {/* Header */}
                <EditorPanelHeader
                    platform={activePlatform}
                    isIncluded={activeDraft.isIncluded}
                    onToggle={() => handleToggle(activePlatform)}
                />

                {/* Body */}
                <div className="px-5 pb-6 pt-5 flex flex-col gap-5">
                    {activeDraft.isIncluded ? (
                        <>
                            <Input
                                label="Title"
                                value={activeDraft.title}
                                onChange={(e) => setPlatformDraft(activePlatform, { title: e.target.value })}
                                placeholder="Post title"
                            />

                            <Textarea
                                label="Description"
                                value={activeDraft.description}
                                onChange={(e) => setPlatformDraft(activePlatform, { description: e.target.value })}
                                rows={5}
                                showCharCount
                                maxLength={2200}
                            />

                            <div className="flex flex-col gap-2.5">
                                <span className="text-sm font-bold text-white">
                                    Hashtags
                                    <span className="ml-2 text-xs font-normal" style={{ color: "rgba(255,255,255,0.35)" }}>
                                        ({activeDraft.hashtags.length})
                                    </span>
                                </span>
                                <div className="flex flex-wrap gap-2 min-h-[32px]">
                                    {activeDraft.hashtags.map((tag) => (
                                        <Chip key={tag} label={tag} onRemove={() => removeHashtag(tag)} />
                                    ))}
                                    <AddChip onAdd={addHashtag} />
                                </div>
                            </div>

                            {/* YouTube preview */}
                            {activePlatform === "youtube" && (
                                <div
                                    className="flex flex-col gap-3 pt-4"
                                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setShowPreview((v) => !v)}
                                        className="flex items-center gap-2 text-xs font-bold w-fit transition-all hover:opacity-80"
                                        style={{ color: "rgba(167,139,250,0.7)" }}
                                    >
                                        {showPreview
                                            ? <EyeOff className="h-3.5 w-3.5" />
                                            : <Eye className="h-3.5 w-3.5" />
                                        }
                                        {showPreview ? "Hide YouTube preview" : "Show YouTube preview"}
                                    </button>

                                    {showPreview && (
                                        <div
                                            className="rounded-xl p-4 animate-fade-in"
                                            style={{
                                                background: "var(--surface-elevated)",
                                                border: "1px solid rgba(255,255,255,0.07)",
                                            }}
                                        >
                                            <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
                                                Preview
                                            </p>
                                            <YoutubePreviewCard
                                                draft={activeDraft}
                                                media={draft.mediaFile}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Instagram note */}
                            {activePlatform === "instagram" && (
                                <div
                                    className="flex items-start gap-3 p-3.5 rounded-xl text-xs"
                                    style={{
                                        background: "rgba(225,48,108,0.07)",
                                        border: "1px solid rgba(225,48,108,0.18)",
                                    }}
                                >
                                    <InstagramIcon className="h-4 w-4 shrink-0 mt-0.5 text-pink-500" />
                                    <div>
                                        <p className="font-bold text-white/80">Instagram Reels &amp; Feed</p>
                                        <p className="mt-0.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                                            Caption (max 2,200 chars) and up to 30 hashtags. Vertical 9:16 video recommended for Reels.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* LinkedIn note */}
                            {activePlatform === "linkedin" && (
                                <div
                                    className="flex items-start gap-3 p-3.5 rounded-xl text-xs"
                                    style={{
                                        background: "rgba(0,119,181,0.07)",
                                        border: "1px solid rgba(0,160,220,0.18)",
                                    }}
                                >
                                    <LinkedinIcon className="h-4 w-4 shrink-0 mt-0.5 text-blue-400" />
                                    <div>
                                        <p className="font-bold text-white/80">LinkedIn Articles &amp; Posts</p>
                                        <p className="mt-0.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                                            Keep descriptions professional. Posts with 1,200–1,500 chars perform best. Max 3 hashtags recommended.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        /* Excluded state */
                        <div className="flex flex-col items-center gap-4 py-10 text-center">
                            <div
                                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                                style={{ background: "var(--surface-elevated)", border: "1px solid rgba(255,255,255,0.08)" }}
                            >
                                {React.createElement(platformIcons[activePlatform], {
                                    className: "h-7 w-7 text-white/20",
                                })}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white/60">
                                    {platformLabel(activePlatform)} is excluded
                                </p>
                                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                                    Toggle the switch above to include this platform
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => togglePlatformIncluded(activePlatform)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.02] active:scale-95"
                                style={{
                                    background: activeCfg.gradient,
                                    boxShadow: activeCfg.glow,
                                }}
                            >
                                <Check className="h-3.5 w-3.5" />
                                Include {platformLabel(activePlatform)}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Connection Warning ────────────────────────────────────────── */}
            {unconnectedIncluded.length > 0 && (
                <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl text-xs"
                    style={{
                        background: "rgba(253,203,110,0.06)",
                        border: "1px solid rgba(253,203,110,0.2)",
                    }}
                >
                    <div className="flex items-center gap-2.5 font-medium" style={{ color: "rgba(253,203,110,0.9)" }}>
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                        <span>
                            <strong>{unconnectedIncluded.map(platformLabel).join(", ")}</strong> not connected yet — your draft is saved.
                        </span>
                    </div>
                    <a
                        href="/accounts"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white font-bold shrink-0 transition-all hover:scale-[1.02] active:scale-95 self-start sm:self-auto"
                        style={{
                            background: "linear-gradient(135deg, #6C5CE7, #a29bfe)",
                            boxShadow: "0 4px 12px rgba(108,92,231,0.4)",
                        }}
                    >
                        Connect Accounts
                        <ChevronRight className="h-3.5 w-3.5" />
                    </a>
                </div>
            )}

            {/* ── Footer navigation ─────────────────────────────────────────── */}
            <div className="flex items-center justify-between pt-2">
                <Button
                    variant="ghost"
                    size="md"
                    onClick={() => setStep("generate")}
                    className="gap-1.5 font-semibold"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>

                <div className="flex items-center gap-3">
                    {/* Mini platform icons */}
                    <div className="hidden sm:flex items-center gap-1.5">
                        {includedPlatforms.map((p) => {
                            const Icon = platformIcons[p];
                            const cfg = platformConfig[p];
                            return (
                                <div
                                    key={p}
                                    className="flex h-7 w-7 items-center justify-center rounded-full"
                                    style={{ background: cfg.gradient, boxShadow: cfg.glow }}
                                >
                                    <Icon className="h-3.5 w-3.5 text-white" />
                                </div>
                            );
                        })}
                    </div>

                    <button
                        disabled={includedCount === 0}
                        onClick={() => setStep("publish")}
                        className="flex items-center gap-2 px-5 h-11 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none"
                        style={{
                            background: includedCount > 0
                                ? "linear-gradient(135deg, #6C5CE7 0%, #A78BFA 100%)"
                                : "var(--border-color)",
                            boxShadow: includedCount > 0
                                ? "0 4px 20px rgba(108,92,231,0.5), 0 0 0 1px rgba(167,139,250,0.2)"
                                : "none",
                        }}
                    >
                        <Rocket className="h-4 w-4" />
                        Publish to {includedCount} platform{includedCount !== 1 ? "s" : ""}
                        <span aria-hidden="true">→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

