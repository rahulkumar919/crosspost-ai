import apiClient from "./client";

export interface Message {
    id: string;
    conversation_id: string;
    direction: "INBOUND" | "OUTBOUND";
    sender_type: "USER" | "BOT" | "HUMAN_AGENT";
    content: string;
    status: "SENT" | "DELIVERED" | "READ" | "FAILED";
    created_at: string;
}

export interface ConversationTag {
    tag: { id: string; name: string; color: string };
}

export interface Conversation {
    id: string;
    user_id: string;
    channel: "INSTAGRAM" | "WHATSAPP";
    mode: "BOT" | "HUMAN";
    external_user_id: string;
    display_name: string | null;
    avatar_url: string | null;
    unread_count: number;
    is_archived: boolean;
    last_message_at: string | null;
    last_outbound_at: string | null;
    channel_account_id: string;
    created_at: string;
    messages?: Pick<Message, "content" | "sender_type" | "created_at">[];
    tags?: ConversationTag[];
}

export interface InboxStats {
    total: number;
    unread: number;
    humanMode: number;
    igCount: number;
    waCount: number;
}

export interface ConversationListResponse {
    conversations: Conversation[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export async function fetchConversations(params?: {
    channel?: string;
    mode?: string;
    search?: string;
    unread?: boolean;
    page?: number;
    limit?: number;
}): Promise<ConversationListResponse> {
    const res = await apiClient.get<ConversationListResponse>("/conversations", { params });
    return res.data;
}

export async function fetchInboxStats(): Promise<InboxStats> {
    const res = await apiClient.get<InboxStats>("/conversations/stats");
    return res.data;
}

export async function fetchConversationMessages(
    id: string,
    page = 1,
    limit = 50
): Promise<{ messages: Message[]; total: number }> {
    const res = await apiClient.get<{ messages: Message[]; total: number }>(
        `/conversations/${id}/messages`,
        { params: { page, limit } }
    );
    return res.data;
}

export async function sendManualReply(id: string, content: string): Promise<Message> {
    const res = await apiClient.post<Message>(`/conversations/${id}/messages`, { content });
    return res.data;
}

export async function takeoverConversation(id: string): Promise<Conversation> {
    const res = await apiClient.post<Conversation>(`/conversations/${id}/takeover`);
    return res.data;
}

export async function resumeBotConversation(id: string): Promise<Conversation> {
    const res = await apiClient.post<Conversation>(`/conversations/${id}/resume`);
    return res.data;
}
