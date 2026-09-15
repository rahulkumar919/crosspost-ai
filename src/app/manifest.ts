import type { MetadataRoute } from "next";

/**
 * Next.js App Router manifest route.
 * Automatically served at /manifest.webmanifest.
 *
 * Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
 */
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "CrossPost AI",
        short_name: "CrossPost AI",
        description:
            "Publish your content to every platform, instantly — powered by AI. Cross-post videos and content to YouTube, Instagram, LinkedIn, and more in one click.",
        start_url: "/accounts",
        id: "/",
        display: "standalone",
        background_color: "#0D0A2E",
        theme_color: "#6C5CE7",
        orientation: "portrait-primary",
        categories: ["social", "productivity", "utilities"],
        icons: [
            {
                src: "/logo.png",
                sizes: "any",
                type: "image/png",
            },
            {
                src: "/logo.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/logo.png",
                sizes: "512x512",
                type: "image/png",
            },
            {
                src: "/logo.png",
                sizes: "512x512",
                type: "image/png",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                purpose: "maskable" as any,
            },
        ],
        screenshots: [],
    };
}
