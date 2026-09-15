/**
 * CrossPost AI — Conservative Service Worker
 *
 * Caching strategy:
 *  • Cache-first  → Next.js static chunks (_next/static/**), web fonts, logo
 *  • Network-only → /api/**, /api/auth/**, any authenticated route
 *  • Network-first → everything else (HTML pages, dynamic routes)
 *
 * NEVER cached: API responses, auth cookies, OAuth callbacks, user data.
 */

const STATIC_CACHE = "crosspost-static-v3";
const FONT_CACHE   = "crosspost-fonts-v2";

/** Patterns that must ALWAYS go to the network — no cache reads or writes. */
const NETWORK_ONLY = [
    /^\/api\//,
    /^\/api\/auth\//,
    /^\/login/,
    /^\/logout/,
    // Next-auth internal routes
    /\/_next\/server\//,
];

/** Static asset patterns eligible for cache-first.
 *  IMPORTANT: Do NOT cache _next/static/chunks/*.js — Next.js Turbopack
 *  generates new content hashes per build, but the SW can serve stale chunks
 *  from a previous build causing "module factory not available" errors.
 *  Only cache truly immutable binary assets (images, icons, fonts).
 */
const CACHEABLE_STATIC = [
    /^\/_next\/static\/media\//,       // Next.js optimised images
    /^\/logo\.(png|jpg|jpeg|webp)$/,
    /^\/favicon\.ico$/,
    /^\/icons\//,
    /^\/apple-touch-icon\.png$/,
    /^\/manifest\.webmanifest$/,
];

/** Google Fonts — cache with stale-while-revalidate. */
const FONT_ORIGINS = ["fonts.googleapis.com", "fonts.gstatic.com"];

// ─── Install ────────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
    // Skip waiting so the new SW takes over immediately
    self.skipWaiting();
});

// ─── Activate ───────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
    const CURRENT_CACHES = new Set([STATIC_CACHE, FONT_CACHE]);
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((k) => !CURRENT_CACHES.has(k))
                    .map((k) => {
                        console.log("[SW] Deleting stale cache:", k);
                        return caches.delete(k);
                    })
            )
        ).then(() => self.clients.claim())
    );
});

// ─── Fetch ───────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Only handle same-origin requests (plus font CDNs)
    const isSameOrigin   = url.origin === self.location.origin;
    const isFontRequest  = FONT_ORIGINS.some((h) => url.hostname.includes(h));

    if (!isSameOrigin && !isFontRequest) return;

    // Ignore non-GET
    if (request.method !== "GET") return;

    const pathname = url.pathname;

    // 1. Network-only — sensitive routes
    if (isSameOrigin && NETWORK_ONLY.some((re) => re.test(pathname))) {
        // Do not intercept — fall through to browser default
        return;
    }

    // 2. Cache-first — static assets
    if (isSameOrigin && CACHEABLE_STATIC.some((re) => re.test(pathname))) {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
        return;
    }

    // 3. Cache-first — Google Fonts
    if (isFontRequest) {
        event.respondWith(cacheFirst(request, FONT_CACHE));
        return;
    }

    // 4. Network-first — HTML pages, dynamic content
    event.respondWith(networkFirst(request));
});

// ─── Strategies ──────────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
    const cache  = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone()).catch(() => {}); // fire-and-forget
        }
        return response;
    } catch {
        // Offline and not cached — browser will show its own error
        return new Response("Offline", { status: 503, statusText: "Service Unavailable" });
    }
}

async function networkFirst(request) {
    try {
        const response = await fetch(request);
        return response;
    } catch {
        // Network failed — try cache as fallback
        const cached = await caches.match(request);
        if (cached) return cached;
        return new Response("Offline", { status: 503, statusText: "Service Unavailable" });
    }
}
