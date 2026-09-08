/**
 * Next.js Edge Middleware — route protection via next-auth v5.
 *
 * next-auth v5 exposes `auth` as a middleware wrapper. Unauthenticated
 * requests to protected routes are redirected to /login with ?callbackUrl.
 *
 * Public paths (login, auth API, root redirect) are handled by the matcher
 * exclusion and the auth callback below.
 */
import { auth } from "@/lib/auth";
import type { NextRequest } from "next/server";

export default auth((req: NextRequest & { auth: { user?: unknown } | null }) => {
    const { pathname } = req.nextUrl;

    // Public paths — always allow through
    const isPublic =
        pathname === "/" ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/api/auth");

    if (isPublic) return;

    // If no session, redirect to login
    if (!req.auth?.user) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return Response.redirect(loginUrl);
    }
});

export const config = {
    // Match every route except Next.js internals and static assets
    matcher: [
        "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
