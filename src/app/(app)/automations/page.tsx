"use client";

import * as React from "react";
import {
    Zap, Plus, Play, Pause, Trash2,
    Bot, MessageCircle, RefreshCw, CheckCircle2,
    Clock, Camera, Phone, Sparkles, X, Check,
    BarChart2, Activity, ChevronDown, ChevronUp,
    AlertCircle, CheckCheck, Users, MessageSquare,
} from "lucide-react";
import {
    fetchAutomations,
    fetchAutomationStats,
    fetchAutomationLogs,
    createAutomation,
    updateAutomation,
    deleteAutomation,
    activateAutomation,
    pauseAutomation,
    type Automation,
    type AutomationExecution,
    type AutomationStats,
    type CreateAutomationInput,
    type AutomationChannel,
    type AutomationTriggerType,
    type AutomationConditionOperator,
    type AutomationActionType,
} from "@/lib/api/automations.api";

// ─── Label Maps ───────────────────────────────────────────────────────────────

const TRIGGER_LABELS: Record<AutomationTriggerType, string> = {
    INSTAGRAM_DM: "Any Instagram DM",
    INSTAGRAM_DM_KEYWORD: "Instagram DM with keyword",
    INSTAGRAM_COMMENT: "Any Instagram comment",
    INSTAGRAM_COMMENT_KEYWORD: "Instagram comment with keyword",
    WHATSAPP_MESSAGE: "Any WhatsApp message",
    WHATSAPP_KEYWORD: "WhatsApp message with keyword",
};

const ACTION_LABELS: Record<AutomationActionType, string> = {
    SEND_MESSAGE: "Send fixed message",
    SEND_PUBLIC_REPLY: "Reply publicly (comment)",
    SEND_PRIVATE_REPLY: "Send private DM reply",
    SEND_LINK: "Send message with link",
    AI_REPLY: "AI-generated reply",
    ASSIGN_HUMAN: "Hand off to human agent",
    TAG_CONVERSATION: "Tag conversation",
    PAUSE_AUTOMATION: "Pause automation for this conversation",
};

const OPERATOR_LABELS: Record<AutomationConditionOperator, string> = {
    CONTAINS: "contains",
    EXACT: "exactly equals",
    STARTS_WITH: "starts with",
    ANY: "any message",
};

// Triggers available per channel selection
const TRIGGERS_BY_CHANNEL: Record<AutomationChannel, AutomationTriggerType[]> = {
    INSTAGRAM: ["INSTAGRAM_DM", "INSTAGRAM_DM_KEYWORD", "INSTAGRAM_COMMENT", "INSTAGRAM_COMMENT_KEYWORD"],
    WHATSAPP: ["WHATSAPP_MESSAGE", "WHATSAPP_KEYWORD"],
    BOTH: ["INSTAGRAM_DM", "INSTAGRAM_DM_KEYWORD", "WHATSAPP_MESSAGE", "WHATSAPP_KEYWORD"],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

function channelIcon(channel: AutomationChannel) {
    if (channel === "WHATSAPP") return <Phone className="h-5 w-5" style={{ color: "#25D366" }} />;
    if (channel === "BOTH") return <MessageSquare className="h-5 w-5" style={{ color: "#a29bfe" }} />;
    return <Camera className="h-5 w-5" style={{ color: "#e1306c" }} />;
}

function channelBg(channel: AutomationChannel) {
    if (channel === "WHATSAPP") return "rgba(37,211,102,0.12)";
    if (channel === "BOTH") return "rgba(108,92,231,0.12)";
    return "rgba(225,48,108,0.12)";
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color }: {
    label: string; value: number; icon: React.ElementType; color: string;
}) {
    return (
        <div
            className="flex flex-col gap-1 rounded-2xl p-4 flex-1"
            style={{ background: "var(--surface)", border: "1px solid var(--border-color)" }}
        >
            <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                    <Icon className="h-3.5 w-3.5" style={{ color }} />
                </div>
                <span className="text-xs font-semibold" style={{ color: "var(--foreground-muted)" }}>{label}</span>
            </div>
            <span className="text-2xl font-black" style={{ color: "var(--foreground-color)" }}>{value}</span>
        </div>
    );
}

// ─── Execution Logs Panel ─────────────────────────────────────────────────────

