"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, useSession } from "next-auth/react";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

/**
 * Syncs the backend JWT from the next-auth session into sessionStorage so
 * the axios client interceptor in client.ts can attach it to every request.
 *
 * On page reload the session is "loading" and sessionStorage is empty, which
 * causes a 401 race condition. We fix this by also checking /api/token
 * (which reads the httpOnly cookie) as a bootstrap step on mount.
 */
function SessionSync() {
    const { data: session, status } = useSession();

    // On mount: if sessionStorage is empty, try to bootstrap from the httpOnly cookie
    // via the server-side /api/token route. This covers page refreshes and new tabs.
    React.useEffect(() => {
        if (typeof window === "undefined") return;
        const existing = sessionStorage.getItem("crosspost_jwt");
        if (!existing) {
            fetch("/api/token")
                .then((res) => (res.ok ? res.json() : null))
                .then((data: { token?: string } | null) => {
                    if (data?.token) {
                        sessionStorage.setItem("crosspost_jwt", data.token);
                    }
                })
                .catch(() => undefined); // silent — the 401 interceptor in client.ts will retry
        }
    }, []); // run once on mount

    // Keep sessionStorage in sync as the session evolves
    React.useEffect(() => {
        const token = (session as (typeof session & { backendToken?: string }) | null)
            ?.backendToken;
        if (token) {
            sessionStorage.setItem("crosspost_jwt", token);
        } else if (status === "unauthenticated") {
            // Only clear when we are sure the user is signed out — never during "loading"
            sessionStorage.removeItem("crosspost_jwt");
        }
    }, [session, status]);

    return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <SessionSync />
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </SessionProvider>
    );
}
