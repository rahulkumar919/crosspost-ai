import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface BackendAuthResponse {
    token: string;
    user: { id: string; email: string; name: string | null };
}

/**
 * POST /api/refresh-backend-token
 *
 * Called when /api/token returns 401 but the user has a valid NextAuth session.
 * Exchanges the NextAuth session email for a fresh backend JWT by calling
 * /auth/login (existing user) or /auth/signup (new Google OAuth user).
 * Stores the result in the httpOnly cookie so subsequent calls to /api/token succeed.
 */
export async function POST() {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const email = session.user.email;
    const name = session.user.name ?? null;
    const googlePassword = `google_oauth_${email}_crosspost_ai`;

    let backendToken: string | null = null;

    // Try login first
    try {
        const res = await axios.post<BackendAuthResponse>(
            `${API_URL}/auth/login`,
            { email, password: googlePassword },
            { timeout: 10_000 }
        );
        backendToken = res.data.token;
    } catch (loginErr) {
        const loginStatus = axios.isAxiosError(loginErr) ? loginErr.response?.status : null;
        if (loginStatus === 401) {
            // User doesn't exist — sign them up
            try {
                const res = await axios.post<BackendAuthResponse>(
                    `${API_URL}/auth/signup`,
                    { email, password: googlePassword, name: name ?? undefined },
                    { timeout: 10_000 }
                );
                backendToken = res.data.token;
            } catch (signupErr) {
                console.error("[refresh-backend-token] signup failed:", signupErr);
            }
        } else {
            console.error("[refresh-backend-token] login failed:", loginErr);
        }
    }

    if (!backendToken) {
        return NextResponse.json(
            { error: "Could not obtain backend token. Is the backend running?" },
            { status: 503 }
        );
    }

    // Store in httpOnly cookie so /api/token picks it up on the next request
    const res = NextResponse.json({ token: backendToken });
    res.cookies.set("crosspost_jwt", backendToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });

    return res;
}
