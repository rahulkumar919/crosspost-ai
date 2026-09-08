"use client";

import * as React from "react";
import { ArrowLeft, Eye, EyeOff, Check, Rocket, AlertTriangle } from "lucide-react";
import { cn, platformLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea, Input } from "@/components/ui/input";
import { Chip, AddChip } from "@/components/ui/chip";
import { YoutubePreviewCard } from "@/components/platform/YoutubePreviewCard";
import { YoutubeIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/platform-icons";
import { useDraftPostStore } from "@/store/useDraftPostStore";
import { useConnectedAccounts } from "@/hooks/useConnectedAccounts";
import type { Platform } from "@/types/account.types";

const platformIcons: Record<Platform, React.ComponentType<{ className?: string }>> = {
    youtube: YoutubeIcon,
    instagram: InstagramIcon,
    linkedin: LinkedinIcon,
};

// Platform-specific brand config
const platformConfig: Record<Platform, {
    gradient: string;
    glow: string;
    bg: string;
    text: string;
    border: string;
    checkBg: string;
}> = {
    youtube: {
        gradient: "linear-gradient(135deg, #ff0000, #ff4757)",
        glow: "0 0 24px rgba(255, 0, 0, 0.25)",
        bg: "rgba(255, 0, 0, 0.07)",
        text: "text-youtube",
        border: "rgba(255, 0, 0, 0.3)",
        checkBg: "rgba(255, 0, 0, 0.1)",
    },
    instagram: {
        gradient: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
        glow: "0 0 24px rgba(225, 48, 108, 0.25)",
        bg: "rgba(225, 48, 108, 0.07)",
        text: "text-instagram",
        border: "rgba(225, 48, 108, 0.3)",
        checkBg: "rgba(225, 48, 108, 0.1)",
    },
    linkedin: {
        gradient: "linear-gradient(135deg, #0077b5, #00a0dc)",
        glow: "0 0 24px rgba(0, 119, 181, 0.25)",
        bg: "rgba(0, 119, 181, 0.07)",
        text: "text-linkedin",
        border: "rgba(0, 119, 181, 0.3)",
        checkBg: "rgba(0, 119, 181, 0.1)",
    },
};

const PLATFORMS: Platform[] = ["youtube", "instagram", "linkedin"];

// ─── Platform Selection Card ──────────────────────────────────────────────────

function PlatformSelectionCard({
    platform,
    isSelected,
    isActive,
    isConnected,
    onToggle,
    onActivate,
}: {
    platform: Platform;
    isSelected: boolean;
    isActive: boolean;
    isConnected: boolean;
    onToggle: () => void;
    onActivate: () => void;
}) {
    const Icon = platformIcons[platform];
    const cfg = platformConfig[platform];

    return (
        <div
            className={cn(
                "relative flex flex-col items-center gap-2 rounded-[var(--radius-xl)] p-4 pb-3",
                "border-2 transition-all duration-250 cursor-pointer select-none",
                "focus-visible:outline-2 focus-visible:outline-primary",
                !isSelected && "opacity-50"
            )}
            style={{
                borderColor: isActive && isSelected
                    ? cfg.border
                    : isSelected
                        ? "rgba(108,92,231,0.3)"
                        : "var(--border-color)",
                background: isSelected ? cfg.bg : "transparent",
                boxShadow: isActive && isSelected ? cfg.glow : "none",
            }}
            onClick={onActivate}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onActivate()}
            aria-pressed={isActive}
        >
            {/* Platform icon with gradient bg */}
            <div
                className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] transition-all duration-200"
                style={{
                    background: isSelected ? cfg.gradient : "var(--surface-elevated)",
                    boxShadow: isSelected ? cfg.glow : "none",
                }}
            >
                <Icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>

            {/* Label */}
            <span className={cn(
                "text-xs font-black tracking-wide",
                isSelected ? "text-foreground" : "text-foreground-muted"
            )}>
                {platformLabel(platform)}
            </span>

            {/* Connection badge */}
            {isConnected ? (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Connected
                </span>
            ) : (
                <a
                    href="/accounts"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10px] font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded-full transition-colors"
                >
                    Connect +
                </a>
            )}

            {/* Include/Exclude toggle — top-right corner */}
            <button
                type="button"
                aria-label={`${isSelected ? "Remove" : "Add"} ${platformLabel(platform)}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                }}
                className={cn(
                    "absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full",
                    "border-2 transition-all duration-200 z-10",
                    "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                )}
                style={{
                    borderColor: isSelected ? cfg.border : "var(--border-color)",
                    background: isSelected ? cfg.gradient : "transparent",
                }}
            >
                {isSelected && (
                    <Check className="h-3.5 w-3.5 text-white stroke-[3] animate-check-in" aria-hidden="true" />
                )}
            </button>

            {/* Active indicator dot */}
            {isActive && isSelected && (
                <div
                    className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-6 rounded-full"
                    style={{ background: cfg.gradient }}
                />
            )}
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

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
        // If we're deselecting the active platform, switch to an included one
        if (platform === activePlatform) {
            const next = PLATFORMS.find((p) => p !== platform && draft.platformDrafts[p].isIncluded);
            if (next) setActivePlatform(next);
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-fade-in-up">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-black text-foreground tracking-tight">
                    Preview & publish
                </h2>
                <p className="text-sm text-foreground-muted mt-2 leading-relaxed">
                    Choose your platforms, then fine-tune your post for each one.
                </p>
            </div>

            {/* ── Platform Selection Cards ───────────────────────────────────── */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-black text-foreground-muted uppercase tracking-widest">
                        Publishing to
                    </p>
                    <p className="text-xs font-semibold text-foreground-muted">
                        Click a platform to edit · toggle ✓ to include/exclude
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-3" role="group" aria-label="Select platforms to publish to">
                    {PLATFORMS.map((platform) => (
                        <PlatformSelectionCard
                            key={platform}
                            platform={platform}
                            isSelected={draft.platformDrafts[platform].isIncluded}
                            isActive={activePlatform === platform}
                            isConnected={accounts.some((a) => a.platform === platform && a.isActive)}
                            onToggle={() => handleToggle(platform)}
                            onActivate={() => {
                                setActivePlatform(platform);
                                // Re-include if excluded when clicking card body
                                if (!draft.platformDrafts[platform].isIncluded) {
                                    togglePlatformIncluded(platform);
                                }
                            }}
                        />
                    ))}
                </div>

                {/* Selection summary */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                    {includedCount === 0 ? (
                        <p className="text-xs font-semibold text-error">No platforms selected — select at least one</p>
                    ) : (
                        <>
                            <p className="text-xs text-foreground-muted">Posting to:</p>
                            {includedPlatforms.map((p) => {
                                const Icon = platformIcons[p];
                                const cfg = platformConfig[p];
                                return (
                                    <div
                                        key={p}
                                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[11px] font-bold"
                                        style={{ background: cfg.gradient }}
                                    >
                                        <Icon className="h-3 w-3" />
                                        {platformLabel(p)}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            </div>

            {/* ── Editor Panel ───────────────────────────────────────────────── */}
            <div
                className={cn(
                    "flex flex-col gap-5 rounded-[var(--radius-xl)] border bg-surface overflow-hidden",
                    "shadow-sm animate-scale-in"
                )}
                style={{ borderColor: "var(--border-color)" }}
                id={`panel-${activePlatform}`}
                role="tabpanel"
            >
                {/* Platform-colored header strip */}
                <div className="h-[3px]" style={{ background: activeCfg.gradient }} />

                <div className="px-6 pb-6 flex flex-col gap-5">
                    {/* Editor header with platform badge */}
                    <div className="flex items-center gap-3 pb-3 border-b border-border">
                        <div
                            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] shrink-0"
                            style={{ background: activeCfg.gradient, boxShadow: activeCfg.glow }}
                        >
                            {React.createElement(platformIcons[activePlatform], { className: "h-4 w-4 text-white" })}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-black text-foreground">
                                {platformLabel(activePlatform)}
                            </p>
                            <p className="text-xs text-foreground-muted mt-0.5">
                                {activeDraft.isIncluded ? "Editing content for this platform" : "Not included in this post"}
                            </p>
                        </div>
                        {/* Platform include toggle */}
                        <button
                            type="button"
                            role="switch"
                            aria-checked={activeDraft.isIncluded}
                            aria-label={`${activeDraft.isIncluded ? "Exclude" : "Include"} ${platformLabel(activePlatform)}`}
                            onClick={() => handleToggle(activePlatform)}
                            className={cn(
                                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full",
                                "border-2 border-transparent transition-all duration-300 ease-in-out",
                                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            )}
                            style={{
                                background: activeDraft.isIncluded ? activeCfg.gradient : "var(--border-color)",
                                boxShadow: activeDraft.isIncluded ? activeCfg.glow : "none",
                            }}
                        >
                            <span
                                aria-hidden="true"
                                className={cn(
                                    "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm",
                                    "transition-transform duration-300 ease-in-out",
                                    activeDraft.isIncluded ? "translate-x-5" : "translate-x-0"
                                )}
                            />
                        </button>
                    </div>

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
                                <span className="text-sm font-bold text-foreground">
                                    Hashtags
                                    <span className="ml-2 text-xs font-normal text-foreground-muted">
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
                                <div className="flex flex-col gap-3 pt-1 border-t border-border">
                                    <button
                                        type="button"
                                        onClick={() => setShowPreview((v) => !v)}
                                        className={cn(
                                            "flex items-center gap-1.5 text-xs font-bold",
                                            "text-foreground-muted hover:text-foreground transition-colors",
                                            "w-fit"
                                        )}
                                    >
                                        {showPreview ? (
                                            <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                                        ) : (
                                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                                        )}
                                        {showPreview ? "Hide YouTube preview" : "Show YouTube preview"}
                                    </button>

                                    {showPreview && (
                                        <div className="rounded-[var(--radius-lg)] border border-border bg-background p-4 animate-fade-in">
                                            <p className="text-[11px] font-black text-foreground-muted mb-3 uppercase tracking-widest">
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
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-4 py-10 text-center">
                            <div
                                className="flex h-12 w-12 items-center justify-center rounded-full"
                                style={{ background: "var(--surface-elevated)" }}
                            >
                                {React.createElement(platformIcons[activePlatform], {
                                    className: "h-6 w-6 text-foreground-muted/50"
                                })}
                            </div>
                            <p className="text-sm text-foreground-muted">
                                {platformLabel(activePlatform)} is excluded from this post.
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => togglePlatformIncluded(activePlatform)}
                                className="font-bold"
                            >
                                Include {platformLabel(activePlatform)}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Connection Warning Banner */}
            {unconnectedIncluded.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs">
                    <div className="flex items-center gap-2.5 text-amber-900 font-medium">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                        <span>
                            <strong>{unconnectedIncluded.map(platformLabel).join(", ")}</strong> is not connected yet. Your draft is saved, so you can connect your account now.
                        </span>
                    </div>
                    <a
                        href="/accounts"
                        className="inline-flex items-center justify-center gap-1 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shrink-0 transition-all shadow-sm self-start sm:self-auto"
                    >
                        <span>Connect Accounts</span>
                        <span aria-hidden="true">→</span>
                    </a>
                </div>
            )}

            {/* Footer nav */}
            <div className="flex items-center justify-between pt-2">
                <Button
                    variant="ghost"
                    size="md"
                    onClick={() => setStep("generate")}
                    className="gap-1.5 text-foreground-muted hover:text-foreground font-semibold"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back
                </Button>

                <div className="flex items-center gap-3">
                    {/* Selected platform mini-icons */}
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
                        className={cn(
                            "flex items-center gap-2 px-6 h-11 rounded-[var(--radius-md)]",
                            "text-sm font-bold text-white tracking-wide",
                            "transition-all duration-200 active:scale-[0.97]",
                            "disabled:opacity-40 disabled:pointer-events-none"
                        )}
                        style={{
                            background: includedCount > 0 ? "var(--gradient-primary)" : "var(--muted)",
                            boxShadow: includedCount > 0 ? "var(--shadow-primary)" : "none",
                        }}
                    >
                        <Rocket className="h-4 w-4" aria-hidden="true" />
                        Publish to {includedCount} platform{includedCount !== 1 ? "s" : ""}
                        <span aria-hidden="true">→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
