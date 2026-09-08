"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
    fetchConnectedAccounts,
    connectAccount,
    disconnectAccount,
} from "@/lib/api/accounts.api";
import { useAccountsStore } from "@/store/useAccountsStore";
import type { Platform } from "@/types/account.types";

export function useConnectedAccounts() {
    const { status } = useSession();
    const setAccounts = useAccountsStore((s) => s.setAccounts);
    const removeAccount = useAccountsStore((s) => s.removeAccount);
    const queryClient = useQueryClient();

    // Only fetch once the session is confirmed authenticated.
    // This ensures the JWT has been written to sessionStorage by SessionSync
    // before the axios interceptor in client.ts tries to attach it.
    const query = useQuery({
        queryKey: ["accounts"],
        queryFn: async () => {
            const accounts = await fetchConnectedAccounts();
            setAccounts(accounts);
            return accounts;
        },
        staleTime: 30_000,
        enabled: status === "authenticated",
    });

    const connectMutation = useMutation({
        mutationFn: (platform: Platform) => connectAccount(platform),
        // onSuccess never fires — connectAccount navigates the browser away (OAuth flow).
        // The new account is picked up when the backend redirects back to /accounts,
        // which triggers a fresh query via the ?connected= param handler in accounts page.
    });

    const disconnectMutation = useMutation({
        mutationFn: (platform: Platform) => disconnectAccount(platform),
        onSuccess: (_, platform) => {
            removeAccount(platform);
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
    });

    return {
        accounts: query.data ?? [],
        // Also show loading while the session is resolving (before the query is enabled)
        isLoading: status === "loading" || query.isLoading,
        isError: query.isError,
        connectError: connectMutation.error,
        connect: connectMutation.mutate,
        disconnect: disconnectMutation.mutate,
        isConnecting: connectMutation.isPending,
        isDisconnecting: disconnectMutation.isPending,
        connectingPlatform: connectMutation.variables,
        disconnectingPlatform: disconnectMutation.variables,
    };
}
