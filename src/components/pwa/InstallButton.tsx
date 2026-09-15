"use client";

import * as React from "react";
import { Download, Share, X } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

interface InstallButtonProps {
    /** "sidebar" renders a full-width dark button. "header" renders a compact icon+text button. */
    variant?: "sidebar" | "header";
}

/**
 * InstallButton
 *
 * Renders an "Install App" button only when the PWA is installable.
 * On iOS Safari (which doesn't support beforeinstallprompt) renders a
 * dismissible "Add to Home Screen" tip.
 * Returns null if already installed or platform doesn't support installation.
 */
export function InstallButton({ variant = "sidebar" }: InstallButtonProps) {
    const { isInstallable, isInstalled, isIOS, promptInstall } = usePWAInstall();
    const [iosHintDismissed, setIosHintDismissed] = React.useState(false);

    // Restore dismissal from sessionStorage so it doesn't re-appear on nav
    React.useEffect(() => {
        if (typeof window === "undefined") return;
        const dismissed = sessionStorage.getItem("crosspost_ios_hint_dismissed");
        if (dismissed === "1") setIosHintDismissed(true);
    }, []);

    const dismissIOSHint = React.useCallback(() => {
        setIosHintDismissed(true);
        sessionStorage.setItem("crosspost_ios_hint_dismissed", "1");
    }, []);

    // ── Already installed — show nothing ──────────────────────────────────
    if (isInstalled) return null;

    // ── iOS Safari — show "Add to Home Screen" tip ────────────────────────
    if (isIOS && !iosHintDismissed) {
        if (variant === "header") {
            return (
                <div
                    className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                    style={{
                        background: "rgba(108,92,231,0.15)",
                        borderColor: "rgba(162,155,254,0.3)",
                        color: "#a29bfe",
                    }}
                >
                    <Share className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>Add to Home Screen</span>
                    <button
                        onClick={dismissIOSHint}
                        className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
                        aria-label="Dismiss install tip"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </div>
            );
        }

        // Sidebar variant
        return (
            <div
                className="mx-3 mb-2 px-3 py-2.5 rounded-xl text-xs"
                style={{
                    background: "rgba(108,92,231,0.12)",
                    border: "1px solid rgba(162,155,254,0.2)",
                }}
            >
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Share className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "#a29bfe" }} aria-hidden="true" />
                        <div>
                            <p className="font-semibold text-white/80 leading-none">Install App</p>
                            <p className="text-white/40 mt-1 leading-snug">
                                Tap <strong className="text-white/60">Share</strong> → <strong className="text-white/60">Add to Home Screen</strong>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={dismissIOSHint}
                        className="shrink-0 mt-0.5 text-white/30 hover:text-white/60 transition-colors"
                        aria-label="Dismiss install tip"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        );
    }

    // ── Browser doesn't support install prompt — render nothing ───────────
    if (!isInstallable) return null;

    // ── Header variant — compact button ───────────────────────────────────
    if (variant === "header") {
        return (
            <button
                id="pwa-install-btn-header"
                onClick={promptInstall}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-[1.03] active:scale-[0.97]"
                style={{
                    background: "linear-gradient(135deg, rgba(108,92,231,0.35) 0%, rgba(162,155,254,0.2) 100%)",
                    border: "1px solid rgba(162,155,254,0.35)",
                    color: "#a29bfe",
                    boxShadow: "0 2px 12px rgba(108,92,231,0.25)",
                }}
                aria-label="Install CrossPost AI app"
            >
                <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Install App
            </button>
        );
    }

    // ── Sidebar variant — full-width button ───────────────────────────────
    return (
        <div className="px-3 mb-2">
            <button
                id="pwa-install-btn-sidebar"
                onClick={promptInstall}
                className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                    background: "linear-gradient(135deg, rgba(108,92,231,0.2) 0%, rgba(162,155,254,0.1) 100%)",
                    border: "1px solid rgba(162,155,254,0.25)",
                    boxShadow: "0 2px 12px rgba(108,92,231,0.15)",
                }}
                aria-label="Install CrossPost AI app"
            >
                {/* Icon */}
                <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110"
                    style={{
                        background: "linear-gradient(135deg, rgba(108,92,231,0.5), rgba(162,155,254,0.4))",
                        boxShadow: "0 2px 8px rgba(108,92,231,0.3)",
                    }}
                >
                    <Download className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 text-left">
                    <p className="text-[12px] font-bold leading-none" style={{ color: "#a29bfe" }}>
                        Install App
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "rgba(162,155,254,0.5)" }}>
                        Open as a standalone app
                    </p>
                </div>
            </button>
        </div>
    );
}
