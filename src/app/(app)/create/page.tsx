"use client";

import * as React from "react";
import { useDraftPostStore } from "@/store/useDraftPostStore";
import { UploadStep } from "./_steps/UploadStep";
import { GenerateStep } from "./_steps/GenerateStep";
import { PreviewStep } from "./_steps/PreviewStep";
import { PublishStep } from "./_steps/PublishStep";
import { StepIndicator } from "./_components/StepIndicator";
import type { CreateStep } from "@/types/post.types";

const STEPS: { key: CreateStep; label: string }[] = [
    { key: "upload", label: "Upload" },
    { key: "generate", label: "Generate" },
    { key: "preview", label: "Preview" },
    { key: "publish", label: "Publish" },
];

const STEP_SUBTITLES: Record<CreateStep, string> = {
    upload: "Import your high-quality video or image",
    generate: "AI crafts viral titles, SEO description & tags",
    preview: "Fine-tune and preview for every platform",
    publish: "Go live across YouTube, Instagram & LinkedIn",
};

export default function CreatePage() {
    const currentStep = useDraftPostStore((s) => s.currentStep);
    const currentIndex = ["upload", "generate", "preview", "publish"].indexOf(currentStep);

    return (
        <div className="flex flex-col flex-1 min-h-0" style={{ background: "var(--background)", color: "var(--foreground-color)" }}>

            {/* ── Sticky Header ──────────────────────────────────────── */}
            <div
                className="sticky top-0 z-30 w-full bg-[var(--surface)]/90"
                style={{
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderBottom: "1px solid var(--border-color)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                }}
            >
                {/* Top accent line */}
                <div
                    className="h-[2px] w-full"
                    style={{ background: "linear-gradient(90deg, #6C5CE7 0%, #A78BFA 50%, #60A5FA 100%)" }}
                />

                <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-3 pb-4">
                    {/* Title row */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col gap-0.5">
                            <h1 className="text-base sm:text-lg font-black leading-none tracking-tight text-[var(--foreground-color)]">
                                Create{" "}
                                <span
                                    style={{
                                        background: "linear-gradient(135deg, #6C5CE7 0%, #8B5CF6 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    Post
                                </span>
                            </h1>
                            <p className="text-[11px] font-medium leading-none text-[var(--foreground-muted)]">
                                {STEP_SUBTITLES[currentStep]}
                            </p>
                        </div>

                        {/* Step badge */}
                        <div
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black"
                            style={{
                                background: "rgba(108,92,231,0.12)",
                                border: "1px solid rgba(108,92,231,0.25)",
                                color: "#6C5CE7",
                            }}
                        >
                            <span
                                className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-black"
                                style={{ background: "linear-gradient(135deg, #6C5CE7, #A78BFA)", color: "#fff" }}
                            >
                                {currentIndex + 1}
                            </span>
                            <span>of {STEPS.length}</span>
                        </div>
                    </div>

                    {/* Step indicator */}
                    <StepIndicator steps={STEPS} currentStep={currentStep} />
                </div>
            </div>

            {/* ── Ambient cosmic glow ──────────────────────────────────────── */}
            <div
                className="pointer-events-none fixed inset-0 z-0"
                aria-hidden="true"
                style={{
                    background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,111,255,0.12) 0%, transparent 65%)",
                }}
            />

            {/* ── Step Content ─────────────────────────────────────────────── */}
            <div className="relative z-10 flex-1">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 py-5 sm:py-7">
                    {currentStep === "upload" && <UploadStep />}
                    {currentStep === "generate" && <GenerateStep />}
                    {currentStep === "preview" && <PreviewStep />}
                    {currentStep === "publish" && <PublishStep />}
                </div>
            </div>
        </div>
    );
}

