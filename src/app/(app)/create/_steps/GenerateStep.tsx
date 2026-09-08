"use client";

import * as React from "react";
import { Sparkles, Wand2, ArrowLeft, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea, Input } from "@/components/ui/input";
import { Chip, AddChip } from "@/components/ui/chip";
import { Skeleton, TextSkeleton } from "@/components/ui/skeleton";
import { useDraftPostStore } from "@/store/useDraftPostStore";
import { useGenerateContent } from "@/hooks/useGenerateContent";
import { useEnhanceContent } from "@/hooks/useEnhanceContent";

function AILoadingCard({ label }: { label: string }) {
    return (
        <div className={cn(
            "flex flex-col gap-5 rounded-[var(--radius-xl)] border border-primary/20 overflow-hidden",
            "animate-fade-in"
        )}
            style={{ background: "var(--gradient-primary-subtle)" }}
        >
            <div className="h-1 animate-gradient-shift" style={{ background: "var(--gradient-primary)", backgroundSize: "200% 200%" }} />

            <div className="px-6 pb-6 flex flex-col gap-5">
                {/* Animated header */}
                <div className="flex items-center gap-4">
                    <div
                        className="relative flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] shrink-0"
                        style={{ background: "rgba(108,92,231,0.15)" }}
                    >
                        <Sparkles className="h-5 w-5 text-primary animate-pulse" aria-hidden="true" />
                        <div
                            className="absolute inset-0 rounded-[var(--radius-md)] animate-pulse-soft"
                            style={{ background: "rgba(108,92,231,0.1)" }}
                        />
                    </div>
                    <div>
                        <p className="text-sm font-black text-primary">{label}</p>
                        <p className="text-xs text-foreground-muted mt-0.5">This usually takes 3–5 seconds…</p>
                    </div>
                </div>

                {/* Skeleton content */}
                <div className="flex flex-col gap-3">
                    <Skeleton height="h-5" width="w-2/3" />
                    <TextSkeleton lines={4} />
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [generateMutation.isSuccess, enhanceMutation.isSuccess]);

    const handleGenerate = () => {
        generateMutation.mutate({
            rawCaption: draft.rawCaption,
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
        const fallbackTags = ["viral", "trending", "crosspost"];

        const resolvedTitle = (localTitle && localTitle.trim()) || fallbackTitle;
        const resolvedDesc = (localDesc && localDesc.trim()) || fallbackDesc;
        const resolvedTags = localHashtags.length ? localHashtags : fallbackTags;

        setGeneratedContent(resolvedTitle, resolvedDesc, resolvedTags);
        setStep("preview");
    };

    const addHashtag = (tag: string) => {
        if (!localHashtags.includes(tag)) setLocalHashtags((prev) => [...prev, tag]);
    };

    const removeHashtag = (tag: string) => {
        setLocalHashtags((prev) => prev.filter((t) => t !== tag));
    };

    return (
        <div className="flex flex-col gap-8 animate-fade-in-up">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-black text-foreground tracking-tight">
                    Generate content
                </h2>
                <p className="text-sm text-foreground-muted mt-2 leading-relaxed">
                    AI crafts your title, description, and hashtags — edit anything after.
                </p>
            </div>

            {/* Action bar */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Primary generate button */}
                <button
                    onClick={handleGenerate}
                    disabled={isWorking}
                    className={cn(
                        "flex items-center gap-2 px-5 h-11 rounded-[var(--radius-md)]",
                        "text-sm font-bold text-white tracking-wide",
                        "transition-all duration-200 active:scale-[0.97]",
                        "disabled:opacity-50 disabled:pointer-events-none",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                        generateMutation.isPending && "opacity-80"
                    )}
                    style={{
                        background: "var(--gradient-primary)",
                        boxShadow: "var(--shadow-primary)",
                    }}
                >
                    {generateMutation.isPending ? (
                        <>
                            <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Generating…
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-4 w-4" aria-hidden="true" />
                            {hasGenerated ? "Regenerate" : "Generate with AI"}
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
                        className="gap-2 h-11 font-bold border-primary/30 text-primary hover:bg-primary/5"
                    >
                        <Wand2 className="h-4 w-4" aria-hidden="true" />
                        Enhance
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
                        className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-foreground-muted hover:text-foreground transition-colors"
                    >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        Clear
                    </button>
                )}
            </div>

            {/* Error Banner */}
            {(generateMutation.isError || enhanceMutation.isError) && !isWorking && (
                <div className={cn(
                    "flex items-start gap-4 rounded-[var(--radius-xl)] border border-error/20",
                    "bg-red-50 dark:bg-red-950/20 p-5 animate-fade-in"
                )}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-red-100 dark:bg-red-950/50 shrink-0">
                        <div className="h-3 w-3 rounded-full bg-error" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-error">AI Generation Failed</p>
                        <p className="text-xs text-error/80 mt-1 leading-relaxed">
                            {generateMutation.error?.message || enhanceMutation.error?.message || "AI service is currently unavailable. You can retry or write content manually."}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleGenerate}
                                className="text-xs font-bold"
                            >
                                Try Again
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setLocalTitle(draft.rawCaption.slice(0, 80) || "My Post");
                                    setLocalDesc(draft.rawCaption || "Check out this video!");
                                    setLocalHashtags(["shorts", "trending"]);
                                }}
                                className="text-xs text-foreground-muted hover:text-foreground"
                            >
                                Write Manually →
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Content area */}
            {isWorking ? (
                <AILoadingCard
                    label={generateMutation.isPending ? "Generating your content…" : "Enhancing your content…"}
                />
            ) : !hasGenerated ? (
                /* Empty state */
                <div className={cn(
                    "flex flex-col items-center gap-5 rounded-[var(--radius-xl)]",
                    "border-2 border-dashed border-border py-16 px-8 text-center",
                    "transition-colors hover:border-primary/30"
                )}>
                    <div
                        className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-xl)] animate-float"
                        style={{ background: "var(--gradient-primary-subtle)", border: "1px solid rgba(108,92,231,0.2)" }}
                    >
                        <Sparkles className="h-8 w-8 text-primary/60" aria-hidden="true" />
                    </div>
                    <div>
                        <p className="text-base font-black text-foreground">No content yet</p>
                        <p className="text-sm text-foreground-muted mt-1.5 max-w-md leading-relaxed">
                            Click <strong className="text-foreground">Generate with AI</strong> to craft your title, description, and hashtags automatically, or write them manually.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                        <button
                            onClick={handleGenerate}
                            className={cn(
                                "flex items-center gap-2 px-5 h-11 rounded-[var(--radius-md)]",
                                "text-sm font-bold text-white",
                                "transition-all duration-200 active:scale-[0.97]"
                            )}
                            style={{
                                background: "var(--gradient-primary)",
                                boxShadow: "var(--shadow-primary)",
                            }}
                        >
                            <Sparkles className="h-4 w-4" />
                            Generate with AI
                        </button>
                        <Button
                            variant="outline"
                            size="md"
                            className="h-11 font-bold"
                            onClick={() => {
                                setLocalTitle(draft.rawCaption.slice(0, 80) || "");
                                setLocalDesc(draft.rawCaption || "");
                                setLocalHashtags(["shorts"]);
                            }}
                        >
                            Write Manually
                        </Button>
                    </div>
                </div>
            ) : (
                /* Generated content editor */
                <div className={cn(
                    "flex flex-col gap-5 rounded-[var(--radius-xl)] border border-border bg-surface overflow-hidden",
                    "shadow-sm animate-scale-in"
                )}>
                    {/* Gradient top bar */}
                    <div className="h-[3px]" style={{ background: "var(--gradient-primary)" }} />

                    <div className="px-6 pb-6 flex flex-col gap-5">
                        {/* Success badge */}
                        <div
                            className="flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2.5 w-fit"
                            style={{ background: "rgba(108,92,231,0.1)", border: "1px solid rgba(108,92,231,0.2)" }}
                        >
                            <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                            <p className="text-xs font-bold text-primary">
                                Content ready — edit freely below
                            </p>
                        </div>

                        <Input
                            label="Title"
                            placeholder="Your post title…"
                            value={localTitle}
                            onChange={(e) => setLocalTitle(e.target.value)}
                        />

                        <Textarea
                            label="Description"
                            placeholder="Your description…"
                            value={localDesc}
                            onChange={(e) => setLocalDesc(e.target.value)}
                            rows={6}
                            showCharCount
                            maxLength={2200}
                        />

                        <div className="flex flex-col gap-2.5">
                            <span className="text-sm font-bold text-foreground">
                                Hashtags
                                <span className="ml-2 text-xs font-normal text-foreground-muted">
                                    ({localHashtags.length})
                                </span>
                            </span>
                            <div className="flex flex-wrap gap-2 min-h-[32px]">
                                {localHashtags.map((tag) => (
                                    <Chip key={tag} label={tag} onRemove={() => removeHashtag(tag)} />
                                ))}
                                <AddChip onAdd={addHashtag} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer nav */}
            <div className="flex items-center justify-between pt-2">
                <Button
                    variant="ghost"
                    size="md"
                    onClick={() => setStep("upload")}
                    className="gap-1.5 text-foreground-muted hover:text-foreground font-semibold"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back
                </Button>

                <button
                    disabled={!hasGenerated || isWorking}
                    onClick={handleContinue}
                    className={cn(
                        "flex items-center gap-2 px-6 h-11 rounded-[var(--radius-md)]",
                        "text-sm font-bold text-white tracking-wide",
                        "transition-all duration-200 active:scale-[0.97]",
                        "disabled:opacity-40 disabled:pointer-events-none"
                    )}
                    style={{
                        background: "var(--gradient-primary)",
                        boxShadow: hasGenerated && !isWorking ? "var(--shadow-primary)" : "none",
                    }}
                >
                    Continue
                    <span aria-hidden="true">→</span>
                </button>
            </div>
        </div>
    );
}
