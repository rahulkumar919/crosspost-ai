import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merges Tailwind classes safely, resolving conflicts. */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Formats a file size in bytes to a human-readable string. */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Truncates a string to maxLength, appending ellipsis if needed. */
export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 1) + "…";
}

/** Returns the platform display name. */
export function platformLabel(platform: string): string {
    const labels: Record<string, string> = {
        youtube: "YouTube",
        instagram: "Instagram",
        linkedin: "LinkedIn",
    };
    return labels[platform] ?? platform;
}

/** Returns the platform accent color token class name. */
export function platformColorClass(platform: string): string {
    const classes: Record<string, string> = {
        youtube: "text-youtube",
        instagram: "text-instagram",
        linkedin: "text-linkedin",
    };
    return classes[platform] ?? "text-foreground";
}

/** Formats a duration in seconds to MM:SS. */
export function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Delays execution for a given number of milliseconds (for mocks). */
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
