"use client";

import * as React from "react";
import { Settings, User, Bell, Lock, Palette, Globe, ChevronRight } from "lucide-react";

const sections = [
    { icon: User, label: "Profile Settings", desc: "Update your name, email and avatar.", color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
    { icon: Bell, label: "Notifications", desc: "Choose what notifications you receive.", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
    { icon: Lock, label: "Security", desc: "Manage your password and two-factor auth.", color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
    { icon: Palette, label: "Appearance", desc: "Customize the look and feel of the app.", color: "#ec4899", bg: "rgba(236,72,153,0.12)" },
    { icon: Globe, label: "Language & Region", desc: "Set your preferred language and timezone.", color: "#10B981", bg: "rgba(16,185,129,0.12)" },
];

export default function SettingsPage() {
    return (
        <div className="flex flex-col flex-1 min-h-0 p-4 sm:p-6 lg:p-8" style={{ background: "var(--background)" }}>

            {/* ── Header ── */}
            <div className="mb-4">
                <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2"
                    style={{ background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.25)", color: "#f472b6" }}
                >
                    <Settings className="h-3.5 w-3.5" />
                    <span>PREFERENCES</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: "var(--foreground-color)" }}>
                    <span style={{ background: "linear-gradient(135deg,#ec4899,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        Settings
                    </span>
                </h1>
                <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--foreground-muted)" }}>
                    Manage your account preferences and settings.
                </p>
            </div>

            {/* ── Settings list ── */}
            <div className="flex flex-col gap-3 max-w-2xl">
                {sections.map(({ icon: Icon, label, desc, color, bg }) => (
                    <button
                        key={label}
                        className="flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-200 hover:scale-[1.005] active:scale-[0.998] group"
                        style={{
                            background: "var(--surface)",
                            border: "1px solid var(--border-color)",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(236,72,153,0.25)")}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border-color)")}
                    >
                        <div
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
                            style={{ background: bg }}
                        >
                            <Icon className="h-5 w-5" style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold" style={{ color: "var(--foreground-color)" }}>{label}</p>
                            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--foreground-muted)" }}>{desc}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 transition-colors group-hover:text-pink-400" style={{ color: "rgba(255,255,255,0.2)" }} />
                    </button>
                ))}
            </div>
        </div>
    );
}

