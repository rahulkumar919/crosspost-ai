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
                                                background: "rgba(167, 139, 250, 0.25)",
                                                animationDuration: "2.5s",
                                            }}
                                        />
                                    )}

                                    <span
                                        aria-current={status === "current" ? "step" : undefined}
                                        className="relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-500 font-bold"
                                        style={
                                            status === "complete"
                                                ? {
                                                    background: "linear-gradient(135deg, #6C5CE7, #8B5CF6)",
                                                    boxShadow: "0 0 16px rgba(108, 92, 231, 0.45)",
                                                    color: "#FFFFFF",
                                                }
                                                : status === "current"
                                                    ? {
                                                        background: "#151224",
                                                        border: "2px solid #A78BFA",
                                                        color: "#A78BFA",
                                                        boxShadow: "0 0 20px rgba(167, 139, 250, 0.35)",
                                                    }
                                                    : {
                                                        background: "rgba(255, 255, 255, 0.04)",
                                                        border: "1.5px solid rgba(255, 255, 255, 0.12)",
                                                        color: "rgba(255, 255, 255, 0.35)",
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
                                                ? "#A78BFA"
                                                : status === "complete"
                                                    ? "#FFFFFF"
                                                    : "rgba(255, 255, 255, 0.35)",
                                    }}
                                >
                                    {label}
                                </span>
                            </div>

                            {/* Connector */}
                            {!isLast && (
                                <div className="flex-1 mx-2 sm:mx-3 mb-5" aria-hidden="true">
                                    <div
                                        className="relative h-[3px] w-full rounded-full overflow-hidden"
                                        style={{ background: "rgba(255, 255, 255, 0.08)" }}
                                    >
                                        {/* Filled portion */}
                                        <div
                                            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-in-out"
                                            style={{
                                                width: index < currentIndex ? "100%" : "0%",
                                                background: "linear-gradient(90deg, #6C5CE7, #A78BFA, #60A5FA)",
                                                boxShadow: index < currentIndex ? "0 0 10px rgba(167, 139, 250, 0.6)" : "none",
                                            }}
                                        />
                                        {/* Shimmer on active connector */}
                                        {index === currentIndex - 1 && (
                                            <div
                                                className="absolute inset-y-0 w-1/3 rounded-full animate-shimmer pointer-events-none"
                                                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
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
