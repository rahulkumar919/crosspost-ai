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
    upload: "Add your video or image",
    generate: "AI crafts your captions",
    preview: "Review before publishing",
    publish: "Go live on all platforms",
};

export default function CreatePage() {
    const currentStep = useDraftPostStore((s) => s.currentStep);
    const currentIndex = ["upload", "generate", "preview", "publish"].indexOf(currentStep);

    return (
        <div className="flex flex-col flex-1 min-h-0" style={{ background: "#F5F3FF" }}>

            {/* ── Premium Header ──────────────────────────────────────────── */}
            <div
                className="sticky top-0 z-30"
                style={{
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(20px)",
                    borderBottom: "1px solid rgba(108,92,231,0.1)",
                    boxShadow: "0 2px 20px rgba(108,92,231,0.06)",
                }}
            >
                <div className="mx-auto max-w-3xl px-4 sm:px-6 py-4">
                    {/* Top row: title + step count */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-lg font-black text-gray-900 leading-none">
                                Create <span style={{ color: "#6C5CE7" }}>Post</span>
                            </h1>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {STEP_SUBTITLES[currentStep]}
                            </p>
                        </div>
                        <span
                            className="text-xs font-bold px-3 py-1 rounded-full"
                            style={{ background: "rgba(108,92,231,0.1)", color: "#6C5CE7" }}
                        >
                            Step {currentIndex + 1} of {STEPS.length}
                        </span>
                    </div>

                    {/* Step indicator */}
                    <StepIndicator steps={STEPS} currentStep={currentStep} />
                </div>
            </div>

            {/* ── Ambient gradient blob ───────────────────────────────────── */}
            <div
                className="pointer-events-none fixed inset-0 z-0"
                aria-hidden="true"
                style={{
                    background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(108,92,231,0.07) 0%, transparent 65%)",
                }}
            />

            {/* ── Step Content ────────────────────────────────────────────── */}
            <div className="relative z-10 flex-1">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
                    {currentStep === "upload" && <UploadStep />}
                    {currentStep === "generate" && <GenerateStep />}
                    {currentStep === "preview" && <PreviewStep />}
                    {currentStep === "publish" && <PublishStep />}
                </div>
            </div>
        </div>
    );
}
