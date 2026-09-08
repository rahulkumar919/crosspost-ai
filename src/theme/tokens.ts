/**
 * Design tokens for CrossPost AI.
 * These are the single source of truth — consumed by globals.css via @theme inline.
 * Never hard-code these hex values in components; always reference the CSS vars or
 * Tailwind token names (e.g. `text-primary`, `bg-surface`).
 */

export const colors = {
    // Brand
    primary: "#5B4FE9",
    primaryHover: "#4840D4",
    primaryForeground: "#ffffff",

    // Platform accents (use ONLY in preview/status contexts)
    youtube: "#FF3B30",
    instagram: "#E1306C",
    linkedin: "#0A66C2",

    // Neutral scale (light mode)
    background: "#ffffff",
    surface: "#f8f7ff",
    surfaceElevated: "#f0effe",
    border: "#e5e3f5",
    muted: "#9896b0",
    foreground: "#1a1825",
    foregroundMuted: "#6b6882",

    // Dark mode equivalents (defined in CSS, not JS — but documented here)
    // dark.background: #0f0e1a
    // dark.surface: #161424
    // dark.surfaceElevated: #1f1c31
    // dark.border: #2d2a45
    // dark.muted: #6b6882
    // dark.foreground: #f0effe
    // dark.foregroundMuted: #9896b0

    // Status
    success: "#16a34a",
    warning: "#d97706",
    error: "#dc2626",
    info: "#2563eb",
} as const;

export const spacing = {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
} as const;

export const radius = {
    sm: "6px",
    md: "10px",
    lg: "16px",
    xl: "24px",
    full: "9999px",
} as const;

export const typography = {
    caption: { size: "12px", lineHeight: "16px", weight: "400" },
    body: { size: "14px", lineHeight: "20px", weight: "400" },
    subtitle: { size: "16px", lineHeight: "24px", weight: "500" },
    title: { size: "20px", lineHeight: "28px", weight: "600" },
    heading: { size: "28px", lineHeight: "36px", weight: "700" },
} as const;
