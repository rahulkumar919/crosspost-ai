import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import axios from "axios";

// NEXT_PUBLIC_ vars are inlined at build time — they are undefined at runtime on the server.
// Use a dedicated server-only env var (BACKEND_URL) with a safe production fallback.
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
 * Called when /api/token returns 401 but the user has a valid NextAuth session.
 * Exchanges the NextAuth session email for a fresh backend JWT by calling
 * /auth/login (existing user) or /auth/signup (new Google OAuth user).
 * Stores the result in the httpOnly cookie so subsequent calls to /api/token succeed.
 *
 * NOTE: Render free tier sleeps after inactivity. The 55s timeout gives it
 * time to cold-start (typically 30–50s). We ping /health first to wake it.
 */
export async function POST() {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const email = session.user.email;
    const name = session.user.name ?? null;
    const googlePassword = `google_oauth_${email}_crosspost_ai`;

    // ─── Step 1: Wake up Render (free tier cold start) ────────────────────────
    // Ping /health/ping (instant 200) to give Render time to boot before the auth call.
    // /health/ping is a lightweight endpoint that doesn't touch DB/AI/Cloudinary.
    // Vercel hobby plan allows up to 60s execution time.
    try {
        await axios.get(`${API_URL}/health/ping`, { timeout: 55_000 });
    } catch {
        // Ignore — even if /health/ping times out we still attempt auth below
    }

    let backendToken: string | null = null;

    // ─── Step 2: Try login (existing user) ───────────────────────────────────
    try {
        const res = await axios.post<BackendAuthResponse>(
            `${API_URL}/auth/login`,
            { email, password: googlePassword },
            { timeout: 55_000 }
        );
        backendToken = res.data.token;
    } catch (loginErr) {
        const loginStatus = axios.isAxiosError(loginErr) ? loginErr.response?.status : null;
        if (loginStatus === 401) {
            // User doesn't exist yet — auto-create them
            try {
                const res = await axios.post<BackendAuthResponse>(
                    `${API_URL}/auth/signup`,
                    { email, password: googlePassword, name: name ?? undefined },
                    { timeout: 55_000 }
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
        // retryable:true tells the client to show "Server starting…" rather than "Session expired"
        return NextResponse.json(
            {
                error: "Backend server is starting up. Please wait a moment and try again.",
                retryable: true,
            },
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
