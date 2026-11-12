"use client";

import * as React from "react";
import {
    User, Bell, Lock, Palette, Globe,
    ChevronRight, Settings,
} from "lucide-react";

const sections = [
    {
        icon: User,
        label: "Profile",
        desc: "Update your name, email and photo.",
        color: "#6366F1",
        bg: "rgba(99,102,241,0.08)",
    },
    {
        icon: Bell,
        label: "Notifications",
        desc: "Choose what notifications you receive.",
        color: "#F59E0B",
        bg: "rgba(245,158,11,0.08)",
    },
    {
        icon: Lock,
        label: "Security",
        desc: "Manage your password and 2FA.",
        color: "#EF4444",
        bg: "rgba(239,68,68,0.08)",
    },
    {
        icon: Palette,
        label: "Appearance",
        desc: "Customize the look and feel.",
        color: "#8B5CF6",
        bg: "rgba(139,92,246,0.08)",
    },
    {
        icon: Globe,
        label: "Language & Region",
        desc: "Set your preferred language and timezone.",
        color: "#10B981",
        bg: "rgba(16,185,129,0.08)",
    },
];

export const metadata = { title: "Settings" };

export default function SettingsPage() {
    return (
        <div
            className="flex flex-col flex-1 min-h-0 p-4 sm:p-6 max-w-2xl mx-auto w-full"
            style={{ background: "var(--background)" }}
        >
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <Settings className="h-4 w-4" style={{ color: "var(--foreground-muted)" }} />
                    <h1 className="text-xl font-semibold" style={{ color: "var(--foreground-color)" }}>
                        Settings
                    </h1>
                </div>
                <p className="text-[13px]" style={{ color: "var(--foreground-muted)" }}>
                    Manage your account preferences.
                </p>
            </div>

            {/* Sections */}
            <div
                className="rounded-xl overflow-hidden border"
                style={{ borderColor: "var(--border-color)", background: "var(--surface)" }}
            >
                {sections.map(({ icon: Icon, label, desc, color, bg }, i) => (
                    <React.Fragment key={label}>
                        {i > 0 && (
                            <div className="border-t mx-4" style={{ borderColor: "var(--border-color)" }} />
                        )}
                        <button
                            className="flex items-center gap-3.5 w-full px-4 py-3.5 text-left transition-colors hover:bg-[var(--surface-elevated)]"
                        >
                            <div
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                                style={{ background: bg }}
                            >
                                <Icon className="h-4 w-4" style={{ color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[14px] font-medium" style={{ color: "var(--foreground-color)" }}>
                                    {label}
                                </p>
                                <p className="text-[12px] mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                                    {desc}
                                </p>
                            </div>
                            <ChevronRight className="h-4 w-4 shrink-0" style={{ color: "var(--muted)" }} />
                        </button>
                    </React.Fragment>
                ))}
            </div>

            <p className="text-center text-[11px] mt-8" style={{ color: "var(--muted)" }}>
                CrossPost AI · Settings coming soon
            </p>
        </div>
    );
}
