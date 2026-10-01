"use client";

import * as React from "react";
import {
    MessageCircle, Search, Camera, Phone, Bot, User2,
    Send, RefreshCw, Inbox, X,
    CheckCheck, Circle, ArrowLeft, Sparkles, AlertCircle,
} from "lucide-react";
import {
    fetchConversations,
    fetchInboxStats,
    fetchConversationMessages,
    sendManualReply,
    takeoverConversation,
    resumeBotConversation,
    type Conversation,
    type Message,
    type InboxStats,
} from "@/lib/api/conversations.api";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string | null): string {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "now";
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
}

function getInitials(name: string | null): string {
    if (!name) return "?";
    return name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div
            className="flex flex-col items-center justify-center rounded-2xl px-4 py-3 flex-1"
            style={{ background: "var(--surface)", border: "1px solid var(--border-color)" }}
        >
            <span className="text-xl font-black" style={{ color }}>{value}</span>
            <span className="text-[10px] font-semibold mt-0.5" style={{ color: "var(--foreground-muted)" }}>{label}</span>
        </div>
    );
}

interface ConversationItemProps {
    conv: Conversation;
    active: boolean;
    onClick: () => void;
}

function ConversationItem({ conv, active, onClick }: ConversationItemProps) {
    const lastMsg = conv.messages?.[0];
    const isIg = conv.channel === "INSTAGRAM";

    return (
        <button
            onClick={onClick}
            className="w-full flex items-start gap-3 px-4 py-3 transition-all duration-150 text-left border-b"
            style={{
                background: active ? "rgba(108,92,231,0.12)" : "transparent",
                borderColor: "var(--border-color)",
                borderLeft: active ? "3px solid #6C5CE7" : "3px solid transparent",
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--surface-elevated)"; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
        >
            {/* Avatar */}
            <div className="relative shrink-0">
                {conv.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={conv.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                    <div
                        className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-black text-white"
                        style={{ background: isIg ? "linear-gradient(135deg,#f472b6,#a78bfa)" : "linear-gradient(135deg,#10B981,#3B82F6)" }}
                    >
                        {getInitials(conv.display_name)}
                    </div>
                )}
                {/* Channel badge */}
                <div
                    className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full flex items-center justify-center"
                    style={{ background: isIg ? "#e1306c" : "#25D366", border: "2px solid var(--surface)" }}
                >
                    {isIg
                        ? <Camera className="h-2 w-2 text-white" />
                        : <Phone className="h-2 w-2 text-white" />}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-bold truncate" style={{ color: "var(--foreground-color)" }}>
                        {conv.display_name || conv.external_user_id}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                        {conv.mode === "HUMAN" && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>
                                HUMAN
                            </span>
                        )}
                        <span className="text-[10px]" style={{ color: "var(--foreground-muted)" }}>
                            {timeAgo(conv.last_message_at)}
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-between gap-1 mt-0.5">
                    <p className="text-xs truncate" style={{ color: "var(--foreground-muted)" }}>
                        {lastMsg ? lastMsg.content : "No messages yet"}
                    </p>
                    {conv.unread_count > 0 && (
                        <span
                            className="shrink-0 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-black text-white px-1"
                            style={{ background: "#6C5CE7" }}
                        >
                            {conv.unread_count}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
}

interface MessageBubbleProps {
    msg: Message;
}

function MessageBubble({ msg }: MessageBubbleProps) {
    const isOutbound = msg.direction === "OUTBOUND";
    const isBot = msg.sender_type === "BOT";

    return (
        <div className={`flex ${isOutbound ? "justify-end" : "justify-start"} mb-3`}>
            {!isOutbound && (
                <div
                    className="h-7 w-7 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1"
                    style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-color)" }}
                >
                    <User2 className="h-3.5 w-3.5" style={{ color: "var(--foreground-muted)" }} />
                </div>
            )}
            <div className={`flex flex-col ${isOutbound ? "items-end" : "items-start"} max-w-[75%]`}>
                {isOutbound && isBot && (
                    <span className="flex items-center gap-1 text-[9px] font-bold mb-0.5 px-1" style={{ color: "#a78bfa" }}>
                        <Bot className="h-2.5 w-2.5" /> AI Bot
                    </span>
                )}
                {isOutbound && !isBot && (
                    <span className="text-[9px] font-bold mb-0.5 px-1" style={{ color: "#F59E0B" }}>You</span>
                )}
                <div
                    className="px-3 py-2 rounded-2xl text-sm leading-relaxed"
                    style={
                        isOutbound
                            ? {
                                background: isBot
                                    ? "linear-gradient(135deg,#6C5CE7,#a29bfe)"
                                    : "linear-gradient(135deg,#F59E0B,#F97316)",
                                color: "#fff",
                                borderBottomRightRadius: "4px",
                            }
                            : {
                                background: "var(--surface-elevated)",
                                color: "var(--foreground-color)",
                                border: "1px solid var(--border-color)",
                                borderBottomLeftRadius: "4px",
                            }
                    }
                >
                    {msg.content}
                </div>
                <span className="text-[9px] mt-0.5 px-1" style={{ color: "var(--foreground-muted)" }}>
                    {timeAgo(msg.created_at)}
                    {isOutbound && msg.status === "DELIVERED" && (
                        <CheckCheck className="inline ml-1 h-3 w-3 text-emerald-400" />
                    )}
                    {isOutbound && msg.status === "FAILED" && (
                        <span className="ml-1 text-red-400">✗</span>
                    )}
                </span>
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function InboxPage() {
    const [stats, setStats] = React.useState<InboxStats | null>(null);
    const [conversations, setConversations] = React.useState<Conversation[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [loadError, setLoadError] = React.useState<string | null>(null);
    const [search, setSearch] = React.useState("");
    const [channelFilter, setChannelFilter] = React.useState<"" | "INSTAGRAM" | "WHATSAPP">("");
    const [modeFilter, setModeFilter] = React.useState<"" | "BOT" | "HUMAN">("");
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [msgLoading, setMsgLoading] = React.useState(false);
    const [replyText, setReplyText] = React.useState("");
    const [sending, setSending] = React.useState(false);
    const [showChat, setShowChat] = React.useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const selectedConv = conversations.find((c) => c.id === selectedId) ?? null;

    // ── Load conversations ───────────────────────────────────────────────────
    const loadConversations = React.useCallback(async () => {
        setRefreshing(true);
        setLoadError(null);
        try {
            const [statsData, convsData] = await Promise.all([
                fetchInboxStats(),
                fetchConversations({
                    search: search || undefined,
                    channel: channelFilter || undefined,
                    mode: modeFilter || undefined,
                }),
            ]);
            setStats(statsData);
            setConversations(convsData.conversations);
        } catch (err) {
            setLoadError(err instanceof Error ? err.message : "Failed to load conversations. Please try again.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [search, channelFilter, modeFilter]);

    React.useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    // ── Load messages ────────────────────────────────────────────────────────
    React.useEffect(() => {
        if (!selectedId) return;
        setMsgLoading(true);
        fetchConversationMessages(selectedId)
            .then((data) => {
                setMessages(data.messages);
            })
            .catch(() => setMessages([]))
            .finally(() => setMsgLoading(false));
    }, [selectedId]);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ── Actions ──────────────────────────────────────────────────────────────
    const handleSelect = (id: string) => {
        setSelectedId(id);
        setShowChat(true);
        setReplyText("");
    };

    const handleSend = async () => {
        if (!selectedId || !replyText.trim()) return;
        setSending(true);
        try {
            const msg = await sendManualReply(selectedId, replyText.trim());
            setMessages((prev) => [...prev, msg]);
            setReplyText("");
        } catch {
            // no-op
        } finally {
            setSending(false);
        }
    };

    const handleTakeover = async () => {
        if (!selectedId) return;
        try {
            const updated = await takeoverConversation(selectedId);
            setConversations((prev) =>
                prev.map((c) => (c.id === selectedId ? { ...c, mode: updated.mode } : c))
            );
        } catch {
            // no-op
        }
    };

    const handleResumeBot = async () => {
        if (!selectedId) return;
        try {
            const updated = await resumeBotConversation(selectedId);
            setConversations((prev) =>
                prev.map((c) => (c.id === selectedId ? { ...c, mode: updated.mode } : c))
            );
        } catch {
            // no-op
        }
    };

    // ── Empty/loading states ──────────────────────────────────────────────────

    const renderEmptyState = () => (
        <div className="flex flex-col items-center justify-center flex-1 py-20">
            <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "linear-gradient(135deg,#6C5CE7,#a29bfe)", boxShadow: "0 8px 28px rgba(108,92,231,0.3)" }}
            >
                <Inbox className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-lg font-black mb-2" style={{ color: "var(--foreground-color)" }}>
                No conversations yet
            </h2>
            <p className="text-sm text-center max-w-xs leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                Connect your Instagram or WhatsApp account and set up automations to start receiving DMs here.
            </p>
        </div>
    );

    return (
        <div
            className="flex flex-col flex-1 min-h-0"
            style={{ background: "var(--background)", height: "calc(100dvh - 0px)" }}
        >
            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="px-4 sm:px-6 pt-5 pb-3 shrink-0">
                <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2"
                    style={{ background: "rgba(108,92,231,0.12)", border: "1px solid rgba(108,92,231,0.25)", color: "#a29bfe" }}
                >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>UNIFIED INBOX</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: "var(--foreground-color)" }}>
                            Inbox{" "}
                            <span style={{ background: "linear-gradient(135deg,#6C5CE7,#a29bfe)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                &amp; DMs
                            </span>
                        </h1>
                        <p className="text-xs sm:text-sm mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                            Manage all your Instagram &amp; WhatsApp conversations in one place.
                        </p>
                    </div>
                    <button
                        onClick={loadConversations}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95 shrink-0"
                        style={{ background: "var(--surface)", border: "1px solid var(--border-color)", color: "var(--foreground-muted)" }}
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                </div>

                {/* Stats row */}
                {stats && (
                    <div className="flex gap-3 mt-4">
                        <StatCard label="Total" value={stats.total} color="#a29bfe" />
                        <StatCard label="Unread" value={stats.unread} color="#F59E0B" />
                        <StatCard label="Human Mode" value={stats.humanMode} color="#ec4899" />
                        <StatCard label="Instagram" value={stats.igCount} color="#e1306c" />
                        <StatCard label="WhatsApp" value={stats.waCount} color="#25D366" />
                    </div>
                )}

                {/* Error banner */}
                {loadError && (
                    <div
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 mt-4"
                        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}
                    >
                        <AlertCircle className="h-4 w-4 shrink-0" style={{ color: "#EF4444" }} />
                        <p className="text-sm flex-1" style={{ color: "#EF4444" }}>{loadError}</p>
                        <button
                            onClick={loadConversations}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
                            style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}
                        >
                            <RefreshCw className="h-3 w-3" />
                            Retry
                        </button>
                    </div>
                )}
            </div>

            {/* ── Main content ──────────────────────────────────────────────── */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
                {/* ── Conversation list (left panel) ── */}
                <div
                    className={`flex flex-col shrink-0 border-r ${showChat ? "hidden lg:flex" : "flex"}`}
                    style={{ width: "340px", borderColor: "var(--border-color)", background: "var(--surface)" }}
                >
                    {/* Search + filters */}
                    <div className="p-3 space-y-2 border-b" style={{ borderColor: "var(--border-color)" }}>
                        <div
                            className="flex items-center gap-2 rounded-xl px-3 py-2"
                            style={{ background: "var(--background)", border: "1px solid var(--border-color)" }}
                        >
                            <Search className="h-4 w-4 shrink-0" style={{ color: "var(--foreground-muted)" }} />
                            <input
                                id="inbox-search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search conversations..."
                                className="flex-1 text-sm outline-none bg-transparent"
                                style={{ color: "var(--foreground-color)" }}
                            />
                            {search && (
                                <button onClick={() => setSearch("")}>
                                    <X className="h-3.5 w-3.5" style={{ color: "var(--foreground-muted)" }} />
                                </button>
                            )}
                        </div>

                        {/* Filter pills */}
                        <div className="flex gap-2 flex-wrap">
                            {(["", "INSTAGRAM", "WHATSAPP"] as const).map((ch) => (
                                <button
                                    key={ch}
                                    onClick={() => setChannelFilter(ch)}
                                    className="px-2.5 py-1 rounded-full text-[11px] font-bold transition-all"
                                    style={
                                        channelFilter === ch
                                            ? { background: "#6C5CE7", color: "#fff" }
                                            : { background: "var(--surface-elevated)", color: "var(--foreground-muted)", border: "1px solid var(--border-color)" }
                                    }
                                >
                                    {ch === "" ? "All" : ch === "INSTAGRAM" ? "Instagram" : "WhatsApp"}
                                </button>
                            ))}
                            {(["", "BOT", "HUMAN"] as const).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setModeFilter(mode)}
                                    className="px-2.5 py-1 rounded-full text-[11px] font-bold transition-all"
                                    style={
                                        modeFilter === mode
                                            ? { background: "#F59E0B", color: "#fff" }
                                            : { background: "var(--surface-elevated)", color: "var(--foreground-muted)", border: "1px solid var(--border-color)" }
                                    }
                                >
                                    {mode === "" ? "All modes" : mode === "BOT" ? "🤖 Bot" : "👤 Human"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Conversation list */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <RefreshCw className="h-5 w-5 animate-spin" style={{ color: "#6C5CE7" }} />
                            </div>
                        ) : conversations.length === 0 ? (
                            renderEmptyState()
                        ) : (
                            conversations.map((conv) => (
                                <ConversationItem
                                    key={conv.id}
                                    conv={conv}
                                    active={selectedId === conv.id}
                                    onClick={() => handleSelect(conv.id)}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* ── Chat panel (right) ── */}
                <div
                    className={`flex flex-col flex-1 min-h-0 min-w-0 ${showChat ? "flex" : "hidden lg:flex"}`}
                    style={{ background: "var(--background)" }}
                >
                    {!selectedConv ? (
                        /* No conversation selected */
                        <div className="flex flex-col items-center justify-center flex-1 gap-4">
                            <div
                                className="h-20 w-20 rounded-3xl flex items-center justify-center"
                                style={{ background: "var(--surface)", border: "2px dashed var(--border-color)" }}
                            >
                                <MessageCircle className="h-8 w-8" style={{ color: "var(--foreground-muted)" }} />
                            </div>
                            <div className="text-center">
                                <p className="text-base font-black" style={{ color: "var(--foreground-color)" }}>
                                    Select a conversation
                                </p>
                                <p className="text-sm mt-1" style={{ color: "var(--foreground-muted)" }}>
                                    Pick a DM from the left panel to start chatting.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Chat header */}
                            <div
                                className="flex items-center gap-3 px-4 py-3 border-b shrink-0"
                                style={{ borderColor: "var(--border-color)", background: "var(--surface)" }}
                            >
                                <button
                                    className="lg:hidden mr-1"
                                    onClick={() => setShowChat(false)}
                                    style={{ color: "var(--foreground-muted)" }}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </button>

                                {selectedConv.avatar_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={selectedConv.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover shrink-0" />
                                ) : (
                                    <div
                                        className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
                                        style={{ background: selectedConv.channel === "INSTAGRAM" ? "linear-gradient(135deg,#f472b6,#a78bfa)" : "linear-gradient(135deg,#10B981,#3B82F6)" }}
                                    >
                                        {getInitials(selectedConv.display_name)}
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black truncate" style={{ color: "var(--foreground-color)" }}>
                                        {selectedConv.display_name || selectedConv.external_user_id}
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                        {selectedConv.channel === "INSTAGRAM"
                                            ? <Camera className="h-3 w-3" style={{ color: "#e1306c" }} />
                                            : <Phone className="h-3 w-3" style={{ color: "#25D366" }} />}
                                        <span className="text-[11px]" style={{ color: "var(--foreground-muted)" }}>
                                            {selectedConv.channel === "INSTAGRAM" ? "Instagram" : "WhatsApp"}
                                        </span>
                                        <span className="text-[11px]" style={{ color: "var(--foreground-muted)" }}>·</span>
                                        {selectedConv.mode === "BOT"
                                            ? <><Bot className="h-3 w-3" style={{ color: "#a29bfe" }} /><span className="text-[11px]" style={{ color: "#a29bfe" }}>Bot mode</span></>
                                            : <><User2 className="h-3 w-3" style={{ color: "#F59E0B" }} /><span className="text-[11px]" style={{ color: "#F59E0B" }}>Human mode</span></>
                                        }
                                    </div>
                                </div>

                                {/* Mode toggle buttons */}
                                <div className="flex gap-2 shrink-0">
                                    {selectedConv.mode === "BOT" ? (
                                        <button
                                            onClick={handleTakeover}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-95"
                                            style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", color: "#F59E0B" }}
                                        >
                                            <User2 className="h-3.5 w-3.5" />
                                            <span className="hidden sm:inline">Take Over</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleResumeBot}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-95"
                                            style={{ background: "rgba(108,92,231,0.12)", border: "1px solid rgba(108,92,231,0.25)", color: "#a29bfe" }}
                                        >
                                            <Bot className="h-3.5 w-3.5" />
                                            <span className="hidden sm:inline">Resume Bot</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-4 py-4" style={{ minHeight: 0 }}>
                                {msgLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <RefreshCw className="h-5 w-5 animate-spin" style={{ color: "#6C5CE7" }} />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                                        <Circle className="h-10 w-10" style={{ color: "var(--border-color)" }} />
                                        <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                                            No messages yet in this conversation.
                                        </p>
                                    </div>
                                ) : (
                                    messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Reply input */}
                            <div
                                className="px-4 py-3 border-t shrink-0"
                                style={{ borderColor: "var(--border-color)", background: "var(--surface)" }}
                            >
                                {selectedConv.mode === "BOT" && (
                                    <div
                                        className="mb-2 flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
                                        style={{ background: "rgba(108,92,231,0.1)", border: "1px solid rgba(108,92,231,0.2)", color: "#a29bfe" }}
                                    >
                                        <Bot className="h-3.5 w-3.5" />
                                        <span>Bot is handling this conversation. Take over to reply manually.</span>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <div
                                        className="flex-1 flex items-end gap-2 rounded-2xl px-4 py-2.5"
                                        style={{ background: "var(--background)", border: "1px solid var(--border-color)" }}
                                    >
                                        <textarea
                                            id="reply-input"
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Type a reply..."
                                            rows={1}
                                            disabled={selectedConv.mode === "BOT"}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSend();
                                                }
                                            }}
                                            className="flex-1 text-sm outline-none bg-transparent resize-none leading-relaxed"
                                            style={{
                                                color: "var(--foreground-color)",
                                                maxHeight: "120px",
                                                opacity: selectedConv.mode === "BOT" ? 0.4 : 1,
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={handleSend}
                                        disabled={!replyText.trim() || sending || selectedConv.mode === "BOT"}
                                        className="h-11 w-11 rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shrink-0 self-end"
                                        style={{
                                            background: !replyText.trim() || sending || selectedConv.mode === "BOT"
                                                ? "var(--surface-elevated)"
                                                : "linear-gradient(135deg,#6C5CE7,#a29bfe)",
                                            boxShadow: !replyText.trim() ? "none" : "0 4px 14px rgba(108,92,231,0.35)",
                                        }}
                                    >
                                        {sending
                                            ? <RefreshCw className="h-4 w-4 animate-spin text-white" />
                                            : <Send className="h-4 w-4 text-white" />}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
