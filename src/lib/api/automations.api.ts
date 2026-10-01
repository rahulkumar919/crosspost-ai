import apiClient from "./client";

// ─── Enums — must match Prisma schema exactly ─────────────────────────────────

export type AutomationStatus = "DRAFT" | "ACTIVE" | "PAUSED";
export type AutomationChannel = "INSTAGRAM" | "WHATSAPP" | "BOTH";

export type AutomationTriggerType =
    | "INSTAGRAM_DM"
    | "INSTAGRAM_DM_KEYWORD"
    | "INSTAGRAM_COMMENT"
    | "INSTAGRAM_COMMENT_KEYWORD"
    | "WHATSAPP_MESSAGE"
    | "WHATSAPP_KEYWORD";

// Must match Prisma AutomationConditionOperator enum: CONTAINS | EXACT | STARTS_WITH | ANY
export type AutomationConditionOperator = "CONTAINS" | "EXACT" | "STARTS_WITH" | "ANY";

export type AutomationActionType =
    | "SEND_MESSAGE"
    | "SEND_PUBLIC_REPLY"
    | "SEND_PRIVATE_REPLY"
    | "SEND_LINK"
    | "AI_REPLY"
    | "ASSIGN_HUMAN"
    | "TAG_CONVERSATION"
    | "PAUSE_AUTOMATION";

// Must match Prisma AIMode enum: OFF | FIXED_ONLY | FIXED_WITH_AI_FALLBACK | AI_ONLY
export type AIMode = "OFF" | "FIXED_ONLY" | "FIXED_WITH_AI_FALLBACK" | "AI_ONLY";

// ─── Interface Types ──────────────────────────────────────────────────────────

export interface AutomationTrigger {
    id: string;
    type: AutomationTriggerType;
    ig_post_id: string | null;
}

export interface AutomationCondition {
    id: string;
    field: string;
    operator: AutomationConditionOperator;
    value: string;
    case_insensitive: boolean;
}

export interface AutomationAction {
    id: string;
    type: AutomationActionType;
    order: number;
    config: Record<string, unknown>;
}

export interface AutomationExecution {
    id: string;
    automation_id: string;
    conversation_id: string | null;
    external_message_id: string | null;
    channel: string;
    executed_at: string;
    success: boolean;
    error_message: string | null;
    actions_executed: Array<{ type: string; success: boolean; sentText?: string; error?: string }>;
}

export interface Automation {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    channel: AutomationChannel;
    status: AutomationStatus;
    priority: number;
    ai_mode: AIMode;
    cooldown_seconds: number;
    created_at: string;
    updated_at: string;
    triggers: AutomationTrigger[];
    conditions: AutomationCondition[];
    actions: AutomationAction[];
    executions?: AutomationExecution[];
    _count?: { executions: number };
}

export interface AutomationStats {
    total: number;
    active: number;
    paused: number;
    totalExecs: number;
    successExecs: number;
    failedExecs: number;
    aiReplies: number;
    igConversations: number;
    waConversations: number;
}

export interface CreateAutomationInput {
    name: string;
    description?: string;
    channel: AutomationChannel;
    priority?: number;
    ai_mode?: AIMode;
    cooldown_seconds?: number;
    triggers: Array<{ type: AutomationTriggerType; ig_post_id?: string }>;
    conditions: Array<{
        field?: string;
        operator: AutomationConditionOperator;
        value: string;
        case_insensitive?: boolean;
    }>;
    actions: Array<{
        type: AutomationActionType;
        order?: number;
        config: Record<string, unknown>;
    }>;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export async function fetchAutomations(): Promise<Automation[]> {
    const res = await apiClient.get<{ automations: Automation[] }>("/automations");
    return res.data.automations;
}

export async function fetchAutomationStats(): Promise<AutomationStats> {
    const res = await apiClient.get<AutomationStats>("/automations/stats");
    return res.data;
}

export async function fetchAutomation(id: string): Promise<Automation> {
    const res = await apiClient.get<Automation>(`/automations/${id}`);
    return res.data;
}

export async function createAutomation(input: CreateAutomationInput): Promise<Automation> {
    const res = await apiClient.post<Automation>("/automations", input);
    return res.data;
}

export async function updateAutomation(id: string, input: Partial<CreateAutomationInput>): Promise<Automation> {
    const res = await apiClient.patch<Automation>(`/automations/${id}`, input);
    return res.data;
}

export async function deleteAutomation(id: string): Promise<void> {
    await apiClient.delete(`/automations/${id}`);
}

export async function activateAutomation(id: string): Promise<Automation> {
    const res = await apiClient.post<Automation>(`/automations/${id}/activate`);
    return res.data;
}

export async function pauseAutomation(id: string): Promise<Automation> {
    const res = await apiClient.post<Automation>(`/automations/${id}/pause`);
    return res.data;
}

export async function fetchAutomationLogs(id: string, limit = 50): Promise<AutomationExecution[]> {
    const res = await apiClient.get<{ logs: AutomationExecution[] }>(`/automations/${id}/logs`, {
        params: { limit },
    });
    return res.data.logs;
}
