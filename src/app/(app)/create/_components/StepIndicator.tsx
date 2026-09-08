import * as React from "react";
import { Check, Upload, Wand2, Eye, Rocket } from "lucide-react";
import type { CreateStep } from "@/types/post.types";

const STEP_ORDER: CreateStep[] = ["upload", "generate", "preview", "publish"];

const STEP_ICONS: Record<CreateStep, React.ReactNode> = {
    upload: <Upload className="h-4 w-4" aria-hidden="true" />,
    generate: <Wand2 className="h-4 w-4" aria-hidden="true" />,
    preview: <Eye className="h-4 w-4" aria-hidden="true" />,
    publish: <Rocket className="h-4 w-4" aria-hidden="true" />,
};

interface StepIndicatorProps {
    steps: { key: CreateStep; label: string }[];
    currentStep: CreateStep;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
    const currentIndex = STEP_ORDER.indexOf(currentStep);

    return (
        <nav aria-label="Progress" className="w-full">
            <ol className="flex items-center gap-0">
                {steps.map(({ key, label }, index) => {
                    const status =
                        index < currentIndex
                            ? "complete"
                            : index === currentIndex
                                ? "current"
                                : "upcoming";

                    const isLast = index === steps.length - 1;

                    return (
                        <li key={key} className="flex flex-1 items-center">
                            {/* Step node */}
                            <div className="flex flex-col items-center gap-1.5 relative">
                                {/* Circle */}
                                <div className="relative">
                                    {/* Pulse ring for current */}
                                    {status === "current" && (
                                        <span
                                            className="absolute -inset-1.5 rounded-full animate-ping"
                                            style={{
                                                background: "rgba(108,92,231,0.2)",
                                                animationDuration: "2s",
                                            }}
                                        />
                                    )}

                                    <span
                                        aria-current={status === "current" ? "step" : undefined}
                                        className="relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-500"
                                        style={
                                            status === "complete"
                                                ? {
                                                    background: "linear-gradient(135deg, #5b21b6, #6C5CE7)",
                                                    boxShadow: "0 4px 14px rgba(108,92,231,0.4)",
                                                    color: "white",
                                                }
                                                : status === "current"
                                                    ? {
                                                        background: "white",
                                                        border: "2.5px solid #6C5CE7",
                                                        color: "#6C5CE7",
                                                        boxShadow: "0 4px 16px rgba(108,92,231,0.25)",
                                                    }
                                                    : {
                                                        background: "rgba(255,255,255,0.6)",
                                                        border: "2px solid rgba(108,92,231,0.2)",
                                                        color: "rgba(108,92,231,0.35)",
                                                    }
                                        }
                                    >
                                        {status === "complete" ? (
                                            <Check className="h-4 w-4 stroke-[3]" aria-hidden="true" />
                                        ) : (
                                            STEP_ICONS[key]
                                        )}
                                    </span>
                                </div>

                                {/* Label */}
                                <span
                                    className="text-[11px] font-bold whitespace-nowrap tracking-wider uppercase transition-all duration-300"
                                    style={{
                                        color:
                                            status === "current"
                                                ? "#6C5CE7"
                                                : status === "complete"
                                                    ? "#374151"
                                                    : "rgba(107,101,133,0.5)",
                                    }}
                                >
                                    {label}
                                </span>
                            </div>

                            {/* Connector */}
                            {!isLast && (
                                <div className="flex-1 mx-3 mb-5" aria-hidden="true">
                                    <div
                                        className="relative h-[3px] w-full rounded-full overflow-hidden"
                                        style={{ background: "rgba(108,92,231,0.1)" }}
                                    >
                                        {/* Filled portion */}
                                        <div
                                            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-in-out"
                                            style={{
                                                width: index < currentIndex ? "100%" : "0%",
                                                background: "linear-gradient(90deg, #5b21b6, #6C5CE7, #a29bfe)",
                                                boxShadow: index < currentIndex ? "0 0 8px rgba(108,92,231,0.5)" : "none",
                                            }}
                                        />
                                        {/* Shimmer on active connector */}
                                        {index === currentIndex - 1 && (
                                            <div
                                                className="absolute inset-y-0 w-1/3 rounded-full animate-shimmer pointer-events-none"
                                                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)" }}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