function LogsPanel({ automationId, onClose }: { automationId: string; onClose: () => void }) {
    const [logs, setLogs] = React.useState<AutomationExecution[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setLoading(true);
        fetchAutomationLogs(automationId, 20)
            .then(setLogs)
            .catch(() => setLogs([]))
            .finally(() => setLoading(false));
    }, [automationId]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
                style={{ background: "var(--surface)", border: "1px solid var(--border-color)" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border-color)" }}>
                    <div>
                        <h2 className="text-lg font-black" style={{ color: "var(--foreground-color)" }}>Execution Logs</h2>
                        <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>Last 20 runs for this automation</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 rounded-xl flex items-center justify-center transition-all hover:bg-red-500/10"
                        style={{ color: "var(--foreground-muted)" }}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto space-y-3">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="h-5 w-5 animate-spin" style={{ color: "#6C5CE7" }} />
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Activity className="h-8 w-8 mb-3" style={{ color: "var(--foreground-muted)" }} />
                            <p className="text-sm font-semibold" style={{ color: "var(--foreground-muted)" }}>No executions yet</p>
                            <p className="text-xs mt-1" style={{ color: "var(--foreground-muted)" }}>This automation hasn&apos;t run yet. Activate it to start tracking runs.</p>
                        </div>
                    ) : (
                        logs.map((log) => (
                            <div
                                key={log.id}
                                className="rounded-xl p-4"
                                style={{
                                    background: "var(--background)",
                                    border: `1px solid ${log.success ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                                }}
                            >
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <div className="flex items-center gap-2">
                                        {log.success
                                            ? <CheckCheck className="h-4 w-4 shrink-0" style={{ color: "#10B981" }} />
                                            : <AlertCircle className="h-4 w-4 shrink-0" style={{ color: "#EF4444" }} />}
                                        <span className="text-xs font-bold" style={{ color: log.success ? "#10B981" : "#EF4444" }}>
                                            {log.success ? "Success" : "Failed"}
                                        </span>
                                        <span className="text-xs" style={{ color: "var(--foreground-muted)" }}>· {log.channel}</span>
                                    </div>
                                    <span className="text-xs" style={{ color: "var(--foreground-muted)" }}>{timeAgo(log.executed_at)}</span>
                                </div>

                                {/* Actions executed */}
                                {log.actions_executed.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {log.actions_executed.map((a, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                                                style={
                                                    a.success
                                                        ? { background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }
                                                        : { background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }
                                                }
                                            >
                                                {a.type}{a.error ? ` — ${a.error}` : ""}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Sent text preview */}
                                {log.actions_executed.some(a => a.sentText) && (
                                    <p className="text-[11px] mt-2 px-3 py-1.5 rounded-lg leading-relaxed" style={{ background: "var(--surface)", color: "var(--foreground-muted)" }}>
                                        &ldquo;{log.actions_executed.find(a => a.sentText)?.sentText}&rdquo;
                                    </p>
                                )}

                                {/* Error message */}
                                {log.error_message && (
                                    <p className="text-[11px] mt-2" style={{ color: "#EF4444" }}>{log.error_message}</p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Automation Card ──────────────────────────────────────────────────────────

interface AutomationCardProps {
    automation: Automation;
    onToggle: (id: string, activate: boolean) => void;
    onDelete: (id: string) => void;
    onViewLogs: (id: string) => void;
    onEdit: (id: string) => void;
    deleting: string | null;
    toggling: string | null;
}

function AutomationCard({ automation, onToggle, onDelete, onViewLogs, onEdit, deleting, toggling }: AutomationCardProps) {
    const isActive = automation.status === "ACTIVE";
    const execCount = automation._count?.executions ?? 0;
    const [expanded, setExpanded] = React.useState(false);

    // Find the ig_post_id from triggers for thumbnail display
    const igPostId = automation.triggers.find((t) => t.ig_post_id)?.ig_post_id ?? null;
    const [thumbUrl, setThumbUrl] = React.useState<string | null>(null);
    React.useEffect(() => {
        if (!igPostId) return;
        import("@/lib/api/accounts.api").then(({ fetchInstagramMediaById }) => {
            fetchInstagramMediaById(igPostId)
                .then((m) => setThumbUrl(m.thumbnail_url ?? m.media_url ?? null))
                .catch(() => { /* thumbnail not critical */ });
        });
    }, [igPostId]);

    return (
        <div
            className="rounded-2xl p-5 transition-all duration-200"
            style={{
                background: "var(--surface)",
                border: `1px solid ${isActive ? "rgba(108,92,231,0.3)" : "var(--border-color)"}`,
                boxShadow: isActive ? "0 4px 20px rgba(108,92,231,0.1)" : "0 4px 16px rgba(0,0,0,0.15)",
            }}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    {/* Thumbnail or channel icon */}
                    <div
                        className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                        style={{ background: channelBg(automation.channel) }}
                    >
                        {thumbUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={thumbUrl} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                            channelIcon(automation.channel)
                        )}
                    </div>
                    <div>
                        <h3 className="text-sm font-black" style={{ color: "var(--foreground-color)" }}>
                            {automation.name}
                        </h3>
                        {automation.description && (
                            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                                {automation.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Status badge */}
                <div
                    className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black"
                    style={
                        isActive
                            ? { background: "rgba(16,185,129,0.15)", color: "#10B981" }
                            : automation.status === "PAUSED"
                                ? { background: "rgba(245,158,11,0.15)", color: "#F59E0B" }
                                : { background: "var(--surface-elevated)", color: "var(--foreground-muted)" }
                    }
                >
                    {isActive ? "● ACTIVE" : automation.status === "PAUSED" ? "⏸ PAUSED" : "DRAFT"}
                </div>
            </div>

            {/* Trigger / condition / action chips */}
            <div className="flex flex-wrap gap-1.5 mb-3">
                {automation.triggers.map((t) => (
                    <span
                        key={t.id}
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: "rgba(108,92,231,0.12)", color: "#a29bfe", border: "1px solid rgba(108,92,231,0.2)" }}
                    >
                        ⚡ {TRIGGER_LABELS[t.type] ?? t.type}
                    </span>
                ))}
                {automation.conditions.map((c) => (
                    <span
                        key={c.id}
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: "rgba(236,72,153,0.1)", color: "#f472b6", border: "1px solid rgba(236,72,153,0.2)" }}
                    >
                        if {OPERATOR_LABELS[c.operator] ?? c.operator} &quot;{c.value}&quot;
                    </span>
                ))}
                {automation.actions.map((a) => (
                    <span
                        key={a.id}
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}
                    >
                        → {ACTION_LABELS[a.type] ?? a.type}
                    </span>
                ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs" style={{ color: "var(--foreground-muted)" }}>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center gap-1 hover:text-purple-400 transition-colors"
                    >
                        <Activity className="h-3 w-3" />
                        {execCount} runs
                        {execCount > 0 && (expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </button>
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeAgo(automation.created_at)}
                    </span>
                    {automation.cooldown_seconds > 0 && (
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {automation.cooldown_seconds}s cooldown
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* View Logs */}
                    {execCount > 0 && (
                        <button
                            onClick={() => onViewLogs(automation.id)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-95"
                            style={{ background: "rgba(108,92,231,0.1)", border: "1px solid rgba(108,92,231,0.2)", color: "#a29bfe" }}
                        >
                            <BarChart2 className="h-3.5 w-3.5" />
                            Logs
                        </button>
                    )}

                    {/* Edit */}
                    <button
                        onClick={() => onEdit(automation.id)}
                        className="h-8 w-8 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                        style={{ background: "rgba(108,92,231,0.1)", border: "1px solid rgba(108,92,231,0.2)", color: "#a29bfe" }}
                        title="Edit automation"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </button>

                    {/* Toggle */}
                    <button
                        onClick={() => onToggle(automation.id, !isActive)}
                        disabled={toggling === automation.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-95"
                        style={
                            isActive
                                ? { background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", color: "#F59E0B" }
                                : { background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#10B981" }
                        }
                    >
                        {toggling === automation.id
                            ? <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            : isActive
                                ? <><Pause className="h-3.5 w-3.5" />Pause</>
                                : <><Play className="h-3.5 w-3.5" />Activate</>}
                    </button>

                    {/* Delete */}
                    <button
                        onClick={() => onDelete(automation.id)}
                        disabled={deleting === automation.id}
                        className="h-8 w-8 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}
                    >
                        {deleting === automation.id
                            ? <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            : <Trash2 className="h-3.5 w-3.5" />}
                    </button>
                </div>
            </div>

            {/* Expanded: message preview */}
            {expanded && automation.actions.length > 0 && (
                <div
                    className="mt-3 rounded-xl p-3 text-xs leading-relaxed"
                    style={{ background: "var(--background)", border: "1px solid var(--border-color)", color: "var(--foreground-muted)" }}
                >
                    {automation.actions.map((a, i) => {
                        const config = a.config as Record<string, unknown>;
                        const text = (config.message || config.prompt || config.tagName || config.url) as string | undefined;
                        return text ? (
                            <p key={i}><span className="font-bold" style={{ color: "var(--foreground-color)" }}>{ACTION_LABELS[a.type]}:</span> &ldquo;{String(text).slice(0, 120)}{String(text).length > 120 ? "…" : ""}&rdquo;</p>
                        ) : null;
                    })}
                </div>
            )}
        </div>
    );
}

// ─── Shared type ─────────────────────────────────────────────────────────────

interface IgMedia {
    id: string;
    media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
    media_url?: string;
    thumbnail_url?: string;
    permalink: string;
    caption?: string;
    timestamp: string;
    like_count?: number;
    comments_count?: number;
}

// ─── Create / Edit Automation Wizard (4-step, ReplyKaro-style) ───────────────
//
//  Step 1 — Pick a post/reel (search, filter, pagination, "All posts" option)
//  Step 2 — Set keyword condition
//  Step 3 — Write the private DM message + resource URL
//  Step 4 — Optional public comment reply + name/cooldown → Review → Save
//

interface WizardProps {
    onClose: () => void;
    onSave: (input: CreateAutomationInput) => Promise<void>;
    saving: boolean;
    savingError: string | null;
    /** Pre-populated values for edit mode. Omit for create mode. */
    prefill?: {
        name: string;
        ig_post_id: string | null;
        selectedPost: IgMedia | null;
        keywords: string;
        matchType: "CONTAINS" | "EXACT";
        anyKeyword: boolean;
        dmMessage: string;
        resourceUrl: string;
        publicReplyEnabled: boolean;
        publicReplyMessage: string;
        cooldown: number;
    };
    mode?: "create" | "edit";
}

type WizardStep = 1 | 2 | 3 | 4;

const STEP_LABELS: Record<WizardStep, string> = {
    1: "Post",
    2: "Keyword",
    3: "DM",
    4: "Review",
};

function AutomationWizard({ onClose, onSave, saving, savingError, prefill, mode = "create" }: WizardProps) {
    const isEdit = mode === "edit";

    // ── Step 1 state ──────────────────────────────────────────────────────────
    const [mediaList, setMediaList] = React.useState<IgMedia[]>([]);
    const [nextCursor, setNextCursor] = React.useState<string | null>(null);
    const [mediaLoading, setMediaLoading] = React.useState(true);
    const [mediaLoadingMore, setMediaLoadingMore] = React.useState(false);
    const [mediaError, setMediaError] = React.useState<string | null>(null);
    const [search, setSearch] = React.useState("");
    const [typeFilter, setTypeFilter] = React.useState<"ALL" | "VIDEO" | "IMAGE">("ALL");
    const [selectedPostId, setSelectedPostId] = React.useState<string | null>(prefill?.ig_post_id ?? null);
    const [selectedPost, setSelectedPost] = React.useState<IgMedia | null>(prefill?.selectedPost ?? null);

    // ── Step 2 state ──────────────────────────────────────────────────────────
    const [keywords, setKeywords] = React.useState(prefill?.keywords ?? "");
    const [matchType, setMatchType] = React.useState<"CONTAINS" | "EXACT">(prefill?.matchType ?? "CONTAINS");
    const [anyKeyword, setAnyKeyword] = React.useState(prefill?.anyKeyword ?? false);

    // ── Step 3 state ──────────────────────────────────────────────────────────
    const [dmMessage, setDmMessage] = React.useState(
        prefill?.dmMessage ?? "Hey! 👋 Here's the resource you requested: {{resource_url}}"
    );
    const [resourceUrl, setResourceUrl] = React.useState(prefill?.resourceUrl ?? "");

    // ── Step 4 state ──────────────────────────────────────────────────────────
    const [publicReplyEnabled, setPublicReplyEnabled] = React.useState(prefill?.publicReplyEnabled ?? false);
    const [publicReplyMsg, setPublicReplyMsg] = React.useState(
        prefill?.publicReplyMessage ?? "Thanks for your comment! 😊 Check your DMs for the resource. 📩"
    );
    const [automationName, setAutomationName] = React.useState(prefill?.name ?? "");
    const [cooldown, setCooldown] = React.useState(prefill?.cooldown ?? 86400);

    const [step, setStep] = React.useState<WizardStep>(1);

    // ── Load media ────────────────────────────────────────────────────────────
    const loadMedia = React.useCallback(async (cursor?: string) => {
        const isFirst = !cursor;
        if (isFirst) setMediaLoading(true); else setMediaLoadingMore(true);
        setMediaError(null);
        try {
            const { fetchInstagramMedia } = await import("@/lib/api/accounts.api");
            const page = await fetchInstagramMedia(20, cursor);
            setMediaList((prev) => isFirst ? page.items : [...prev, ...page.items]);
            setNextCursor(page.next_cursor);
        } catch (err: unknown) {
            setMediaError(err instanceof Error ? err.message : "Could not load posts");
        } finally {
            if (isFirst) setMediaLoading(false); else setMediaLoadingMore(false);
        }
    }, []);

    React.useEffect(() => { loadMedia(); }, [loadMedia]);

    // Auto-fill name from context when moving past step 2
    React.useEffect(() => {
        if (automationName) return; // don't overwrite user-typed name
        const kw = anyKeyword ? "any comment" : keywords.trim() || "keyword";
        const postLabel = selectedPost
            ? (selectedPost.caption ?? "").slice(0, 30) || "Selected Post"
            : "All Posts";
        setAutomationName(`${kw} → DM on ${postLabel}`);
    }, [keywords, anyKeyword, selectedPost, automationName]);

    // ── Filtered + searched media ────────────────────────────────────────────
    const visibleMedia = React.useMemo(() => {
        return mediaList.filter((m) => {
            const matchesType =
                typeFilter === "ALL" ||
                (typeFilter === "VIDEO" && m.media_type === "VIDEO") ||
                (typeFilter === "IMAGE" && (m.media_type === "IMAGE" || m.media_type === "CAROUSEL_ALBUM"));
            const matchesSearch =
                !search.trim() ||
                (m.caption ?? "").toLowerCase().includes(search.toLowerCase());
            return matchesType && matchesSearch;
        });
    }, [mediaList, typeFilter, search]);

    const previewDm = dmMessage.replace("{{resource_url}}", resourceUrl || "https://your-link.com");
    const step3Valid = dmMessage.trim();
    const step4Valid = automationName.trim() && (anyKeyword || keywords.trim());

    const handleSave = async () => {
        const actions: CreateAutomationInput["actions"] = [];
        // Public reply first (order 0), then private DM (order 1)
        if (publicReplyEnabled && publicReplyMsg.trim()) {
            actions.push({
                type: "SEND_PUBLIC_REPLY",
                order: 0,
                config: { message: publicReplyMsg.trim() },
            });
        }
        actions.push({
            type: "SEND_PRIVATE_REPLY",
            order: publicReplyEnabled ? 1 : 0,
            config: {
                message: dmMessage.trim(),
                ...(resourceUrl.trim() ? { resource_url: resourceUrl.trim() } : {}),
            },
        });

        await onSave({
            name: automationName.trim(),
            channel: "INSTAGRAM",
            cooldown_seconds: cooldown,
            triggers: [{
                type: anyKeyword ? "INSTAGRAM_COMMENT" : "INSTAGRAM_COMMENT_KEYWORD",
                ...(selectedPostId ? { ig_post_id: selectedPostId } : {}),
            }],
            conditions: anyKeyword ? [] : [{
                operator: matchType,
                value: keywords.trim(),
                case_insensitive: true,
            }],
            actions,
        });
    };

    const inputStyle = {
        background: "var(--background)",
        border: "1px solid var(--border-color)",
        color: "var(--foreground-color)",
    };

    // ── Step progress bar ─────────────────────────────────────────────────────
    const StepBar = () => (
        <div className="flex items-center gap-1.5 px-6 pt-5 pb-4 shrink-0">
            {([1, 2, 3, 4] as WizardStep[]).map((s) => {
                const done = step > s;
                const active = step === s;
                return (
                    <React.Fragment key={s}>
                        <button
                            type="button"
                            onClick={() => done ? setStep(s) : undefined}
                            className="flex items-center gap-1.5 shrink-0"
                            style={{ cursor: done ? "pointer" : "default" }}
                        >
                            <div
                                className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all"
                                style={
                                    done ? { background: "#10B981", color: "#fff" }
                                        : active ? { background: "linear-gradient(135deg,#e1306c,#a78bfa)", color: "#fff" }
                                            : { background: "var(--surface-elevated)", color: "var(--foreground-muted)" }
                                }
                            >
                                {done ? "✓" : s}
                            </div>
                            <span
                                className="text-[10px] font-bold hidden sm:block"
                                style={{ color: active ? "var(--foreground-color)" : "var(--foreground-muted)" }}
                            >
                                {STEP_LABELS[s]}
                            </span>
                        </button>
                        {s < 4 && (
                            <div
                                className="flex-1 h-[2px] rounded-full transition-all"
                                style={{ background: done ? "#10B981" : "var(--border-color)" }}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );

    // ── Step 1: Pick post ─────────────────────────────────────────────────────
    const Step1 = () => (
        <div className="flex flex-col gap-3">
            <div>
                <p className="text-sm font-black" style={{ color: "var(--foreground-color)" }}>
                    When someone comments on…
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                    Pick a specific Reel or apply to all posts.
                </p>
            </div>

            {/* Search + filter row */}
            <div className="flex gap-2">
                <div
                    className="flex-1 flex items-center gap-2 px-3 rounded-xl"
                    style={{ ...inputStyle, border: "1px solid var(--border-color)" }}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--foreground-muted)" }}>
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by caption…"
                        className="flex-1 bg-transparent text-xs outline-none py-2"
                        style={{ color: "var(--foreground-color)" }}
                    />
                    {search && (
                        <button type="button" onClick={() => setSearch("")} style={{ color: "var(--foreground-muted)" }}>
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </div>
                <div className="flex rounded-xl overflow-hidden shrink-0" style={{ border: "1px solid var(--border-color)" }}>
                    {(["ALL", "VIDEO", "IMAGE"] as const).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setTypeFilter(t)}
                            className="px-2.5 py-1.5 text-[10px] font-bold transition-all"
                            style={
                                typeFilter === t
                                    ? { background: "rgba(225,48,108,0.15)", color: "#e1306c" }
                                    : { background: "var(--background)", color: "var(--foreground-muted)" }
                            }
                        >
                            {t === "ALL" ? "All" : t === "VIDEO" ? "Reels" : "Images"}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => { setMediaList([]); setNextCursor(null); loadMedia(); }}
                    className="h-9 w-9 flex items-center justify-center rounded-xl transition-all shrink-0"
                    style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-color)" }}
                    title="Refresh"
                >
                    <RefreshCw className="h-3.5 w-3.5" style={{ color: "var(--foreground-muted)" }} />
                </button>
            </div>

            {/* All posts option */}
            <button
                type="button"
                onClick={() => { setSelectedPostId(null); setSelectedPost(null); }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left w-full transition-all"
                style={{
                    background: selectedPostId === null ? "rgba(225,48,108,0.1)" : "var(--surface-elevated)",
                    border: `1.5px solid ${selectedPostId === null ? "#e1306c" : "var(--border-color)"}`,
                }}
            >
                <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 text-xl"
                    style={{ background: "rgba(225,48,108,0.12)" }}>📸</div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-black" style={{ color: "var(--foreground-color)" }}>All Posts &amp; Reels</p>
                    <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>Trigger on any comment on any of your posts</p>
                </div>
                {selectedPostId === null && (
                    <div className="h-5 w-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "#e1306c" }}>
                        <Check className="h-3 w-3 text-white" />
                    </div>
                )}
            </button>

            {/* Grid */}
            {mediaLoading ? (
                <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="aspect-square rounded-xl animate-pulse"
                            style={{ background: "var(--surface-elevated)" }} />
                    ))}
                </div>
            ) : mediaError ? (
                <div className="rounded-xl px-4 py-3 text-xs leading-relaxed"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
                    <p className="font-bold mb-1">⚠ Could not load posts</p>
                    <p>{mediaError}</p>
                    <p className="mt-1" style={{ color: "var(--foreground-muted)" }}>
                        Ensure Instagram is connected with <code>instagram_business_basic</code> scope.
                    </p>
                    <button type="button" onClick={() => loadMedia()}
                        className="mt-2 flex items-center gap-1 text-xs font-bold"
                        style={{ color: "#e1306c" }}>
                        <RefreshCw className="h-3 w-3" /> Retry
                    </button>
                </div>
            ) : visibleMedia.length === 0 ? (
                <p className="text-xs text-center py-6" style={{ color: "var(--foreground-muted)" }}>
                    {search || typeFilter !== "ALL"
                        ? "No posts match your search/filter."
                        : "No posts found. Make sure your Instagram account is connected."}
                </p>
            ) : (
                <>
                    <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-0.5">
                        {visibleMedia.map((item) => {
                            const thumb = item.thumbnail_url || item.media_url || "";
                            const isSelected = selectedPostId === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => { setSelectedPostId(item.id); setSelectedPost(item); }}
                                    className="relative rounded-xl overflow-hidden aspect-square transition-all group"
                                    style={{
                                        border: `2.5px solid ${isSelected ? "#e1306c" : "transparent"}`,
                                        boxShadow: isSelected ? "0 0 0 2px rgba(225,48,108,0.25)" : "none",
                                    }}
                                    title={item.caption?.slice(0, 60) ?? item.id}
                                >
                                    {thumb ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={thumb} alt="" className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center"
                                            style={{ background: "var(--surface-elevated)" }}>
                                            <Camera className="h-5 w-5" style={{ color: "var(--foreground-muted)" }} />
                                        </div>
                                    )}
                                    {/* Media type badge */}
                                    {item.media_type === "VIDEO" && (
                                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold text-white"
                                            style={{ background: "rgba(0,0,0,0.75)" }}>REEL</div>
                                    )}
                                    {/* Selected overlay */}
                                    {isSelected && (
                                        <div className="absolute inset-0 flex items-center justify-center"
                                            style={{ background: "rgba(225,48,108,0.2)" }}>
                                            <div className="h-7 w-7 rounded-full flex items-center justify-center"
                                                style={{ background: "#e1306c" }}>
                                                <Check className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                    )}
                                    {/* Hover overlay */}
                                    {!isSelected && (
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5"
                                            style={{ background: "linear-gradient(to top,rgba(0,0,0,0.6),transparent)" }}>
                                            <p className="text-[9px] text-white line-clamp-2 leading-tight">
                                                {item.caption?.slice(0, 40) || "No caption"}
                                            </p>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    {/* Load more */}
                    {nextCursor && !search && typeFilter === "ALL" && (
                        <button
                            type="button"
                            onClick={() => loadMedia(nextCursor)}
                            disabled={mediaLoadingMore}
                            className="w-full py-2 rounded-xl text-xs font-bold transition-all"
                            style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-color)", color: "var(--foreground-muted)" }}
                        >
                            {mediaLoadingMore
                                ? <RefreshCw className="h-3.5 w-3.5 animate-spin inline" />
                                : "Load more posts"}
                        </button>
                    )}
                </>
            )}

            {/* Selected post preview */}
            {selectedPost && (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    style={{ background: "rgba(225,48,108,0.08)", border: "1px solid rgba(225,48,108,0.2)" }}>
                    <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0">
                        {selectedPost.thumbnail_url || selectedPost.media_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={selectedPost.thumbnail_url || selectedPost.media_url}
                                alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center"
                                style={{ background: "var(--surface-elevated)" }}>
                                <Camera className="h-4 w-4" style={{ color: "var(--foreground-muted)" }} />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate" style={{ color: "#e1306c" }}>
                            {selectedPost.media_type === "VIDEO" ? "🎬 Reel" : "🖼 Post"} selected
                        </p>
                        <p className="text-[11px] truncate" style={{ color: "var(--foreground-muted)" }}>
                            {selectedPost.caption?.slice(0, 50) || selectedPost.permalink}
                        </p>
                    </div>
                    <a href={selectedPost.permalink} target="_blank" rel="noopener noreferrer"
                        className="text-[10px] font-bold shrink-0"
                        style={{ color: "#e1306c" }}
                        onClick={(e) => e.stopPropagation()}>
                        View ↗
                    </a>
                </div>
            )}
        </div>
    );

    // ── Step 2: Keyword ───────────────────────────────────────────────────────
    const Step2 = () => (
        <div className="flex flex-col gap-4">
            <div>
                <p className="text-sm font-black" style={{ color: "var(--foreground-color)" }}>
                    And this comment has…
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                    Set keywords that trigger the DM. Multiple keywords = comma-separated.
                </p>
            </div>

            {/* Any keyword toggle */}
            <div
                className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all"
                style={{
                    background: anyKeyword ? "rgba(225,48,108,0.08)" : "var(--surface-elevated)",
                    border: `1px solid ${anyKeyword ? "rgba(225,48,108,0.3)" : "var(--border-color)"}`,
                }}
                onClick={() => setAnyKeyword((v) => !v)}
            >
                <div>
                    <p className="text-sm font-bold" style={{ color: "var(--foreground-color)" }}>Any keyword</p>
                    <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>Reply to every comment regardless of text</p>
                </div>
                <div className="relative inline-flex h-6 w-11 rounded-full transition-colors duration-300 shrink-0"
                    style={{ background: anyKeyword ? "#e1306c" : "var(--border-color)" }}>
                    <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300"
                        style={{ transform: anyKeyword ? "translateX(20px)" : "translateX(0)" }} />
                </div>
            </div>

            {!anyKeyword && (
                <>
                    {/* Match type */}
                    <div>
                        <p className="text-xs font-bold mb-2" style={{ color: "var(--foreground-muted)" }}>Match type</p>
                        <div className="flex gap-2">
                            {(["CONTAINS", "EXACT"] as const).map((t) => (
                                <button key={t} type="button" onClick={() => setMatchType(t)}
                                    className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                                    style={
                                        matchType === t
                                            ? { background: "rgba(225,48,108,0.12)", border: "1px solid #e1306c", color: "#e1306c" }
                                            : { background: "var(--surface-elevated)", border: "1px solid var(--border-color)", color: "var(--foreground-muted)" }
                                    }>
                                    {t === "CONTAINS" ? "Contains" : "Exact match"}
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] mt-1.5 leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                            {matchType === "CONTAINS"
                                ? "Fires if the comment includes the keyword anywhere — e.g. \"send DSA\" still matches \"DSA\""
                                : "Fires only when the comment is exactly the keyword — e.g. comment must be only \"DSA\""}
                        </p>
                    </div>

                    {/* Keywords input */}
                    <div>
                        <p className="text-xs font-bold mb-1.5" style={{ color: "var(--foreground-muted)" }}>
                            Keywords <span className="font-normal">(comma-separated for multiple)</span>
                        </p>
                        <input
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="e.g. DSA, notes, pdf, link"
                            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                            style={{ ...inputStyle, border: "1.5px solid rgba(225,48,108,0.35)" }}
                            autoFocus
                        />
                        <p className="text-[10px] mt-1" style={{ color: "var(--foreground-muted)" }}>
                            Case-insensitive. &ldquo;DSA&rdquo; matches &ldquo;dsa&rdquo;, &ldquo;send DSA please&rdquo;, etc.
                        </p>
                    </div>
                </>
            )}

            {/* Live trigger preview */}
            <div className="rounded-xl px-4 py-3 text-xs leading-relaxed"
                style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-color)" }}>
                <p className="font-bold mb-1" style={{ color: "var(--foreground-color)" }}>Will trigger when:</p>
                <p style={{ color: "var(--foreground-muted)" }}>
                    Someone comments{" "}
                    {anyKeyword
                        ? <strong style={{ color: "#e1306c" }}>anything</strong>
                        : matchType === "CONTAINS"
                            ? <><strong style={{ color: "#e1306c" }}>containing &ldquo;{keywords || "…"}&rdquo;</strong></>
                            : <><strong style={{ color: "#e1306c" }}>exactly &ldquo;{keywords || "…"}&rdquo;</strong></>
                    }{" "}
                    on {selectedPost
                        ? <strong style={{ color: "#e1306c" }}>{(selectedPost.caption ?? "").slice(0, 35) || "selected post"}</strong>
                        : "any of your posts"}.
                </p>
            </div>
        </div>
    );

    // ── Step 3: DM message ────────────────────────────────────────────────────
    const Step3 = () => (
        <div className="flex flex-col gap-4">
            <div>
                <p className="text-sm font-black" style={{ color: "var(--foreground-color)" }}>They will get a private DM…</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                    Written directly in their Instagram inbox. Use <code className="text-[10px] font-mono">{"{{resource_url}}"}</code> as a placeholder.
                </p>
            </div>

            <div>
                <textarea
                    value={dmMessage}
                    onChange={(e) => setDmMessage(e.target.value)}
                    rows={4}
                    maxLength={1000}
                    placeholder="Hey! 👋 Here's the resource you requested: {{resource_url}}"
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                    style={{ ...inputStyle, border: "1.5px solid rgba(225,48,108,0.35)" }}
                />
                <p className="text-[10px] mt-1 text-right" style={{ color: "var(--foreground-muted)" }}>
                    {dmMessage.length}/1000
                </p>
            </div>

            <div>
                <p className="text-xs font-bold mb-1.5" style={{ color: "var(--foreground-muted)" }}>
                    Resource URL — replaces <code className="text-[10px] font-mono">{"{{resource_url}}"}</code>
                </p>
                <input
                    value={resourceUrl}
                    onChange={(e) => setResourceUrl(e.target.value)}
                    type="url"
                    placeholder="https://your-domain.com/dsa-guide.pdf"
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={inputStyle}
                />
            </div>

            {/* DM Preview */}
            <div>
                <p className="text-xs font-bold mb-2" style={{ color: "var(--foreground-muted)" }}>📱 DM Preview</p>
                <div className="rounded-2xl p-4" style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-color)" }}>
                    <div className="flex items-end gap-2">
                        <div className="h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black text-white"
                            style={{ background: "linear-gradient(135deg,#e1306c,#833ab4)" }}>
                            You
                        </div>
                        <div className="rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-xs leading-relaxed max-w-[85%]"
                            style={{ background: "linear-gradient(135deg,#833ab4,#e1306c)", color: "#fff" }}>
                            {previewDm}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // ── Step 4: Public reply + settings + review ──────────────────────────────
    const Step4 = () => (
        <div className="flex flex-col gap-4">
            {/* Public reply toggle */}
            <div>
                <p className="text-sm font-black mb-2" style={{ color: "var(--foreground-color)" }}>
                    Also reply publicly on the post? <span className="text-xs font-normal" style={{ color: "var(--foreground-muted)" }}>(optional)</span>
                </p>
                <div
                    className="flex items-start justify-between px-4 py-3 rounded-xl cursor-pointer transition-all"
                    style={{
                        background: publicReplyEnabled ? "rgba(225,48,108,0.08)" : "var(--surface-elevated)",
                        border: `1px solid ${publicReplyEnabled ? "rgba(225,48,108,0.3)" : "var(--border-color)"}`,
                    }}
                    onClick={() => setPublicReplyEnabled((v) => !v)}
                >
                    <div className="flex-1 min-w-0 pr-4">
                        <p className="text-sm font-bold" style={{ color: "var(--foreground-color)" }}>Public comment reply</p>
                        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                            Visibly reply under the comment — visible to everyone who sees the post.
                            Requires <code className="text-[10px]">instagram_manage_comments</code> permission.
                        </p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 rounded-full transition-colors duration-300 shrink-0 mt-0.5"
                        style={{ background: publicReplyEnabled ? "#e1306c" : "var(--border-color)" }}>
                        <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300"
                            style={{ transform: publicReplyEnabled ? "translateX(20px)" : "translateX(0)" }} />
                    </div>
                </div>
                {publicReplyEnabled && (
                    <div className="mt-2">
                        <textarea
                            value={publicReplyMsg}
                            onChange={(e) => setPublicReplyMsg(e.target.value)}
                            rows={2}
                            maxLength={2200}
                            placeholder="Thanks for your comment! 😊 Check your DMs! 📩"
                            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none mt-2"
                            style={{ ...inputStyle, border: "1.5px solid rgba(225,48,108,0.3)" }}
                        />
                        <p className="text-[10px] mt-1 text-right" style={{ color: "var(--foreground-muted)" }}>
                            {publicReplyMsg.length}/2200
                        </p>
                    </div>
                )}
            </div>

            {/* Name + cooldown */}
            <div>
                <p className="text-xs font-bold mb-1.5" style={{ color: "var(--foreground-muted)" }}>Automation name</p>
                <input
                    value={automationName}
                    onChange={(e) => setAutomationName(e.target.value)}
                    placeholder="e.g. DSA PDF Auto Reply"
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={inputStyle}
                />
            </div>

            <div>
                <p className="text-xs font-bold mb-1.5" style={{ color: "var(--foreground-muted)" }}>
                    Cooldown — prevents duplicate DMs per commenter
                </p>
                <select value={cooldown} onChange={(e) => setCooldown(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={inputStyle}>
                    <option value={0}>No cooldown</option>
                    <option value={3600}>1 hour</option>
                    <option value={86400}>24 hours (recommended)</option>
                    <option value={604800}>7 days</option>
                </select>
            </div>

            {/* Review summary */}
            <div className="rounded-2xl p-4 space-y-2"
                style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-color)" }}>
                <p className="text-xs font-black" style={{ color: "var(--foreground-color)" }}>Review</p>
                {[
                    { label: "Post", value: selectedPost ? (selectedPost.caption?.slice(0, 40) || selectedPost.id) : "All Posts & Reels" },
                    { label: "Trigger", value: anyKeyword ? "Any comment" : `Comment ${matchType === "CONTAINS" ? "contains" : "equals"} "${keywords}"` },
                    { label: "Private DM", value: previewDm.slice(0, 60) + (previewDm.length > 60 ? "…" : "") },
                    ...(publicReplyEnabled ? [{ label: "Public reply", value: publicReplyMsg.slice(0, 50) + "…" }] : []),
                    { label: "Cooldown", value: cooldown === 0 ? "None" : cooldown === 3600 ? "1 hour" : cooldown === 86400 ? "24 hours" : "7 days" },
                ].map(({ label, value }) => (
                    <div key={label} className="flex items-start gap-2 text-xs">
                        <span className="font-bold shrink-0 w-20" style={{ color: "var(--foreground-muted)" }}>{label}:</span>
                        <span className="leading-relaxed" style={{ color: "var(--foreground-color)" }}>{value}</span>
                    </div>
                ))}
            </div>

            {savingError && (
                <div className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
                    <span className="shrink-0 mt-0.5">⚠</span>
                    <span>{savingError}</span>
                </div>
            )}
        </div>
    );

    const canAdvance = () => {
        if (step === 2 && !anyKeyword && !keywords.trim()) return false;
        if (step === 3 && !step3Valid) return false;
        if (step === 4 && !step4Valid) return false;
        return true;
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="w-full sm:max-w-lg rounded-t-[28px] sm:rounded-3xl shadow-2xl flex flex-col"
                style={{ background: "var(--surface)", border: "1px solid var(--border-color)", maxHeight: "92dvh" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-0 shrink-0">
                    <div>
                        <h2 className="text-lg font-black" style={{ color: "var(--foreground-color)" }}>
                            {isEdit ? "Edit Automation" : "Comment → DM Automation"}
                        </h2>
                        <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                            {step === 1 ? "Select the post to watch"
                                : step === 2 ? "Set the keyword condition"
                                    : step === 3 ? "Write the private DM"
                                        : "Configure public reply & review"}
                        </p>
                    </div>
                    <button onClick={onClose}
                        className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0 transition-all hover:bg-red-500/10"
                        style={{ color: "var(--foreground-muted)" }}>
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <StepBar />

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-6 pb-4">
                    {step === 1 && <Step1 />}
                    {step === 2 && <Step2 />}
                    {step === 3 && <Step3 />}
                    {step === 4 && <Step4 />}
                </div>

                {/* Footer nav */}
                <div className="shrink-0 flex items-center justify-between gap-3 px-6 py-4"
                    style={{ borderTop: "1px solid var(--border-color)" }}>
                    {step > 1 ? (
                        <button type="button" onClick={() => setStep((s) => (s - 1) as WizardStep)}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                            style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-color)", color: "var(--foreground-muted)" }}>
                            ← Back
                        </button>
                    ) : <div />}

                    {step < 4 ? (
                        <button type="button"
                            onClick={() => canAdvance() && setStep((s) => (s + 1) as WizardStep)}
                            disabled={!canAdvance()}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                            style={{ background: "linear-gradient(135deg,#e1306c,#a78bfa)", boxShadow: "0 4px 16px rgba(225,48,108,0.35)" }}>
                            Next →
                        </button>
                    ) : (
                        <button type="button" onClick={handleSave}
                            disabled={saving || !step4Valid}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                            style={{ background: "linear-gradient(135deg,#e1306c,#a78bfa)", boxShadow: "0 4px 16px rgba(225,48,108,0.35)" }}>
                            {saving
                                ? <><RefreshCw className="h-4 w-4 animate-spin" />{isEdit ? "Saving…" : "Creating…"}</>
                                : <><Check className="h-4 w-4" />{isEdit ? "Save Changes" : "Create & Activate"}</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// (AutomationWizard is used directly — no alias needed)

export default function AutomationsPage() {
    const [automations, setAutomations] = React.useState<Automation[]>([]);
    const [stats, setStats] = React.useState<AutomationStats | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [loadError, setLoadError] = React.useState<string | null>(null);
    const [showModal, setShowModal] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [saving, setSaving] = React.useState(false);
    const [savingError, setSavingError] = React.useState<string | null>(null);
    const [toggling, setToggling] = React.useState<string | null>(null);
    const [deleting, setDeleting] = React.useState<string | null>(null);
    const [logsFor, setLogsFor] = React.useState<string | null>(null);

    const load = React.useCallback(async () => {
        setLoading(true);
        setLoadError(null);
        try {
            const [autoList, autoStats] = await Promise.all([
                fetchAutomations(),
                fetchAutomationStats(),
            ]);
            setAutomations(autoList);
            setStats(autoStats);
        } catch (err) {
            setLoadError(err instanceof Error ? err.message : "Failed to load automations. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => { load(); }, [load]);

    const handleCreate = async (input: CreateAutomationInput) => {
        setSaving(true);
        setSavingError(null);
        try {
            const created = await createAutomation(input);
            // Auto-activate — the wizard CTA says "Create & Activate"
            const activated = await activateAutomation(created.id).catch(() => created);
            setAutomations((prev) => [activated, ...prev]);
            setShowModal(false);
            void fetchAutomationStats().then(setStats).catch(() => { });
        } catch (err) {
            setSavingError(err instanceof Error ? err.message : "Failed to create automation.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = async (input: CreateAutomationInput) => {
        if (!editingId) return;
        setSaving(true);
        setSavingError(null);
        try {
            const updated = await updateAutomation(editingId, input);
            setAutomations((prev) => prev.map((a) => (a.id === editingId ? updated : a)));
            setEditingId(null);
            void fetchAutomationStats().then(setStats).catch(() => { });
        } catch (err) {
            setSavingError(err instanceof Error ? err.message : "Failed to update automation.");
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (id: string, activate: boolean) => {
        setToggling(id);
        try {
            const updated = activate ? await activateAutomation(id) : await pauseAutomation(id);
            setAutomations((prev) => prev.map((a) => (a.id === id ? { ...a, status: updated.status } : a)));
            fetchAutomationStats().then(setStats).catch(() => { });
        } catch {
            // no-op
        } finally {
            setToggling(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this automation? This cannot be undone.")) return;
        setDeleting(id);
        try {
            await deleteAutomation(id);
            setAutomations((prev) => prev.filter((a) => a.id !== id));
            fetchAutomationStats().then(setStats).catch(() => { });
        } catch {
            // no-op
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 p-4 sm:p-6 lg:p-8" style={{ background: "var(--background)" }}>

            {/* ── Header ── */}
            <div className="mb-5">
                <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2"
                    style={{ background: "rgba(108,92,231,0.12)", border: "1px solid rgba(108,92,231,0.25)", color: "#a29bfe" }}
                >
                    <Zap className="h-3.5 w-3.5" />
                    <span>AI AUTOMATION</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: "var(--foreground-color)" }}>
                            Automations{" "}
                            <span style={{ background: "linear-gradient(135deg,#6C5CE7,#a29bfe)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                &amp; Bots
                            </span>
                        </h1>
                        <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--foreground-muted)" }}>
                            Auto-reply to Instagram DMs, comments, and WhatsApp messages with AI or fixed responses.
                        </p>
                    </div>
                    <button
                        id="create-automation-btn"
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95 shrink-0"
                        style={{ background: "linear-gradient(135deg,#6C5CE7,#a29bfe)", boxShadow: "0 4px 14px rgba(108,92,231,0.35)" }}
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">New Automation</span>
                        <span className="sm:hidden">New</span>
                    </button>
                </div>
            </div>

            {/* ── Error banner ── */}
            {loadError && (
                <div
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-5"
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}
                >
                    <AlertCircle className="h-4 w-4 shrink-0" style={{ color: "#EF4444" }} />
                    <p className="text-sm flex-1" style={{ color: "#EF4444" }}>{loadError}</p>
                    <button
                        onClick={load}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
                        style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}
                    >
                        <RefreshCw className="h-3 w-3" />
                        Retry
                    </button>
                </div>
            )}
            {/* ── Stats ── */}
            {stats && (
                <>
                    {/* Row 1 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                        <StatCard label="Total" value={stats.total} icon={Zap} color="#a29bfe" />
                        <StatCard label="Active" value={stats.active} icon={Activity} color="#10B981" />
                        <StatCard label="Total Runs" value={stats.totalExecs} icon={BarChart2} color="#F59E0B" />
                        <StatCard label="AI Replies" value={stats.aiReplies} icon={Bot} color="#ec4899" />
                    </div>
                    {/* Row 2 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        <StatCard label="Succeeded" value={stats.successExecs} icon={CheckCircle2} color="#10B981" />
                        <StatCard label="Failed" value={stats.failedExecs} icon={AlertCircle} color="#EF4444" />
                        <StatCard label="IG Conversations" value={stats.igConversations} icon={Camera} color="#e1306c" />
                        <StatCard label="WA Conversations" value={stats.waConversations} icon={Users} color="#25D366" />
                    </div>
                </>
            )}

            {/* ── Automations grid ── */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <RefreshCw className="h-6 w-6 animate-spin" style={{ color: "#6C5CE7" }} />
                </div>
            ) : automations.length === 0 ? (
                /* Empty state */
                <div
                    className="flex flex-col items-center justify-center flex-1 rounded-2xl py-20"
                    style={{ background: "var(--surface)", border: "2px dashed rgba(108,92,231,0.2)" }}
                >
                    <div
                        className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
                        style={{ background: "linear-gradient(135deg,#6C5CE7,#a29bfe)", boxShadow: "0 8px 28px rgba(108,92,231,0.35)" }}
                    >
                        <Zap className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-lg font-black mb-2" style={{ color: "var(--foreground-color)" }}>
                        No automations yet
                    </h2>
                    <p className="text-sm text-center max-w-sm mb-6 leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                        Create your first automation to start auto-replying to Instagram DMs, comments, and WhatsApp messages — even while you sleep.
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95"
                        style={{ background: "linear-gradient(135deg,#6C5CE7,#a29bfe)", boxShadow: "0 4px 18px rgba(108,92,231,0.4)" }}
                    >
                        <Plus className="h-4 w-4" />
                        Create First Automation
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {automations.map((automation) => (
                        <AutomationCard
                            key={automation.id}
                            automation={automation}
                            onToggle={handleToggle}
                            onDelete={handleDelete}
                            onViewLogs={setLogsFor}
                            onEdit={setEditingId}
                            deleting={deleting}
                            toggling={toggling}
                        />
                    ))}
                </div>
            )}

            {/* ── How it works callout ── */}
            {!loading && (
                <div
                    className="mt-6 rounded-2xl p-5"
                    style={{ background: "rgba(108,92,231,0.08)", border: "1px solid rgba(108,92,231,0.2)" }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-4 w-4" style={{ color: "#a29bfe" }} />
                        <span className="text-xs font-black" style={{ color: "#a29bfe" }}>HOW AUTOMATIONS WORK</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {[
                            { icon: MessageCircle, title: "1. Trigger", desc: "A DM, comment, or WhatsApp message arrives on your connected account." },
                            { icon: CheckCircle2, title: "2. Condition", desc: "Optional: only fire if the message matches a keyword or phrase." },
                            { icon: Bot, title: "3. Action", desc: "Send a fixed reply, link, tag the convo, or let AI craft a personalized response." },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="flex gap-3 flex-1">
                                <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(108,92,231,0.15)" }}>
                                    <Icon className="h-4 w-4" style={{ color: "#a29bfe" }} />
                                </div>
                                <div>
                                    <p className="text-xs font-black" style={{ color: "var(--foreground-color)" }}>{title}</p>
                                    <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: "var(--foreground-muted)" }}>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Modals ── */}
            {showModal && (
                <AutomationWizard
                    onClose={() => { setShowModal(false); setSavingError(null); }}
                    onSave={handleCreate}
                    saving={saving}
                    savingError={savingError}
                    mode="create"
                />
            )}

            {/* Edit modal — pre-fills wizard from existing automation */}
            {editingId && (() => {
                const auto = automations.find((a) => a.id === editingId);
                if (!auto) return null;
                const trigger = auto.triggers[0];
                const condition = auto.conditions[0];
                const dmAction = auto.actions.find((a) => a.type === "SEND_PRIVATE_REPLY");
                const publicAction = auto.actions.find((a) => a.type === "SEND_PUBLIC_REPLY");
                const cfg = dmAction?.config as Record<string, unknown> | undefined;
                const pubCfg = publicAction?.config as Record<string, unknown> | undefined;
                return (
                    <AutomationWizard
                        onClose={() => { setEditingId(null); setSavingError(null); }}
                        onSave={handleEdit}
                        saving={saving}
                        savingError={savingError}
                        mode="edit"
                        prefill={{
                            name: auto.name,
                            ig_post_id: trigger?.ig_post_id ?? null,
                            selectedPost: null, // thumbnail will reload in Step 1
                            keywords: condition?.value ?? "",
                            matchType: (condition?.operator === "EXACT" ? "EXACT" : "CONTAINS") as "CONTAINS" | "EXACT",
                            anyKeyword: !condition || condition.operator === "ANY" || auto.conditions.length === 0,
                            dmMessage: (cfg?.message as string) ?? "",
                            resourceUrl: (cfg?.resource_url as string) ?? "",
                            publicReplyEnabled: !!publicAction,
                            publicReplyMessage: (pubCfg?.message as string) ?? "",
                            cooldown: auto.cooldown_seconds,
                        }}
                    />
                );
            })()}

            {logsFor && (
                <LogsPanel
                    automationId={logsFor}
                    onClose={() => setLogsFor(null)}
                />
            )}
        </div>
    );
}
