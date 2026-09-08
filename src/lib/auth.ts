import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import axios from "axios";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "production"
        ? "https://crosspost-bcakend.onrender.com"
        : "http://localhost:4000");

interface BackendAuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string | null;
    };
}

/**
 * Exchanges a Google profile for a CrossPost AI backend JWT.
 * Tries /auth/login first (returning user); falls back to /auth/signup (new user).
 * Logs errors explicitly — never fails silently.
 */
async function getBackendJwt(
    email: string,
    name: string | null
): Promise<{ token: string; userId: string } | null> {
    // Deterministic synthetic password for Google OAuth users.
    // The backend stores this as a real hashed password — never exposed to the user.
    const googlePassword = `google_oauth_${email}_crosspost_ai`;

    // Try login first (existing user)
    try {
        const res = await axios.post<BackendAuthResponse>(
            `${API_URL}/auth/login`,
            { email, password: googlePassword },
            { timeout: 10_000 }
        );
        return { token: res.data.token, userId: res.data.user.id };
    } catch (loginErr) {
        const loginStatus = axios.isAxiosError(loginErr) ? loginErr.response?.status : null;

        // Only attempt signup if the backend explicitly says "invalid credentials" (401)
        if (loginStatus !== 401) {
            console.error("[auth] getBackendJwt login error:", loginErr);
            return null;
        }
    }

    // User doesn't exist yet — auto-create them
    try {
        const res = await axios.post<BackendAuthResponse>(
            `${API_URL}/auth/signup`,
            { email, password: googlePassword, name: name ?? undefined },
            { timeout: 10_000 }
        );
        return { token: res.data.token, userId: res.data.user.id };
    } catch (signupErr) {
        console.error("[auth] getBackendJwt signup error:", signupErr);
        return null;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "crosspost-ai-secret-key-92837498234",
    trustHost: true,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, account, profile }) {
            if (user) {
                token.id = user.id;
            }

            // Google OAuth — exchange for a backend JWT on first sign-in
            if (account?.provider === "google" && profile?.email && !token.backendToken) {
                const result = await getBackendJwt(
                    profile.email,
                    (profile.name as string | null | undefined) ?? null
                );
                if (result) {
                    token.id = result.userId;
                    token.backendToken = result.token;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as { id?: string }).id = token.id as string;
                (session as typeof session & { backendToken?: string }).backendToken =
                    token.backendToken as string | undefined;
            }
            return session;
        },
    },
});
