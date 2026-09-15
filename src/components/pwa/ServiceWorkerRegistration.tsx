"use client";

import * as React from "react";

/**
 * Registers the CrossPost AI service worker (/sw.js) once the component mounts.
 *
 * Placed inside <Providers> so it runs client-side only, after hydration.
 * Safe to include in the tree unconditionally — it no-ops in unsupported
 * environments (non-HTTPS, SSR, older browsers).
 *
 * IMPORTANT: The SW is conservative and does NOT cache API or auth routes.
 */
export function ServiceWorkerRegistration() {
    React.useEffect(() => {
        if (typeof window === "undefined") return;
        if (!("serviceWorker" in navigator)) return;

        // Only register on HTTPS or localhost
        const isSecure =
            window.location.protocol === "https:" ||
            window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1";

        if (!isSecure) return;

        navigator.serviceWorker
            .register("/sw.js", {
                scope: "/",
                // Update on reload to pick up new SW versions quickly during dev
                updateViaCache: "none",
            })
            .then((registration) => {
                // Check for updates every time the app is focused
                const onFocus = () => {
                    registration.update().catch(() => {
                        // Ignore update errors (e.g. offline)
                    });
                };
                window.addEventListener("focus", onFocus, { passive: true });
                return () => window.removeEventListener("focus", onFocus);
            })
            .catch(() => {
                // SW registration errors are non-fatal — app works normally
            });
    }, []);

    return null;
}
