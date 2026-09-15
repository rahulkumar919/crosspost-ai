"use client";

import * as React from "react";

// Pure inline SVG icons — zero external dependencies, no lucide imports at all.
// This prevents the stale lucide moon.mjs module factory error in Turbopack.

function SunIcon() {
    return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    );
}

/**
 * ThemeToggle — sun/moon pill button.
 *
 * Uses ONLY inline SVG — no lucide-react imports.
 * Toggles .dark class + data-theme attribute on <html>.
 * Defaults to dark (app is dark-first).
 */
export function ThemeToggle() {
    const [isDark, setIsDark] = React.useState(true);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        const stored = localStorage.getItem("theme");
        const dark = stored ? stored === "dark" : true;
        applyTheme(dark);
        setIsDark(dark);
        setMounted(true);
    }, []);

    function applyTheme(dark: boolean) {
        const html = document.documentElement;
        if (dark) {
            html.classList.add("dark");
            html.setAttribute("data-theme", "dark");
        } else {
            html.classList.remove("dark");
            html.setAttribute("data-theme", "light");
        }
    }

    const toggle = () => {
        const next = !isDark;
        setIsDark(next);
        applyTheme(next);
        localStorage.setItem("theme", next ? "dark" : "light");
    };

    // Skeleton before hydration
    if (!mounted) {
        return (
            <div
                aria-hidden="true"
                style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: "rgba(255,255,255,0.08)",
                    flexShrink: 0,
                }}
            />
        );
    }

    return (
        <button
            type="button"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggle}
            style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.14)",
                background: isDark
                    ? "rgba(255,255,255,0.09)"
                    : "rgba(255,200,50,0.15)",
                color: isDark ? "rgba(255,255,255,0.75)" : "rgba(200,150,0,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s, transform 0.15s",
                flexShrink: 0,
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.background = isDark
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,200,50,0.25)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = isDark
                    ? "rgba(255,255,255,0.09)"
                    : "rgba(255,200,50,0.15)";
            }}
        >
            {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
    );
}
