import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import axios from "axios";

const API_URL =
    process.env.BACKEND_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    (process.env.NODE_ENV === "production"
        ? "https://crosspost-bcakend.onrender.com"
        : "http://localhost:4000");

interface BackendAuthResponse {
    token: string;
    user: { id: string; email: string; name: string | null };
}

/**
 * POST /api/refresh-backend-token
 *
 * Exchanges the NextAuth Google session for a backend JWT.
 *
 * Uses /auth/google which upserts the user — always succeeds whether the
 * account was created via OTP, Google OAuth, or is brand new. This eliminates
 * the login→signup→503 failure loop that occurred when a user signed up via
 * OTP email and then logged in again via Google OAuth.
 */
export async function POST() {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const email = session.user.email;
    const name = session.user.name ?? null;

    // Wake up Render free tier (no-op when running locally)
    try {
        await axios.get(`${API_URL}/health/ping`, { timeout: 10_000 });
    } catch {
        // ignore — still attempt auth even if ping times out
    }

    let backendToken: string | null = null;

    // ── Primary: /auth/google upsert (always works) ──────────────────────────
    try {
        const res = await axios.post<BackendAuthResponse>(
            `${API_URL}/auth/google`,
            { email, name },
            { timeout: 30_000 }
        );
        backendToken = res.data.token;
    } catch (upsertErr) {
        // Fallback: try legacy login in case /auth/google isn't deployed yet
        const upsertStatus = axios.isAxiosError(upsertErr) ? upsertErr.response?.status : null;
        console.warn("[refresh-backend-token] /auth/google failed with status:", upsertStatus, "— trying legacy login/signup");

        const googlePassword = `google_oauth_${email}_crosspost_ai`;

        try {
            const loginRes = await axios.post<BackendAuthResponse>(
                `${API_URL}/auth/login`,
                { email, password: googlePassword },
                { timeout: 30_000 }
            );
            backendToken = loginRes.data.token;
        } catch (loginErr) {
            const loginStatus = axios.isAxiosError(loginErr) ? loginErr.response?.status : null;

            if (loginStatus === 401) {
                // Account doesn't exist — create it
                try {
                    const signupRes = await axios.post<BackendAuthResponse>(
                        `${API_URL}/auth/signup`,
                        { email, password: googlePassword, name: name ?? undefined },
                        { timeout: 30_000 }
                    );
                    backendToken = signupRes.data.token;
                } catch (signupErr) {
                    const signupStatus = axios.isAxiosError(signupErr) ? signupErr.response?.status : null;
                    console.error("[refresh-backend-token] signup failed:", signupStatus, signupErr);
                }
            } else {
                console.error("[refresh-backend-token] login failed:", loginStatus, loginErr);
            }
        }
    }

    if (!backendToken) {
        return NextResponse.json(
            {
                error: "Could not authenticate with backend. Please try again.",
                retryable: true,
            },
            { status: 503 }
        );
    }

    const response = NextResponse.json({ token: backendToken });
    response.cookies.set("crosspost_jwt", backendToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });

    return response;
}
