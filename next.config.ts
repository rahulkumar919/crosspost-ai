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
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
                    { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
                ],
            },
        ];
    },
};

export default nextConfig;
