import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /**
     * COOP + COEP headers are required for FFmpeg.wasm to access SharedArrayBuffer,
     * which it needs for multi-threaded video processing.
     *
     * These headers are applied to ALL routes. They are safe for a same-origin
     * Next.js app but will block cross-origin iframes — acceptable for this MVP.
     *
     * Docs: https://ffmpegwasm.netlify.app/docs/getting-started/installation/
     */
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "lh3.googleusercontent.com" },
            { protocol: "https", hostname: "googleusercontent.com" },
            { protocol: "https", hostname: "avatars.githubusercontent.com" },
            { protocol: "https", hostname: "*.googleusercontent.com" },
        ],
    },
    async headers() {
        return [
            // ── FFmpeg COOP/COEP — applied globally ───────────────────────
            {
                source: "/(.*)",
                headers: [
                    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
                    { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
                ],
            },
            // ── Service Worker — allow full root scope ────────────────────
            {
                source: "/sw.js",
                headers: [
                    { key: "Service-Worker-Allowed", value: "/" },
                    { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
                    { key: "Content-Type", value: "application/javascript; charset=utf-8" },
                ],
            },
            // ── Web App Manifest — always fresh ───────────────────────────
            {
                source: "/manifest.webmanifest",
                headers: [
                    { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
                    { key: "Content-Type", value: "application/manifest+json" },
                ],
            },
        ];
    },
};

export default nextConfig;

