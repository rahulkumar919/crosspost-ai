"use client";

import * as React from "react";
import { Sparkles, Wand2, ArrowLeft, RotateCcw, Copy, Check, Zap, Target, Layers, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip, AddChip } from "@/components/ui/chip";
import { Skeleton, TextSkeleton } from "@/components/ui/skeleton";
import { YoutubeIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/platform-icons";
import { useDraftPostStore } from "@/store/useDraftPostStore";
import { useGenerateContent } from "@/hooks/useGenerateContent";
import { useEnhanceContent } from "@/hooks/useEnhanceContent";
import type { Platform } from "@/types/account.types";

function AILoadingCard({ label }: { label: string }) {
    return (
        <div
            className={cn(
                "flex flex-col gap-5 rounded-[var(--radius-xl)] border border-primary/30 overflow-hidden",
                "animate-fade-in bg-[var(--surface)]"
            )}
            style={{
                boxShadow: "0 0 40px rgba(108, 92, 231, 0.2)",
            }}
        >
            <div
                className="h-1 animate-gradient-shift"
                style={{
                    background: "linear-gradient(90deg, #6C5CE7, #A78BFA, #60A5FA)",
                    backgroundSize: "200% 200%",
                }}
            />

            <div className="px-6 py-6 flex flex-col gap-5">
                {/* Animated header */}
                <div className="flex items-center gap-4">
                    <div
                        className="relative flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] shrink-0"
                        style={{ background: "rgba(108,92,231,0.15)" }}
                    >
                        <Sparkles className="h-5 w-5 text-primary animate-pulse" aria-hidden="true" />
                        <div
                            className="absolute inset-0 rounded-[var(--radius-md)] animate-ping opacity-30"
                            style={{ background: "rgba(167, 139, 250, 0.3)" }}
                        />
                    </div>
                    <div>
                        <p className="text-sm font-black text-foreground">{label}</p>
                        <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                            Synthesizing developer insights across YouTube, Instagram & LinkedIn…
                        </p>
                    </div>
                </div>

                {/* Skeleton content */}
                <div className="flex flex-col gap-3">
                    <Skeleton height="h-5" width="w-2/3" />
                    <TextSkeleton lines={3} />
                    <div className="flex flex-wrap gap-2 pt-1">
                        {[60, 80, 56, 72, 64].map((w, i) => (
                            <Skeleton key={i} height="h-7" width={`w-[${w}px]`} rounded="full" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function GenerateStep() {
    const draft = useDraftPostStore((s) => s.draft);
    const setGeneratedContent = useDraftPostStore((s) => s.setGeneratedContent);
    const setPlatformDraft = useDraftPostStore((s) => s.setPlatformDraft);
    const setStep = useDraftPostStore((s) => s.setStep);

    const [activePlatform, setActivePlatform] = React.useState<Platform>("youtube");

    const [copiedTitle, setCopiedTitle] = React.useState(false);
    const [copiedDesc, setCopiedDesc] = React.useState(false);
    const [copiedTags, setCopiedTags] = React.useState(false);

    const generateMutation = useGenerateContent();
    const enhanceMutation = useEnhanceContent();

    const isWorking = generateMutation.isPending || enhanceMutation.isPending;

    const currentDraft = draft.platformDrafts[activePlatform] || {
        platform: activePlatform,
        title: draft.generatedTitle,
        description: draft.generatedDescription,
        hashtags: draft.generatedHashtags,
        isIncluded: true,
    };

    const hasGenerated = !!(
        draft.generatedTitle ||
        draft.platformDrafts.youtube.title ||
        draft.platformDrafts.instagram.title ||
        draft.platformDrafts.linkedin.title ||
        draft.generatedDescription ||
        draft.generatedHashtags.length
    );

    const handleGenerate = (extraStyleHint?: string) => {
        const rawCaptionWithHint = extraStyleHint
            ? `${draft.rawCaption ? draft.rawCaption + "\n" : ""}[Focus: ${extraStyleHint}]`
            : (draft.rawCaption || "Building an AI Full Stack Application with Next.js, LangChain, and Node.js");

        generateMutation.mutate({
            rawCaption: rawCaptionWithHint,
            mediaType: draft.mediaFile?.type ?? "video",
            platforms: ["youtube", "instagram", "linkedin"],
        });
    };

    const handleEnhance = () => {
        enhanceMutation.mutate({
            title: currentDraft.title || draft.generatedTitle,
            description: currentDraft.description || draft.generatedDescription,
            hashtags: currentDraft.hashtags.length ? currentDraft.hashtags : draft.generatedHashtags,
            platforms: ["youtube", "instagram", "linkedin"],
        });
    };

    const handleContinue = () => {
        const fallbackTitle = draft.rawCaption || draft.mediaFile?.file.name.replace(/\.[^/.]+$/, "") || "AI Full Stack Dev";
        const fallbackDesc = draft.rawCaption || "Check out this project built with modern AI and web frameworks.";
        const fallbackTags = ["webdev", "fullstack", "developer", "ai", "coding"];

        const resolvedTitle = draft.platformDrafts.youtube.title || draft.generatedTitle || fallbackTitle;
        const resolvedDesc = draft.platformDrafts.youtube.description || draft.generatedDescription || fallbackDesc;
        const resolvedTags = draft.platformDrafts.youtube.hashtags.length ? draft.platformDrafts.youtube.hashtags : (draft.generatedHashtags.length ? draft.generatedHashtags : fallbackTags);

        setGeneratedContent(resolvedTitle, resolvedDesc, resolvedTags, draft.platformDrafts, draft.analysis);
        setStep("preview");
    };

    const handleTitleChange = (val: string) => {
        setPlatformDraft(activePlatform, { title: val });
    };

    const handleDescChange = (val: string) => {
        setPlatformDraft(activePlatform, { description: val });
    };

    const addHashtag = (tag: string) => {
        const clean = tag.replace(/^#/, "").trim();
        if (clean && !currentDraft.hashtags.includes(clean)) {
            setPlatformDraft(activePlatform, { hashtags: [...currentDraft.hashtags, clean] });
        }
    };

    const removeHashtag = (tag: string) => {
        setPlatformDraft(activePlatform, {
            hashtags: currentDraft.hashtags.filter((t) => t !== tag),
        });
    };

    const copyToClipboard = (text: string, type: "title" | "desc" | "tags") => {
        navigator.clipboard.writeText(text);
        if (type === "title") {
            setCopiedTitle(true);
            setTimeout(() => setCopiedTitle(false), 2000);
        } else if (type === "desc") {
            setCopiedDesc(true);
            setTimeout(() => setCopiedDesc(false), 2000);
        } else if (type === "tags") {
            setCopiedTags(true);
            setTimeout(() => setCopiedTags(false), 2000);
        }
    };

    // Platform character rules
    const titleLength = currentDraft.title.length;
    const titleStatusColor =
        activePlatform === "youtube"
            ? titleLength > 100
                ? "text-red-500 font-bold"
                : titleLength > 80
                    ? "text-amber-500 font-semibold"
                    : "text-emerald-500 font-semibold"
            : "text-[var(--foreground-muted)]";

    const platformTabs: { id: Platform; label: string; icon: React.ComponentType<{ className?: string }>; colorClass: string; badge: string }[] = [
        { id: "youtube", label: "YouTube", icon: YoutubeIcon, colorClass: "text-[#FF0000]", badge: "SEO & High CTR" },
        { id: "instagram", label: "Instagram", icon: InstagramIcon, colorClass: "text-[#E1306C]", badge: "Visual & Reels" },
        { id: "linkedin", label: "LinkedIn", icon: LinkedinIcon, colorClass: "text-[#0077B5]", badge: "Engineering & Career" },
    ];

    return (
        <div className="flex flex-col gap-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                        AI Content Engine
                    </h2>
                    <p className="text-sm text-[var(--foreground-muted)] mt-1 leading-relaxed">
                        Generate tailored, platform-optimized developer copy for YouTube, Instagram, and LinkedIn.
                    </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-[var(--surface-elevated)] border border-primary/30 text-xs font-bold text-primary shadow-sm">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    <span>Multi-Platform Intelligence</span>
                </div>
            </div>

            {/* Quick Developer Presets */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[var(--foreground-muted)] mr-1">Developer Pillars:</span>
                {[
                    { label: "🤖 AI Full Stack", hint: "Full stack AI app with Next.js, Node.js, Express, MongoDB, and LLM APIs" },
                    { label: "🧠 RAG & LangGraph", hint: "Retrieval-Augmented Generation, vector embeddings, and LangGraph multi-agent systems" },
                    { label: "⚡ AI Agents", hint: "Autonomous tool-calling agents, execution flows, and real-world automation" },
                    { label: "🚀 Project Showcase", hint: "End-to-end production architecture breakdown and design decisions" },
                    { label: "🎓 BCA to Placement", hint: "BCA student tech roadmap, practical project building, and interview preparation" },
                    { label: "💼 Freelance Guide", hint: "Real client projects, tech consulting, and delivering production software" },
                ].map((preset) => (
                    <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleGenerate(preset.hint)}
                        disabled={isWorking}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm",
                            "bg-[var(--surface-elevated)] text-foreground border border-[var(--border-color)]",
                            "hover:border-primary/50 hover:bg-[var(--surface)] active:scale-95",
                            "disabled:opacity-40 disabled:pointer-events-none"
                        )}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            {/* Action bar */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Primary generate button */}
                <button
                    onClick={() => handleGenerate()}
                    disabled={isWorking}
                    className={cn(
                        "flex items-center gap-2 px-6 h-11 rounded-[var(--radius-md)]",
                        "text-sm font-bold text-white tracking-wide shadow-lg",
                        "transition-all duration-200 active:scale-[0.97]",
                        "disabled:opacity-50 disabled:pointer-events-none",
                        generateMutation.isPending && "opacity-80"
                    )}
                    style={{
                        background: "linear-gradient(135deg, #6C5CE7 0%, #8B5CF6 50%, #3B82F6 100%)",
                        boxShadow: "0 0 20px rgba(108, 92, 231, 0.4)",
                    }}
                >
                    {generateMutation.isPending ? (
                        <>
                            <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Analyzing & Generating…
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-4 w-4" aria-hidden="true" />
                            {hasGenerated ? "Regenerate Content" : "Generate with AI"}
                        </>
                    )}
                </button>

                {hasGenerated && (
                    <Button
                        variant="outline"
                        size="md"
                        onClick={handleEnhance}
                        isLoading={enhanceMutation.isPending}
                        loadingText="Enhancing…"
                        disabled={isWorking}
                        className="gap-2 h-11 font-bold border-primary/40 text-primary hover:bg-primary/10 bg-[var(--surface)]"
                    >
                        <Wand2 className="h-4 w-4" aria-hidden="true" />
                        Enhance Active Copy
                    </Button>
                )}

                {hasGenerated && !isWorking && (
                    <button
                        type="button"
                        onClick={() => {
                            setPlatformDraft(activePlatform, { title: "", description: "", hashtags: [] });
                        }}
                        className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground-muted)] hover:text-foreground transition-colors"
                    >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        Clear {platformTabs.find((t) => t.id === activePlatform)?.label}
                    </button>
                )}
            </div>

            {/* Error / Fallback Banner */}
            {(generateMutation.isError || enhanceMutation.error) && !isWorking && (
                <div
                    className="flex items-start gap-4 rounded-[var(--radius-xl)] border border-red-500/30 p-5 animate-fade-in bg-red-500/10"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-red-500/20 shrink-0">
                        <div className="h-3 w-3 rounded-full bg-red-500 animate-ping" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-red-500">AI Service Notice</p>
                        <p className="text-xs text-[var(--foreground-muted)] mt-1 leading-relaxed">
                            {generateMutation.error?.message || enhanceMutation.error?.message || "Using grounded fallback intelligence. You can retry or edit manually."}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGenerate()}
                                className="text-xs font-bold border-red-500/40 text-red-500 hover:bg-red-500/10"
                            >
                                Try Again
                            </Button>
                            <button
                                onClick={() => {
                                    handleTitleChange(draft.rawCaption.slice(0, 80) || "Building AI Full Stack Applications");
                                    handleDescChange(draft.rawCaption || "Step-by-step breakdown of building real-world AI applications with modern web technologies.");
                                    setPlatformDraft(activePlatform, { hashtags: ["webdev", "fullstack", "javascript", "ai", "coding"] });
                                }}
                                className="text-xs font-semibold text-[var(--foreground-muted)] hover:text-foreground transition-colors"
                            >
                                Fill Template →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Area */}
            {isWorking ? (
                <AILoadingCard
                    label={generateMutation.isPending ? "Generating platform-tailored developer content…" : "Refining post for maximum engagement…"}
                />
            ) : !hasGenerated ? (
                /* Empty state */
                <div
                    className={cn(
                        "flex flex-col items-center gap-5 rounded-[var(--radius-xl)]",
                        "border border-dashed border-[var(--border-color)] py-14 px-6 text-center",
                        "bg-[var(--surface)] hover:border-primary/40 transition-colors shadow-sm"
                    )}
                >
                    <div
                        className="flex h-16 w-16 items-center justify-center rounded-2xl animate-float bg-primary/10 border border-primary/20 text-primary"
                    >
                        <Sparkles className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <div className="max-w-md">
                        <p className="text-lg font-black text-foreground">Ready to generate multi-platform content?</p>
                        <p className="text-sm text-[var(--foreground-muted)] mt-1.5 leading-relaxed">
                            Click <strong className="text-foreground">Generate with AI</strong> or select a developer pillar to craft SEO titles, descriptions, and hashtags for YouTube, Instagram, and LinkedIn simultaneously.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                        <button
                            onClick={() => handleGenerate()}
                            className={cn(
                                "flex items-center gap-2 px-6 h-11 rounded-[var(--radius-md)]",
                                "text-sm font-bold text-white shadow-md",
                                "transition-all duration-200 active:scale-[0.97]"
                            )}
                            style={{
                                background: "linear-gradient(135deg, #6C5CE7 0%, #8B5CF6 100%)",
                            }}
                        >
                            <Sparkles className="h-4 w-4" />
                            Generate with AI
                        </button>
                        <button
                            type="button"
                            className="h-11 px-5 rounded-[var(--radius-md)] font-bold text-sm text-foreground border border-[var(--border-color)] bg-[var(--surface-elevated)] hover:bg-[var(--surface)] transition-colors"
                            onClick={() => {
                                handleTitleChange(draft.rawCaption.slice(0, 80) || "AI Full Stack Project Architecture");
                                handleDescChange(draft.rawCaption || "Sharing architecture lessons from building production AI web applications.");
                                setPlatformDraft(activePlatform, { hashtags: ["webdev", "fullstack", "coding", "softwareengineer"] });
                            }}
                        >
                            Write Manually
                        </button>
                    </div>
                </div>
            ) : (
                /* Generated Content Editor */
                <div
                    className={cn(
                        "flex flex-col gap-6 rounded-[var(--radius-xl)] border border-[var(--border-color)] bg-[var(--surface)] overflow-hidden",
                        "shadow-lg animate-scale-in"
                    )}
                >
                    {/* Gradient top highlight */}
                    <div
                        className="h-[3px] w-full"
                        style={{ background: "linear-gradient(90deg, #6C5CE7, #A78BFA, #60A5FA)" }}
                    />

                    <div className="px-6 pb-6 flex flex-col gap-6">
                        {/* Strategy & Content Pillar Banner */}
                        {draft.analysis && (
                            <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] border border-primary/20 flex flex-col gap-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <Layers className="h-4 w-4 text-primary" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground-muted)]">Content Pillar:</span>
                                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                                            {draft.analysis.pillar}
                                        </span>
                                    </div>
                                    {draft.analysis.targetAudience && (
                                        <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
                                            <Target className="h-3.5 w-3.5 text-primary" />
                                            <span><strong className="text-foreground">Audience:</strong> {draft.analysis.targetAudience}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                    <span className="font-semibold text-[var(--foreground-muted)]">Keywords:</span>
                                    {draft.analysis.primaryKeyword && (
                                        <span className="px-2 py-0.5 rounded bg-[var(--surface)] text-foreground border border-primary/30 font-semibold">
                                            #{draft.analysis.primaryKeyword}
                                        </span>
                                    )}
                                    {draft.analysis.secondaryKeywords?.slice(0, 5).map((kw) => (
                                        <span key={kw} className="px-2 py-0.5 rounded bg-[var(--surface)] text-[var(--foreground-muted)] border border-[var(--border-color)] font-normal">
                                            #{kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Platform Selector Tabs */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider">
                                    Platform Drafts (Tailored Copy)
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const fullPost = `${currentDraft.title}\n\n${currentDraft.description}\n\n${currentDraft.hashtags.map((h) => `#${h}`).join(" ")}`;
                                        copyToClipboard(fullPost, "tags");
                                    }}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground-muted)] hover:text-foreground transition-colors"
                                >
                                    <Copy className="h-3.5 w-3.5" />
                                    <span>Copy Active Post</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-2 p-1 rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] border border-[var(--border-color)]">
                                {platformTabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isSelected = activePlatform === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActivePlatform(tab.id)}
                                            className={cn(
                                                "flex items-center justify-center gap-2 py-2.5 px-3 rounded-[var(--radius-md)] text-xs font-bold transition-all",
                                                isSelected
                                                    ? "bg-[var(--surface)] text-foreground shadow-sm border border-[var(--border-color)]"
                                                    : "text-[var(--foreground-muted)] hover:text-foreground hover:bg-[var(--surface)]/50"
                                            )}
                                        >
                                            <Icon className={cn("h-4 w-4 shrink-0", tab.colorClass)} />
                                            <span className="hidden sm:inline">{tab.label}</span>
                                            <span className="text-[10px] hidden md:inline font-normal text-[var(--foreground-muted)]">
                                                ({tab.badge})
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Title field */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                                    <span>{activePlatform === "youtube" ? "YouTube SEO Video Title" : `${platformTabs.find(p => p.id === activePlatform)?.label} Headline / Title`}</span>
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--foreground-muted)] border border-[var(--border-color)]">
                                        {activePlatform === "youtube" ? "Target ≤80 chars (Hard max 100)" : "Platform Specific"}
                                    </span>
                                </label>
                                <div className="flex items-center gap-3">
                                    {activePlatform === "youtube" && (
                                        <span className={cn("text-xs tabular-nums", titleStatusColor)}>
                                            {titleLength} / 100 chars
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(currentDraft.title, "title")}
                                        className="text-xs text-[var(--foreground-muted)] hover:text-foreground flex items-center gap-1"
                                    >
                                        {copiedTitle ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                        <span>{copiedTitle ? "Copied" : "Copy"}</span>
                                    </button>
                                </div>
                            </div>
                            <input
                                type="text"
                                value={currentDraft.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder={`Enter ${platformTabs.find(p => p.id === activePlatform)?.label} title or hook…`}
                                className={cn(
                                    "h-11 w-full rounded-[var(--radius-md)] px-3.5 text-sm font-medium",
                                    "bg-[var(--surface-elevated)] text-foreground border border-[var(--border-color)] placeholder:text-[var(--foreground-muted)]",
                                    "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                                    "transition-all"
                                )}
                            />
                        </div>

                        {/* Description field */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                                    <span>
                                        {activePlatform === "youtube"
                                            ? "YouTube Description & Timestamps"
                                            : activePlatform === "instagram"
                                                ? "Instagram Caption (Hook + Value + CTA)"
                                                : "LinkedIn Article Post (Insights & Technical Lessons)"}
                                    </span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-semibold text-[var(--foreground-muted)] tabular-nums">
                                        {currentDraft.description.length} chars
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(currentDraft.description, "desc")}
                                        className="text-xs text-[var(--foreground-muted)] hover:text-foreground flex items-center gap-1"
                                    >
                                        {copiedDesc ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                        <span>{copiedDesc ? "Copied" : "Copy"}</span>
                                    </button>
                                </div>
                            </div>
                            <textarea
                                rows={7}
                                value={currentDraft.description}
                                onChange={(e) => handleDescChange(e.target.value)}
                                placeholder="Write clear, engaging developer insights, actionable steps, and call-to-action…"
                                className={cn(
                                    "w-full rounded-[var(--radius-md)] p-3.5 text-sm leading-relaxed",
                                    "bg-[var(--surface-elevated)] text-foreground border border-[var(--border-color)] placeholder:text-[var(--foreground-muted)]",
                                    "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                                    "transition-all resize-y"
                                )}
                            />
                        </div>

                        {/* Hashtags container */}
                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-foreground flex items-center gap-2">
                                    <span>Platform Hashtags</span>
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-elevated)] text-primary border border-primary/20">
                                        {currentDraft.hashtags.length} tags
                                    </span>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const tagsString = currentDraft.hashtags.map((h) => `#${h}`).join(" ");
                                        copyToClipboard(tagsString, "tags");
                                    }}
                                    className="text-xs text-[var(--foreground-muted)] hover:text-foreground flex items-center gap-1 font-semibold"
                                >
                                    {copiedTags ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                    <span>{copiedTags ? "Copied All" : "Copy All (#tags)"}</span>
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2 p-3 rounded-[var(--radius-md)] bg-[var(--surface-elevated)] border border-[var(--border-color)] min-h-[48px]">
                                {currentDraft.hashtags.map((tag) => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onRemove={() => removeHashtag(tag)}
                                        className="bg-[var(--surface)] border-[var(--border-color)] text-foreground hover:border-primary/50"
                                    />
                                ))}
                                <AddChip onAdd={addHashtag} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-2">
                <Button
                    variant="ghost"
                    size="md"
                    onClick={() => setStep("upload")}
                    className="gap-1.5 text-[var(--foreground-muted)] hover:text-foreground font-semibold hover:bg-[var(--surface-elevated)]"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back
                </Button>

                <button
                    disabled={!hasGenerated || isWorking}
                    onClick={handleContinue}
                    className={cn(
                        "flex items-center gap-2 px-7 h-11 rounded-[var(--radius-md)]",
                        "text-sm font-bold text-white tracking-wide shadow-lg",
                        "transition-all duration-200 active:scale-[0.97]",
                        "disabled:opacity-40 disabled:pointer-events-none"
                    )}
                    style={{
                        background: "linear-gradient(135deg, #6C5CE7 0%, #8B5CF6 100%)",
                        boxShadow: hasGenerated && !isWorking ? "0 0 24px rgba(108, 92, 231, 0.45)" : "none",
                    }}
                >
                    Continue to Preview
                    <span aria-hidden="true">→</span>
                </button>
            </div>
        </div>
    );
}
