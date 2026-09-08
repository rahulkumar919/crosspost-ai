import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * GET /api/token
 *
 * Returns the backend JWT. Checks in this order:
 * 1. The httpOnly cookie set by /api/set-token (email+OTP login flow)
 * 2. The backendToken from the NextAuth session (Google OAuth login flow)
 *
 * This is called by the axios client interceptor so every API request
 * gets the correct Authorization header without any sessionStorage race condition.
 */
export async function GET() {
    // 1. Check httpOnly cookie (email+OTP flow)
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get("crosspost_jwt")?.value;
    if (cookieToken) {
        return NextResponse.json({ token: cookieToken });
    }

    // 2. Fall back to NextAuth session (Google OAuth flow)
    const session = await auth();
    const sessionToken = (session as (typeof session & { backendToken?: string }) | null)
        ?.backendToken;

    if (!sessionToken) {
        return NextResponse.json({ token: null }, { status: 401 });
    }

    return NextResponse.json({ token: sessionToken });
}

