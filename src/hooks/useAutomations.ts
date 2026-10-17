"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchAutomations,
    fetchAutomationStats,
    fetchAutomation,
    fetchAutomationLogs,
    createAutomation,
    updateAutomation,
    deleteAutomation,
    activateAutomation,
    pauseAutomation,
    type CreateAutomationInput,
} from "@/lib/api/automations.api";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const automationKeys = {
    all:   () => ["automations"] as const,
    stats: () => ["automations", "stats"] as const,
    one:   (id: string) => ["automations", id] as const,
    logs:  (id: string) => ["automations", id, "logs"] as const,
};

// ─── List all automations ─────────────────────────────────────────────────────

export function useAutomations() {
    return useQuery({
        queryKey: automationKeys.all(),
        queryFn:  fetchAutomations,
        staleTime: 30_000,
    });
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export function useAutomationStats() {
    return useQuery({
        queryKey: automationKeys.stats(),
        queryFn:  fetchAutomationStats,
        staleTime: 30_000,
    });
}

// ─── Single automation ────────────────────────────────────────────────────────

export function useAutomation(id: string) {
    return useQuery({
        queryKey: automationKeys.one(id),
        queryFn:  () => fetchAutomation(id),
        enabled:  !!id,
    });
}

// ─── Execution logs ───────────────────────────────────────────────────────────

export function useAutomationLogs(id: string, limit = 50) {
    return useQuery({
        queryKey: automationKeys.logs(id),
        queryFn:  () => fetchAutomationLogs(id, limit),
        enabled:  !!id,
        staleTime: 10_000,
    });
}

// ─── Create ───────────────────────────────────────────────────────────────────

export function useCreateAutomation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateAutomationInput) => createAutomation(input),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: automationKeys.all() });
            void qc.invalidateQueries({ queryKey: automationKeys.stats() });
        },
    });
}

// ─── Update ───────────────────────────────────────────────────────────────────

export function useUpdateAutomation(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: Partial<CreateAutomationInput>) => updateAutomation(id, input),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: automationKeys.one(id) });
            void qc.invalidateQueries({ queryKey: automationKeys.all() });
            void qc.invalidateQueries({ queryKey: automationKeys.stats() });
        },
    });
}

// ─── Activate ─────────────────────────────────────────────────────────────────

export function useActivateAutomation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => activateAutomation(id),
        onSuccess: (_data, id) => {
            void qc.invalidateQueries({ queryKey: automationKeys.one(id) });
            void qc.invalidateQueries({ queryKey: automationKeys.all() });
            void qc.invalidateQueries({ queryKey: automationKeys.stats() });
        },
    });
}

// ─── Pause ────────────────────────────────────────────────────────────────────

export function usePauseAutomation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => pauseAutomation(id),
        onSuccess: (_data, id) => {
            void qc.invalidateQueries({ queryKey: automationKeys.one(id) });
            void qc.invalidateQueries({ queryKey: automationKeys.all() });
            void qc.invalidateQueries({ queryKey: automationKeys.stats() });
        },
    });
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export function useDeleteAutomation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteAutomation(id),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: automationKeys.all() });
            void qc.invalidateQueries({ queryKey: automationKeys.stats() });
        },
    });
}

// ─── Convenience: full mutations bundle ──────────────────────────────────────
// Lets you destructure just what you need from a single hook call.

export function useAutomationMutations() {
    const create   = useCreateAutomation();
    const activate = useActivateAutomation();
    const pause    = usePauseAutomation();
    const remove   = useDeleteAutomation();

    const toggle = React.useCallback(async (id: string, shouldActivate: boolean) => {
        if (shouldActivate) {
            return activate.mutateAsync(id);
        } else {
            return pause.mutateAsync(id);
        }
    }, [activate, pause]);

    return {
        createMutation:  create,
        activateMutation: activate,
        pauseMutation:   pause,
        deleteMutation:  remove,
        toggle,
        isTogglingId: activate.isPending ? activate.variables : pause.isPending ? pause.variables : null,
        isDeletingId: remove.isPending ? remove.variables : null,
    };
}
