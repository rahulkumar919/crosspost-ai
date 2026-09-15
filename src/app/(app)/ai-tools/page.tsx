"use client";

import * as React from "react";
import { Wand2, Hash, Lightbulb, CalendarDays, ChevronRight, Zap, Sparkles } from "lucide-react";

const tools = [
    { icon: Wand2, label: "AI Caption Generator", desc: "Generate engaging captions for your posts in seconds.", color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
    { icon: Hash, label: "Hashtag Generator", desc: "Find the most trending and relevant hashtags.", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
    { icon: Lightbulb, label: "Content Ideas", desc: "Get inspired content ideas tailored to your niche.", color: "#ec4899", bg: "rgba(236,72,153,0.12)" },
    { icon: CalendarDays, label: "Content Calendar", desc: "AI-powered scheduling suggestions.", color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
    { icon: Zap, label: "Auto-Optimize", desc: "AI optimizes your content for each platform.", color: "#10B981", bg: "rgba(16,185,129,0.12)" },
];

export default function AIToolsPage() {
    return (
        <div className="flex flex-col flex-1 min-h-0 p-4 sm:p-6 lg:p-8" style={{ background: "var(--background)" }}>

            {/* ── Header ── */}
            <div className="mb-4">
                <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2"
                    style={{ background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.25)", color: "#f472b6" }}
                >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>POWERED BY AI</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: "var(--foreground-color)" }}>
                    AI{" "}
                    <span style={{ background: "linear-gradient(135deg,#ec4899,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        Tools
                    </span>
                </h1>
                <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--foreground-muted)" }}>
                    Smart tools to create better content, faster.
                </p>
            </div>

            {/* ── Tool cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map(({ icon: Icon, label, desc, color, bg }) => (
                    <button
                        key={label}
                        className="flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] group"
                        style={{
                            background: "var(--surface)",
                            border: "1px solid var(--border-color)",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(236,72,153,0.25)")}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border-color)")}
                    >
                        <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-110"
                            style={{ background: bg }}
                        >
                            <Icon className="h-6 w-6" style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold" style={{ color: "var(--foreground-color)" }}>{label}</p>
                            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--foreground-muted)" }}>{desc}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 transition-colors group-hover:text-pink-400" style={{ color: "rgba(255,255,255,0.2)" }} />
                    </button>
                ))}

                {/* CTA card */}
                <div
                    className="flex flex-col items-start justify-between p-5 rounded-2xl text-white relative overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #ec4899 0%, #a78bfa 100%)",
                        boxShadow: "0 4px 24px rgba(236,72,153,0.35)",
                    }}
                >
                    <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
                    <div className="relative z-10">
                        <Sparkles className="h-6 w-6 mb-3 text-white/80" />
                        <p className="text-sm font-black text-white leading-snug">More tools coming soon</p>
                        <p className="text-xs text-white/70 mt-1 leading-relaxed">We&apos;re building more AI-powered features for you.</p>
                    </div>
                    <div
                        className="relative z-10 mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-95"
                        style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)" }}
                    >
                        <span className="text-white">Stay tuned →</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

