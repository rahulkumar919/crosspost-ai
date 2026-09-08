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
 */
function SessionSync() {
    const { data: session, status } = useSession();

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
