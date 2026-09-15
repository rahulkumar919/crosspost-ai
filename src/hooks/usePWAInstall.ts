"use client";

import * as React from "react";

/** The deferred BeforeInstallPromptEvent (non-standard — only Chrome/Edge). */
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
    prompt(): Promise<void>;
}

export interface PWAInstallState {
    /** True when the browser has fired beforeinstallprompt and the app is installable. */
    isInstallable: boolean;
    /** True when the app is already running in standalone / installed mode. */
    isInstalled: boolean;
    /**
     * True when we detect iOS Safari (which doesn't support beforeinstallprompt).
     * Show a manual "Share → Add to Home Screen" instruction instead.
     */
    isIOS: boolean;
    /**
     * Call this to trigger the native install prompt.
     * No-op if prompt is unavailable.
     */
    promptInstall: () => Promise<void>;
}

/**
 * usePWAInstall
 *
 * Handles the full PWA install lifecycle:
 *  - Listens for `beforeinstallprompt` (Chrome, Edge, Android Chrome)
 *  - Detects standalone/installed mode
 *  - Detects iOS for the "Add to Home Screen" fallback
 *  - Listens for `appinstalled` to clear state after installation
 *
 * Safe on all browsers — never throws if beforeinstallprompt is unsupported.
 */
export function usePWAInstall(): PWAInstallState {
    const promptRef = React.useRef<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = React.useState(false);
    const [isInstalled,   setIsInstalled]   = React.useState(false);
    const [isIOS,         setIsIOS]         = React.useState(false);

    React.useEffect(() => {
        if (typeof window === "undefined") return;

        // ── Detect standalone (already installed) ──────────────────────────
        const checkStandalone = () =>
            window.matchMedia("(display-mode: standalone)").matches ||
            // Safari-specific
            (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

        if (checkStandalone()) {
            setIsInstalled(true);
            return; // No need to set up install listeners
        }

        // ── Detect iOS (for Add to Home Screen fallback) ───────────────────
        const ua = window.navigator.userAgent;
        const isIOSDevice =
            /iPad|iPhone|iPod/.test(ua) && !(window as Window & { MSStream?: unknown }).MSStream;
        setIsIOS(isIOSDevice);

        // ── beforeinstallprompt (Chrome / Edge / Android Chrome) ───────────
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault(); // Suppress the mini-infobar
            promptRef.current = e as BeforeInstallPromptEvent;
            setIsInstallable(true);
        };

        // ── appinstalled ───────────────────────────────────────────────────
        const handleAppInstalled = () => {
            promptRef.current = null;
            setIsInstallable(false);
            setIsInstalled(true);
        };

        // ── display-mode change (user installs from address bar) ───────────
        const mq = window.matchMedia("(display-mode: standalone)");
        const handleDisplayChange = (ev: MediaQueryListEvent) => {
            if (ev.matches) {
                setIsInstalled(true);
                setIsInstallable(false);
            }
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener("appinstalled", handleAppInstalled);
        mq.addEventListener("change", handleDisplayChange);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.removeEventListener("appinstalled", handleAppInstalled);
            mq.removeEventListener("change", handleDisplayChange);
        };
    }, []);

    const promptInstall = React.useCallback(async () => {
        if (!promptRef.current) return;
        try {
            await promptRef.current.prompt();
            const result = await promptRef.current.userChoice;
            if (result.outcome === "accepted") {
                promptRef.current = null;
                setIsInstallable(false);
            }
        } catch {
            // Silently ignore — prompt may have already been used
        }
    }, []);

    return { isInstallable, isInstalled, isIOS, promptInstall };
}
