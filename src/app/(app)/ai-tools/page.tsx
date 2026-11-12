"use client";

import * as React from "react";
import { Wand2, Hash, Lightbulb, CalendarDays, Zap, ArrowRight, Sparkles } from "lucide-react";

const tools = [
    {
        icon: Wand2,
        label: "AI Caption Generator",
        desc: "Generate engaging captions for any post in seconds.",
        color: "#6366F1",
        bg: "rgba(99,102,241,0.08)",
        badge: "Popular",
    },
    {
        icon: Hash,
        label: "Hashtag Generator",
        desc: "Find trending, relevant hashtags for your niche.",
        color: "#F59E0B",
        bg: "rgba(245,158,11,0.08)",
        badge: null,
    },
    {
        icon: Lightbulb,
        label: "Content Ideas",
        desc: "AI-powered content ideas tailored to your audience.",
        color: "#EC4899",
        bg: "rgba(236,72,153,0.08)",
        badge: "New",
    },
    {
        icon: CalendarDays,
        label: "Scheduling Suggestions",
        desc: "Best times to post based on your audience data.",
        color: "#3B82F6",
        bg: "rgba(59,130,246,0.08)",
        badge: null,
    },
    {
        icon: Zap,
        label: "Auto-Optimize",
        desc: "AI rewrites your content for each platform format.",
        color: "#10B981",
        bg: "rgba(16,185,129,0.08)",
        badge: null,
    },
];

export default function AIToolsPage() {
    return (
        <div className="flex flex-col flex-1 min-h-0 p-4 sm:p-6 max-w-3xl mx-auto w-full" style={{ background: "var(--background)" }}>

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4" style={{ color: "#8B5CF6" }} />
                    <h1 className="text-xl font-semibold" style={{ color: "var(--foreground-color)" }}>AI Tools</h1>
                </div>
                <p className="text-[13px]" style={{ color: "var(--foreground-muted)" }}>
                    Smart tools to create better content, faster.
                </p>
            </div>

            {/* Tools grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tools.map(({ icon: Icon, label, desc, color, bg, badge }) => (
                    <button
                        key={label}
                        className="group flex items-start gap-3.5 p-4 rounded-xl text-left transition-all duration-150 hover:shadow-md"
                        style={{
                            background: "var(--surface)",
                            border: "1px solid var(--border-color)",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = color + "40"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; }}
                    >
                        <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg mt-0.5"
                            style={{ background: bg }}
                        >
                            <Icon className="h-4.5 w-4.5" style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-[14px] font-medium" style={{ color: "var(--foreground-color)" }}>
                                    {label}
                                </p>
                                {badge && (
                                    <span
                                        className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                                        style={{ background: bg, color }}
                                    >
                                        {badge}
                                    </span>
                                )}
                            </div>
                            <p className="text-[12px] leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                                {desc}
                            </p>
                        </div>
                        <ArrowRight
                            className="h-4 w-4 shrink-0 mt-1 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150"
                            style={{ color: "var(--muted)" }}
                        />
                    </button>
                ))}

                {/* Coming soon card */}
                <div
                    className="flex flex-col p-4 rounded-xl"
                    style={{
                        background: "var(--surface-elevated)",
                        border: "1px dashed var(--border-color)",
                    }}
                >
                    <Sparkles className="h-5 w-5 mb-2" style={{ color: "var(--muted)" }} />
                    <p className="text-[13px] font-medium mb-0.5" style={{ color: "var(--foreground-muted)" }}>
                        More tools on the way
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--muted)" }}>
                        We're constantly adding new AI-powered features.
                    </p>
                </div>
            </div>
        </div>
    );
}
