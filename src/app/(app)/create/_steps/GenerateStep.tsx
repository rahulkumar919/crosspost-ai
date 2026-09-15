"use client";

import * as React from "react";
import { Sparkles, Wand2, ArrowLeft, RotateCcw, Copy, Check, Hash, Zap, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip, AddChip } from "@/components/ui/chip";
import { Skeleton, TextSkeleton } from "@/components/ui/skeleton";
import { useDraftPostStore } from "@/store/useDraftPostStore";
import { useGenerateContent } from "@/hooks/useGenerateContent";
import { useEnhanceContent } from "@/hooks/useEnhanceContent";

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
                        <p className="text-xs text-[var(--foreground-muted)] mt-0.5">Crafting viral hooks & YouTube SEO ranking…</p>
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
    const setStep = useDraftPostStore((s) => s.setStep);

    const [localTitle, setLocalTitle] = React.useState(draft.generatedTitle || draft.platformDrafts.youtube.title);
    const [localDesc, setLocalDesc] = React.useState(draft.generatedDescription || draft.platformDrafts.youtube.description);
    const [localHashtags, setLocalHashtags] = React.useState<string[]>(
        draft.generatedHashtags.length ? draft.generatedHashtags : draft.platformDrafts.youtube.hashtags
    );

    const [copiedTitle, setCopiedTitle] = React.useState(false);
    const [copiedDesc, setCopiedDesc] = React.useState(false);
    const [copiedTags, setCopiedTags] = React.useState(false);

    const generateMutation = useGenerateContent();
    const enhanceMutation = useEnhanceContent();

    const isWorking = generateMutation.isPending || enhanceMutation.isPending;
    const hasGenerated = !!(localTitle || localDesc || localHashtags.length);

    // Sync local state after mutation success
    React.useEffect(() => {
        if (generateMutation.isSuccess || enhanceMutation.isSuccess) {
            const d = useDraftPostStore.getState().draft;
            setLocalTitle(d.generatedTitle);
            setLocalDesc(d.generatedDescription);
            setLocalHashtags(d.generatedHashtags);
        }
    }, [generateMutation.isSuccess, enhanceMutation.isSuccess]);

    const handleGenerate = (extraStyleHint?: string) => {
        const rawCaptionWithHint = extraStyleHint
            ? `${draft.rawCaption || "Viral video"}\n[Viral Style Formula: ${extraStyleHint}]`
            : draft.rawCaption;

        generateMutation.mutate({
            rawCaption: rawCaptionWithHint,
            mediaType: draft.mediaFile?.type ?? "video",
            platforms: ["youtube", "instagram", "linkedin"],
        });
    };

    const handleEnhance = () => {
        enhanceMutation.mutate({
            title: localTitle,
            description: localDesc,
            hashtags: localHashtags,
            platforms: ["youtube", "instagram", "linkedin"],
        });
    };

    const handleContinue = () => {
        const fallbackTitle = draft.rawCaption || draft.mediaFile?.file.name.replace(/\.[^/.]+$/, "") || "Trending Video 🔥";
        const fallbackDesc = draft.rawCaption || "Check out this video! Published via CrossPost AI.";
        const fallbackTags = ["viral", "trending", "crosspost", "shorts", "reels"];

        const resolvedTitle = (localTitle && localTitle.trim()) || fallbackTitle;
        const resolvedDesc = (localDesc && localDesc.trim()) || fallbackDesc;
        const resolvedTags = localHashtags.length ? localHashtags : fallbackTags;

        setGeneratedContent(resolvedTitle, resolvedDesc, resolvedTags);
        setStep("preview");
    };

    const addHashtag = (tag: string) => {
        const clean = tag.replace(/^#/, "").trim();
        if (clean && !localHashtags.includes(clean)) {
            setLocalHashtags((prev) => [...prev, clean]);
        }
    };

    const removeHashtag = (tag: string) => {
        setLocalHashtags((prev) => prev.filter((t) => t !== tag));
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

    const titleLength = localTitle.length;
    const titleStatusColor =
        titleLength > 100
            ? "text-red-400"
            : titleLength > 80
                ? "text-amber-400"
                : "text-emerald-400";

    return (
        <div className="flex flex-col gap-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: "var(--foreground-color)" }}>
                        Generate Content
                    </h2>
                    <p className="text-sm text-[var(--foreground-muted)] mt-1 leading-relaxed">
                        AI crafts high-CTR viral titles, SEO descriptions, and trending hashtags.
                    </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-[var(--surface-elevated)] border border-primary/30 text-xs font-bold text-primary">
                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                    <span>Gemini & Mistral AI</span>
                </div>
            </div>

            {/* Quick Viral Style Presets */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-[var(--foreground-muted)] mr-1">Viral Preset:</span>
                {[
                    { label: "🔥 Curiosity Gap", hint: "Curiosity gap that forces viewers to click" },
                    { label: "📈 YouTube SEO", hint: "High-volume search keyword rankings and long-tail SEO" },
                    { label: "⚡ Shorts & Reels Hook", hint: "Instant 3-second hook for short-form video retention" },
                    { label: "💡 How-To Guide", hint: "Actionable step-by-step masterclass framework" },
                ].map((preset) => (
                    <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleGenerate(preset.hint)}
                        disabled={isWorking}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                            "bg-[var(--surface)] text-foreground border border-[var(--border-color)]",
                            "hover:border-[#A78BFA]/50 hover:bg-[var(--surface-elevated)] active:scale-95",
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
                        "text-sm font-bold text-foreground tracking-wide shadow-lg",
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
                            Crafting Viral Content…
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-4 w-4" aria-hidden="true" />
                            {hasGenerated ? "Regenerate Viral Content" : "Generate with AI"}
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
                        className="gap-2 h-11 font-bold border-primary/40 text-primary hover:bg-[#A78BFA]/10 bg-[var(--surface)]"
                    >
                        <Wand2 className="h-4 w-4" aria-hidden="true" />
                        Enhance Virality
                    </Button>
                )}

                {hasGenerated && !isWorking && (
                    <button
                        type="button"
                        onClick={() => {
                            setLocalTitle("");
                            setLocalDesc("");
                            setLocalHashtags([]);
                        }}
                        className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground-muted)] hover:text-foreground transition-colors"
                    >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        Clear
                    </button>
                )}
            </div>

            {/* Error / Fallback Banner */}
            {(generateMutation.isError || enhanceMutation.error) && !isWorking && (
                <div
                    className="flex items-start gap-4 rounded-[var(--radius-xl)] border border-red-500/30 p-5 animate-fade-in"
                    style={{ background: "rgba(220, 38, 38, 0.08)" }}
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-red-500/20 shrink-0">
                        <div className="h-3 w-3 rounded-full bg-red-400 animate-ping" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-red-300">AI Service Notice</p>
                        <p className="text-xs text-red-200/80 mt-1 leading-relaxed">
                            {generateMutation.error?.message || enhanceMutation.error?.message || "Using instant viral engine. You can retry or write manually."}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGenerate()}
                                className="text-xs font-bold border-red-500/40 text-red-200 hover:bg-red-500/10"
                            >
                                Try Again
                            </Button>
                            <button
                                onClick={() => {
                                    setLocalTitle((draft.rawCaption.slice(0, 80) || "Viral Breakthrough 🔥"));
                                    setLocalDesc(draft.rawCaption || "Check out this video! Packed with immense value.");
                                    setLocalHashtags(["viral", "trending", "shorts", "reels", "crosspost"]);
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
                    label={generateMutation.isPending ? "Generating high-CTR viral content…" : "Supercharging post for maximum virality…"}
                />
            ) : !hasGenerated ? (
                /* Empty state */
                <div
                    className={cn(
                        "flex flex-col items-center gap-5 rounded-[var(--radius-xl)]",
                        "border border-dashed border-[var(--border-color)] py-14 px-6 text-center",
                        "bg-[var(--surface)] hover:border-primary/40 transition-colors"
                    )}
                >
                    <div
                        className="flex h-16 w-16 items-center justify-center rounded-2xl animate-float"
                        style={{
                            background: "radial-gradient(circle, rgba(167, 139, 250, 0.25) 0%, rgba(108, 92, 231, 0.05) 100%)",
                            border: "1px solid rgba(167, 139, 250, 0.3)",
                        }}
                    >
                        <Sparkles className="h-8 w-8 text-primary" aria-hidden="true" />
                    </div>
                    <div className="max-w-md">
                        <p className="text-lg font-black text-foreground">Ready to make your content go viral?</p>
                        <p className="text-sm text-[var(--foreground-muted)] mt-1.5 leading-relaxed">
                            Click <strong className="text-foreground">Generate with AI</strong> to produce YouTube SEO titles, hook descriptions, and 20 viral hashtags.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                        <button
                            onClick={() => handleGenerate()}
                            className={cn(
                                "flex items-center gap-2 px-6 h-11 rounded-[var(--radius-md)]",
                                "text-sm font-bold text-foreground",
                                "transition-all duration-200 active:scale-[0.97]"
                            )}
                            style={{
                                background: "linear-gradient(135deg, #6C5CE7 0%, #8B5CF6 100%)",
                                boxShadow: "0 0 20px rgba(108, 92, 231, 0.4)",
                            }}
                        >
                            <Sparkles className="h-4 w-4" />
                            Generate with AI
                        </button>
                        <button
                            type="button"
                            className="h-11 px-5 rounded-[var(--radius-md)] font-bold text-sm text-foreground border border-[var(--border-color)] bg-[var(--surface-elevated)] hover:bg-[var(--border-color)] transition-colors"
                            onClick={() => {
                                setLocalTitle(draft.rawCaption.slice(0, 80) || "High-Impact Video 🔥");
                                setLocalDesc(draft.rawCaption || "Check out this video! Packed with insights.");
                                setLocalHashtags(["viral", "trending", "shorts", "reels", "crosspost"]);
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
                        "shadow-xl animate-scale-in"
                    )}
                >
                    {/* Gradient top highlight */}
                    <div
                        className="h-[3px] w-full"
                        style={{ background: "linear-gradient(90deg, #6C5CE7, #A78BFA, #60A5FA)" }}
                    />

                    <div className="px-6 pb-6 flex flex-col gap-6">
                        {/* Success / virality badge */}
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div
                                className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                                style={{
                                    background: "rgba(167, 139, 250, 0.12)",
                                    border: "1px solid rgba(167, 139, 250, 0.25)",
                                }}
                            >
                                <Sparkles className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                                <p className="text-xs font-bold text-primary">
                                    Viral SEO Generated — Edit Freely
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    const fullPost = `${localTitle}\n\n${localDesc}\n\n${localHashtags.map((h) => `#${h}`).join(" ")}`;
                                    copyToClipboard(fullPost, "tags");
                                }}
                                className="flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground-muted)] hover:text-foreground transition-colors"
                            >
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy Full Post</span>
                            </button>
                        </div>

                        {/* Title field */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                                    <span>Viral Video Title</span>
                                    <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--foreground-muted)] border border-[var(--border-color)]">
                                        YouTube & Cross-Platform
                                    </span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <span className={cn("text-xs font-bold tabular-nums", titleStatusColor)}>
                                        {titleLength} / 100 chars (target ≤80)
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(localTitle, "title")}
                                        className="text-xs text-[var(--foreground-muted)] hover:text-foreground flex items-center gap-1"
                                    >
                                        {copiedTitle ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                                        <span>{copiedTitle ? "Copied" : "Copy"}</span>
                                    </button>
                                </div>
                            </div>
                            <input
                                type="text"
                                value={localTitle}
                                onChange={(e) => setLocalTitle(e.target.value)}
                                placeholder="Your high-CTR viral title…"
                                className={cn(
                                    "h-11 w-full rounded-[var(--radius-md)] px-3.5 text-sm font-medium",
                                    "bg-[#07070F] text-foreground border border-[var(--border-color)] placeholder:text-[#5A5580]",
                                    "focus:outline-none focus:border-[#A78BFA] focus:ring-2 focus:ring-[#A78BFA]/30",
                                    "transition-all"
                                )}
                            />
                        </div>

                        {/* Description field */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                                    <span>SEO Description & Retention Hook</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-semibold text-[var(--foreground-muted)] tabular-nums">
                                        {localDesc.length} chars
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(localDesc, "desc")}
                                        className="text-xs text-[var(--foreground-muted)] hover:text-foreground flex items-center gap-1"
                                    >
                                        {copiedDesc ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                                        <span>{copiedDesc ? "Copied" : "Copy"}</span>
                                    </button>
                                </div>
                            </div>
                            <textarea
                                rows={7}
                                value={localDesc}
                                onChange={(e) => setLocalDesc(e.target.value)}
                                placeholder="Punchy hook, key insights, and call-to-action…"
                                className={cn(
                                    "w-full rounded-[var(--radius-md)] p-3.5 text-sm leading-relaxed",
                                    "bg-[#07070F] text-foreground border border-[var(--border-color)] placeholder:text-[#5A5580]",
                                    "focus:outline-none focus:border-[#A78BFA] focus:ring-2 focus:ring-[#A78BFA]/30",
                                    "transition-all resize-y"
                                )}
                            />
                        </div>

                        {/* Hashtags container */}
                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-foreground flex items-center gap-2">
                                    <span>20 Tiered Viral Hashtags</span>
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-elevated)] text-primary border border-[#A78BFA]/20">
                                        {localHashtags.length} tags
                                    </span>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const tagsString = localHashtags.map((h) => `#${h}`).join(" ");
                                        copyToClipboard(tagsString, "tags");
                                    }}
                                    className="text-xs text-[var(--foreground-muted)] hover:text-foreground flex items-center gap-1 font-semibold"
                                >
                                    {copiedTags ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                                    <span>{copiedTags ? "Copied All" : "Copy All (#tags)"}</span>
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2 p-3 rounded-[var(--radius-md)] bg-[#07070F] border border-[var(--border-color)] min-h-[48px]">
                                {localHashtags.map((tag) => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onRemove={() => removeHashtag(tag)}
                                        className="bg-[var(--surface-elevated)] border-[var(--border-color)] text-foreground hover:border-[#A78BFA]/50"
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
                        "text-sm font-bold text-foreground tracking-wide shadow-lg",
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


