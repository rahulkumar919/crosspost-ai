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
    PAUSE_AUTOMATION: "Pause automation",
};

const OPERATOR_LABELS: Record<AutomationConditionOperator, string> = {
    CONTAINS: "contains",
    EXACT: "exactly equals",
    STARTS_WITH: "starts with",
    ANY: "any message",
};

// ─── Automation type ──────────────────────────────────────────────────────────

type AutomationType = "comment" | "dm";

function detectAutomationType(auto: Automation): AutomationType {
    const t = (auto.triggers ?? [])[0]?.type;
    if (t === "INSTAGRAM_DM" || t === "INSTAGRAM_DM_KEYWORD" || t === "WHATSAPP_MESSAGE" || t === "WHATSAPP_KEYWORD") return "dm";
    return "comment";
}

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

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
    return (
        <div className="flex flex-col gap-1 rounded-2xl p-4 flex-1" style={{ background: "var(--surface)", border: "1px solid var(--border-color)" }}>
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

// ─── Logs Panel ───────────────────────────────────────────────────────────────

function LogsPanel({ automationId, onClose }: { automationId: string; onClose: () => void }) {
    const [logs, setLogs] = React.useState<AutomationExecution[]>([]);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        setLoading(true);
        fetchAutomationLogs(automationId, 20).then(setLogs).catch(() => setLogs([])).finally(() => setLoading(false));
    }, [automationId]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border-color)" }}>
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border-color)" }}>
                    <div>
                        <h2 className="text-lg font-black" style={{ color: "var(--foreground-color)" }}>Execution Logs</h2>
                        <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>Last 20 runs</p>
                    </div>
                    <button onClick={onClose} className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ color: "var(--foreground-muted)" }}><X className="h-4 w-4" /></button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto space-y-3">
                    {loading ? (
                        <div className="flex items-center justify-center py-12"><RefreshCw className="h-5 w-5 animate-spin" style={{ color: "#6C5CE7" }} /></div>
                    ) : logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Activity className="h-8 w-8 mb-3" style={{ color: "var(--foreground-muted)" }} />
                            <p className="text-sm font-semibold" style={{ color: "var(--foreground-muted)" }}>No executions yet</p>
                        </div>
                    ) : logs.map((log) => (
                        <div key={log.id} className="rounded-xl p-4" style={{ background: "var(--background)", border: `1px solid ${log.success ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex items-center gap-2">
                                    {log.success ? <CheckCheck className="h-4 w-4" style={{ color: "#10B981" }} /> : <AlertCircle className="h-4 w-4" style={{ color: "#EF4444" }} />}
                                    <span className="text-xs font-bold" style={{ color: log.success ? "#10B981" : "#EF4444" }}>{log.success ? "Success" : "Failed"}</span>
                                    <span className="text-xs" style={{ color: "var(--foreground-muted)" }}>· {log.channel}</span>
                                </div>
                                <span className="text-xs" style={{ color: "var(--foreground-muted)" }}>{timeAgo(log.executed_at)}</span>
                            </div>
                            {log.actions_executed.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {log.actions_executed.map((a, i) => (
                                        <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={a.success ? { background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" } : { background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                                            {a.type}{a.error ? ` — ${a.error}` : ""}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {log.actions_executed.some(a => a.sentText) && (
                                <p className="text-[11px] mt-2 px-3 py-1.5 rounded-lg" style={{ background: "var(--surface)", color: "var(--foreground-muted)" }}>
                                    &ldquo;{log.actions_executed.find(a => a.sentText)?.sentText}&rdquo;
                                </p>
                            )}
                            {log.error_message && <p className="text-[11px] mt-2" style={{ color: "#EF4444" }}>{log.error_message}</p>}
                        </div>
                    ))}
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

    // Guard against API responses that don't include relations
    const triggers = automation.triggers ?? [];
    const conditions = automation.conditions ?? [];
    const actions = automation.actions ?? [];

    const igPostId = triggers.find((t) => t.ig_post_id)?.ig_post_id ?? null;
    const [thumbUrl, setThumbUrl] = React.useState<string | null>(null);
    React.useEffect(() => {
        if (!igPostId) return;
        import("@/lib/api/accounts.api").then(({ fetchInstagramMediaById }) => {
            fetchInstagramMediaById(igPostId).then((m) => setThumbUrl(m.thumbnail_url ?? m.media_url ?? null)).catch(() => { });
        });
    }, [igPostId]);

    return (
        <div className="rounded-2xl p-5 transition-all duration-200" style={{ background: "var(--surface)", border: `1px solid ${isActive ? "rgba(108,92,231,0.3)" : "var(--border-color)"}`, boxShadow: isActive ? "0 4px 20px rgba(108,92,231,0.1)" : "0 4px 16px rgba(0,0,0,0.15)" }}>
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden" style={{ background: channelBg(automation.channel) }}>
                        {thumbUrl
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={thumbUrl} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                            : channelIcon(automation.channel)}
                    </div>
                    <div>
                        <h3 className="text-sm font-black" style={{ color: "var(--foreground-color)" }}>{automation.name}</h3>
                        {automation.description && <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>{automation.description}</p>}
                    </div>
                </div>
                <div className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black" style={isActive ? { background: "rgba(16,185,129,0.15)", color: "#10B981" } : automation.status === "PAUSED" ? { background: "rgba(245,158,11,0.15)", color: "#F59E0B" } : { background: "var(--surface-elevated)", color: "var(--foreground-muted)" }}>
                    {isActive ? "● ACTIVE" : automation.status === "PAUSED" ? "⏸ PAUSED" : "DRAFT"}
                </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
                {triggers.map((t) => (
                    <span key={t.id} className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(108,92,231,0.12)", color: "#a29bfe", border: "1px solid rgba(108,92,231,0.2)" }}>
                        ⚡ {TRIGGER_LABELS[t.type] ?? t.type}
                    </span>
                ))}
                {conditions.map((c) => (
                    <span key={c.id} className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(236,72,153,0.1)", color: "#f472b6", border: "1px solid rgba(236,72,153,0.2)" }}>
                        if {OPERATOR_LABELS[c.operator] ?? c.operator} &quot;{c.value}&quot;
                    </span>
                ))}
                {actions.map((a) => (
                    <span key={a.id} className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}>
                        → {ACTION_LABELS[a.type] ?? a.type}
                    </span>
                ))}
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs" style={{ color: "var(--foreground-muted)" }}>
                    <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 hover:text-purple-400 transition-colors">
                        <Activity className="h-3 w-3" />{execCount} runs
                        {execCount > 0 && (expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </button>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(automation.created_at)}</span>
                    {automation.cooldown_seconds > 0 && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{automation.cooldown_seconds}s cd</span>}
                </div>
                <div className="flex items-center gap-2">
                    {execCount > 0 && (
                        <button onClick={() => onViewLogs(automation.id)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold" style={{ background: "rgba(108,92,231,0.1)", border: "1px solid rgba(108,92,231,0.2)", color: "#a29bfe" }}>
                            <BarChart2 className="h-3.5 w-3.5" />Logs
                        </button>
                    )}
                    <button onClick={() => onEdit(automation.id)} className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(108,92,231,0.1)", border: "1px solid rgba(108,92,231,0.2)", color: "#a29bfe" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </button>
                    <button onClick={() => onToggle(automation.id, !isActive)} disabled={toggling === automation.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold" style={isActive ? { background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", color: "#F59E0B" } : { background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#10B981" }}>
                        {toggling === automation.id ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : isActive ? <><Pause className="h-3.5 w-3.5" />Pause</> : <><Play className="h-3.5 w-3.5" />Activate</>}
                    </button>
                    <button onClick={() => onDelete(automation.id)} disabled={deleting === automation.id} className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
                        {deleting === automation.id ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    </button>
                </div>
            </div>
            {expanded && actions.length > 0 && (
                <div className="mt-3 rounded-xl p-3 text-xs" style={{ background: "var(--background)", border: "1px solid var(--border-color)", color: "var(--foreground-muted)" }}>
                    {actions.map((a, i) => {
                        const cfg = a.config as Record<string, unknown>;
                        const text = (cfg.message || cfg.prompt || cfg.tagName || cfg.url) as string | undefined;
                        return text ? <p key={i}><span className="font-bold" style={{ color: "var(--foreground-color)" }}>{ACTION_LABELS[a.type]}:</span> &ldquo;{String(text).slice(0, 120)}{String(text).length > 120 ? "…" : ""}&rdquo;</p> : null;
                    })}
                </div>
            )}
        </div>
    );
}

// ─── Shared post type ─────────────────────────────────────────────────────────

interface IgMedia {
    id: string;
    media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
    media_url?: string;
    thumbnail_url?: string;
    permalink: string;
    caption?: string;
    timestamp: string;
}

// ─── Type Selector ────────────────────────────────────────────────────────────

function TypeSelector({ onSelect, onClose }: { onSelect: (type: AutomationType) => void; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="w-full rounded-t-[32px] shadow-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border-color)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
                <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full" style={{ background: "var(--border-color)" }} /></div>
                <div className="flex items-center justify-between px-5 pt-3 pb-4">
                    <div>
                        <h2 className="text-base font-black" style={{ color: "var(--foreground-color)" }}>Choose Automation Type</h2>
                        <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>What should trigger this automation?</p>
                    </div>
                    <button onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: "var(--surface-elevated)", color: "var(--foreground-muted)" }}><X className="h-4 w-4" /></button>
                </div>
                <div className="px-5 pb-6 flex flex-col gap-3">
                    {/* Comment → DM */}
                    <button type="button" onClick={() => onSelect("comment")}
                        className="flex items-start gap-4 px-5 py-4 rounded-2xl text-left transition-all active:scale-[0.98]"
                        style={{ background: "rgba(225,48,108,0.08)", border: "1.5px solid rgba(225,48,108,0.3)" }}>
                        <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 text-2xl" style={{ background: "rgba(225,48,108,0.15)" }}>💬</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black" style={{ color: "var(--foreground-color)" }}>Comment → DM</p>
                            <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                                When someone comments a keyword on your Reel, automatically send them a private DM — perfect for sharing links, PDFs, or resources.
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {["comment keyword", "→ private DM", "optional public reply"].map(tag => (
                                    <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(225,48,108,0.12)", color: "#e1306c" }}>{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-1" style={{ background: "#e1306c" }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="h-3 w-3"><polyline points="9 18 15 12 9 6" /></svg>
                        </div>
                    </button>

                    {/* DM Auto-Reply */}
                    <button type="button" onClick={() => onSelect("dm")}
                        className="flex items-start gap-4 px-5 py-4 rounded-2xl text-left transition-all active:scale-[0.98]"
                        style={{ background: "rgba(108,92,231,0.08)", border: "1.5px solid rgba(108,92,231,0.3)" }}>
                        <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 text-2xl" style={{ background: "rgba(108,92,231,0.15)" }}>📩</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black" style={{ color: "var(--foreground-color)" }}>DM Auto-Reply</p>
                            <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                                When someone sends you a DM, automatically reply — fixed message or AI-generated reply based on your knowledge base.
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {["DM keyword", "→ auto reply", "AI reply option"].map(tag => (
                                    <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(108,92,231,0.12)", color: "#a29bfe" }}>{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-1" style={{ background: "#6C5CE7" }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="h-3 w-3"><polyline points="9 18 15 12 9 6" /></svg>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── DM Auto-Reply Wizard (3 steps) ──────────────────────────────────────────

interface DMWizardProps {
    onClose: () => void;
    onSave: (input: CreateAutomationInput) => Promise<void>;
    saving: boolean;
    savingError: string | null;
    prefill?: { name: string; keywords: string; matchType: "CONTAINS" | "EXACT"; anyKeyword: boolean; replyMessage: string; useAI: boolean; cooldown: number };
    mode?: "create" | "edit";
}

type DMStep = 1 | 2 | 3;
const DM_STEP_LABELS: Record<DMStep, string> = { 1: "Trigger", 2: "Reply", 3: "Review" };

function DMWizard({ onClose, onSave, saving, savingError, prefill, mode = "create" }: DMWizardProps) {
    const isEdit = mode === "edit";
    const [keywords, setKeywords] = React.useState(prefill?.keywords ?? "");
    const [matchType, setMatchType] = React.useState<"CONTAINS" | "EXACT">(prefill?.matchType ?? "CONTAINS");
    const [anyKeyword, setAnyKeyword] = React.useState(prefill?.anyKeyword ?? true);
    const [useAI, setUseAI] = React.useState(prefill?.useAI ?? false);
    const [replyMessage, setReplyMessage] = React.useState(prefill?.replyMessage ?? "Hey! 👋 Thanks for reaching out. How can I help you today?");
    const [automationName, setAutomationName] = React.useState(prefill?.name ?? "");
    const [cooldown, setCooldown] = React.useState(prefill?.cooldown ?? 3600);
    const [step, setStep] = React.useState<DMStep>(1);

    React.useEffect(() => {
        if (automationName && prefill) return;
        setAutomationName(`DM Auto-Reply — ${anyKeyword ? "any DM" : (keywords.trim() || "keyword")}`);
    }, [keywords, anyKeyword, prefill, automationName]);

    const inputStyle = { background: "var(--background)", border: "1px solid var(--border-color)", color: "var(--foreground-color)" };

    const handleSave = async () => {
        await onSave({
            name: automationName.trim(),
            channel: "INSTAGRAM",
            cooldown_seconds: cooldown,
            triggers: [{ type: anyKeyword ? "INSTAGRAM_DM" : "INSTAGRAM_DM_KEYWORD" }],
            conditions: anyKeyword ? [] : [{ operator: matchType, value: keywords.trim(), case_insensitive: true }],
            actions: useAI ? [{ type: "AI_REPLY", order: 0, config: {} }] : [{ type: "SEND_MESSAGE", order: 0, config: { message: replyMessage.trim() } }],
        });
    };

    const canAdvance = () => {
        if (step === 1 && !anyKeyword && !keywords.trim()) return false;
        if (step === 2 && !useAI && !replyMessage.trim()) return false;
        if (step === 3 && !automationName.trim()) return false;
        return true;
    };

    const StepBar = () => (
        <div className="flex items-center gap-1 px-5 pt-3 pb-3 shrink-0">
            {([1, 2, 3] as DMStep[]).map((s) => {
                const done = step > s; const active = step === s;
                return (
                    <React.Fragment key={s}>
                        <button type="button" onClick={() => done ? setStep(s) : undefined} className="flex items-center gap-1 shrink-0" style={{ cursor: done ? "pointer" : "default" }}>
                            <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black" style={done ? { background: "#10B981", color: "#fff" } : active ? { background: "linear-gradient(135deg,#6C5CE7,#a78bfa)", color: "#fff", boxShadow: "0 2px 8px rgba(108,92,231,0.4)" } : { background: "var(--surface-elevated)", color: "var(--foreground-muted)" }}>
                                {done ? "✓" : s}
                            </div>
                            <span className="text-[10px] font-bold" style={{ color: active ? "var(--foreground-color)" : "var(--foreground-muted)" }}>{DM_STEP_LABELS[s]}</span>
                        </button>
                        {s < 3 && <div className="flex-1 h-[2px] rounded-full mx-0.5" style={{ background: done ? "#10B981" : "var(--border-color)" }} />}
                    </React.Fragment>
                );
            })}
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="w-full rounded-t-[32px] shadow-2xl flex flex-col" style={{ background: "var(--surface)", border: "1px solid var(--border-color)", maxHeight: "94dvh", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
                <div className="flex justify-center pt-3 pb-1 shrink-0"><div className="w-10 h-1 rounded-full" style={{ background: "var(--border-color)" }} /></div>
                <div className="flex items-center justify-between px-5 pt-3 pb-0 shrink-0">
                    <div>
                        <h2 className="text-base font-black" style={{ color: "var(--foreground-color)" }}>{isEdit ? "Edit DM Automation" : "DM Auto-Reply"}</h2>
                        <p className="text-[11px] mt-0.5" style={{ color: "var(--foreground-muted)" }}>{step === 1 ? "Set the DM trigger" : step === 2 ? "Configure the reply" : "Name & review"}</p>
                    </div>
                    <button onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: "var(--surface-elevated)", color: "var(--foreground-muted)" }}><X className="h-4 w-4" /></button>
                </div>
                <StepBar />
                <div className="flex-1 overflow-y-auto px-5 pb-2">
                    {step === 1 && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <p className="text-sm font-black" style={{ color: "var(--foreground-color)" }}>When someone sends you a DM…</p>
                                <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>Trigger on any DM or only when it contains a specific keyword.</p>
                            </div>
                            <div className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer" style={{ background: anyKeyword ? "rgba(108,92,231,0.08)" : "var(--surface-elevated)", border: `1px solid ${anyKeyword ? "rgba(108,92,231,0.3)" : "var(--border-color)"}` }} onClick={() => setAnyKeyword(v => !v)}>
                                <div>
                                    <p className="text-sm font-bold" style={{ color: "var(--foreground-color)" }}>Any DM</p>
                                    <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>Reply to every incoming DM regardless of content</p>
                                </div>
                                <div className="relative inline-flex h-6 w-11 rounded-full shrink-0" style={{ background: anyKeyword ? "#6C5CE7" : "var(--border-color)" }}>
                                    <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300" style={{ transform: anyKeyword ? "translateX(20px)" : "translateX(0)" }} />
                                </div>
                            </div>
                            {!anyKeyword && (
                                <>
                                    <div className="flex gap-2">
                                        {(["CONTAINS", "EXACT"] as const).map(t => (
                                            <button key={t} type="button" onClick={() => setMatchType(t)} className="flex-1 py-2 rounded-xl text-xs font-bold" style={matchType === t ? { background: "rgba(108,92,231,0.12)", border: "1px solid #6C5CE7", color: "#a29bfe" } : { background: "var(--surface-elevated)", border: "1px solid var(--border-color)", color: "var(--foreground-muted)" }}>{t === "CONTAINS" ? "Contains" : "Exact match"}</button>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold mb-1.5" style={{ color: "var(--foreground-muted)" }}>Keywords <span className="font-normal">(comma-separated)</span></p>
                                        <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g. price, link, hi, hello" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={{ ...inputStyle, border: "1.5px solid rgba(108,92,231,0.35)" }} autoFocus />
                                    </div>
                                </>
                            )}
                            <div className="rounded-xl px-4 py-3 text-xs" style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-color)" }}>
                                <p className="font-bold mb-1" style={{ color: "var(--foreground-color)" }}>Will trigger when:</p>
                                <p style={{ color: "var(--foreground-muted)" }}>Someone sends you a DM{" "}
                                    {anyKeyword ? <strong style={{ color: "#a29bfe" }}>with any content</strong> : matchType === "CONTAINS" ? <strong style={{ color: "#a29bfe" }}>containing &ldquo;{keywords || "…"}&rdquo;</strong> : <strong style={{ color: "#a29bfe" }}>exactly &ldquo;{keywords || "…"}&rdquo;</strong>} on Instagram.
                                </p>
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <p className="text-sm font-black" style={{ color: "var(--foreground-color)" }}>They will receive…</p>
                                <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>Fixed reply or AI-generated based on your knowledge base.</p>
                            </div>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setUseAI(false)} className="flex-1 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl" style={!useAI ? { background: "rgba(108,92,231,0.12)", border: "1.5px solid #6C5CE7" } : { background: "var(--surface-elevated)", border: "1px solid var(--border-color)" }}>
                                    <MessageCircle className="h-5 w-5" style={{ color: !useAI ? "#a29bfe" : "var(--foreground-muted)" }} />
                                    <span className="text-xs font-bold" style={{ color: !useAI ? "#a29bfe" : "var(--foreground-muted)" }}>Fixed Message</span>
                                    <span className="text-[10px] text-center" style={{ color: "var(--foreground-muted)" }}>Always the same reply</span>
                                </button>
                                <button type="button" onClick={() => setUseAI(true)} className="flex-1 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl" style={useAI ? { background: "rgba(108,92,231,0.12)", border: "1.5px solid #6C5CE7" } : { background: "var(--surface-elevated)", border: "1px solid var(--border-color)" }}>
                                    <Bot className="h-5 w-5" style={{ color: useAI ? "#a29bfe" : "var(--foreground-muted)" }} />
                                    <span className="text-xs font-bold" style={{ color: useAI ? "#a29bfe" : "var(--foreground-muted)" }}>AI Reply</span>
                                    <span className="text-[10px] text-center" style={{ color: "var(--foreground-muted)" }}>Personalised using knowledge base</span>
                                </button>
                            </div>
                            {!useAI ? (
                                <div>
                                    <textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} rows={4} maxLength={1000} placeholder="Hey! 👋 Thanks for reaching out…" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ ...inputStyle, border: "1.5px solid rgba(108,92,231,0.35)" }} />
                                    <p className="text-[10px] mt-1 text-right" style={{ color: "var(--foreground-muted)" }}>{replyMessage.length}/1000</p>
                                    <div className="mt-2 rounded-2xl p-4" style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-color)" }}>
                                        <div className="flex items-end gap-2">
                                            <div className="h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black text-white" style={{ background: "linear-gradient(135deg,#6C5CE7,#a78bfa)" }}>You</div>
                                            <div className="rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-xs max-w-[85%]" style={{ background: "linear-gradient(135deg,#6C5CE7,#a78bfa)", color: "#fff" }}>{replyMessage || "Your message…"}</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl px-4 py-4 space-y-2 text-xs" style={{ background: "rgba(108,92,231,0.08)", border: "1px solid rgba(108,92,231,0.2)" }}>
                                    <p className="font-bold" style={{ color: "#a29bfe" }}>✨ AI will handle replies automatically</p>
                                    <p style={{ color: "var(--foreground-muted)" }}>Reads the DM, checks your Knowledge Base (topics, FAQs, resources), and writes a personalised reply under 200 words.</p>
                                    <p style={{ color: "var(--foreground-muted)" }}>If the user asks to talk to a human, the conversation switches to Human mode automatically.</p>
                                    <p className="font-bold" style={{ color: "var(--foreground-muted)" }}>→ Fill in your Knowledge Base for best results.</p>
                                </div>
                            )}
                        </div>
                    )}
                    {step === 3 && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <p className="text-xs font-bold mb-1.5" style={{ color: "var(--foreground-muted)" }}>Automation name</p>
                                <input value={automationName} onChange={(e) => setAutomationName(e.target.value)} placeholder="e.g. DM Auto-Reply — price enquiry" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
                            </div>
                            <div>
                                <p className="text-xs font-bold mb-1.5" style={{ color: "var(--foreground-muted)" }}>Cooldown — prevents spam per user</p>
                                <select value={cooldown} onChange={(e) => setCooldown(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
                                    <option value={0}>No cooldown</option>
                                    <option value={3600}>1 hour (recommended)</option>
                                    <option value={86400}>24 hours</option>
                                    <option value={604800}>7 days</option>
                                </select>
                            </div>
                            <div className="rounded-2xl p-4 space-y-2" style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-color)" }}>
                                <p className="text-xs font-black" style={{ color: "var(--foreground-color)" }}>Review</p>
                                {[
                                    { label: "Trigger", value: anyKeyword ? "Any Instagram DM" : `DM ${matchType === "CONTAINS" ? "contains" : "equals"} "${keywords}"` },
                                    { label: "Reply", value: useAI ? "AI-generated (uses Knowledge Base)" : replyMessage.slice(0, 60) + (replyMessage.length > 60 ? "…" : "") },
                                    { label: "Cooldown", value: cooldown === 0 ? "None" : cooldown === 3600 ? "1 hour" : cooldown === 86400 ? "24 hours" : "7 days" },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex items-start gap-2 text-xs">
                                        <span className="font-bold shrink-0 w-16" style={{ color: "var(--foreground-muted)" }}>{label}:</span>
                                        <span style={{ color: "var(--foreground-color)" }}>{value}</span>
                                    </div>
                                ))}
                            </div>
                            {savingError && (
                                <div className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
                                    <span>⚠ {savingError}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="shrink-0 flex items-center justify-between gap-3 px-5 py-4" style={{ borderTop: "1px solid var(--border-color)" }}>
                    {step > 1 ? (
                        <button type="button" onClick={() => setStep(s => (s - 1) as DMStep)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold" style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-color)", color: "var(--foreground-muted)" }}>← Back</button>
                    ) : <div />}
                    {step < 3 ? (
                        <button type="button" onClick={() => canAdvance() && setStep(s => (s + 1) as DMStep)} disabled={!canAdvance()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white disabled:opacity-50" style={{ background: "linear-gradient(135deg,#6C5CE7,#a78bfa)", boxShadow: "0 4px 16px rgba(108,92,231,0.35)" }}>Next →</button>
                    ) : (
                        <button type="button" onClick={handleSave} disabled={saving || !automationName.trim()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white disabled:opacity-50" style={{ background: "linear-gradient(135deg,#6C5CE7,#a78bfa)", boxShadow: "0 4px 16px rgba(108,92,231,0.35)" }}>
                            {saving ? <><RefreshCw className="h-4 w-4 animate-spin" />{isEdit ? "Saving…" : "Creating…"}</> : <><Check className="h-4 w-4" />{isEdit ? "Save Changes" : "Create & Activate"}</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Comment → DM Wizard (original 4 steps) ──────────────────────────────────

interface CommentWizardProps {
    onClose: () => void;
    onSave: (input: CreateAutomationInput) => Promise<void>;
    saving: boolean;
    savingError: string | null;
    prefill?: {
        name: string; ig_post_id: string | null; selectedPost: IgMedia | null;
        keywords: string; matchType: "CONTAINS" | "EXACT"; anyKeyword: boolean;
        dmMessage: string; resourceUrl: string;
        publicReplyEnabled: boolean; publicReplyMessage: string; cooldown: number;
    };
    mode?: "create" | "edit";
}

type CWStep = 1 | 2 | 3 | 4;
const CW_STEP_LABELS: Record<CWStep, string> = { 1: "Post", 2: "Keyword", 3: "DM", 4: "Review" };

function CommentWizard({ onClose, onSave, saving, savingError, prefill, mode = "create" }: CommentWizardProps) {
    const isEdit = mode === "edit";
    const [mediaList, setMediaList] = React.useState<IgMedia[]>([]);
    const [nextCursor, setNextCursor] = React.useState<string | null>(null);
    const [mediaLoading, setMediaLoading] = React.useState(true);
    const [mediaLoadingMore, setMediaLoadingMore] = React.useState(false);
    const [mediaError, setMediaError] = React.useState<string | null>(null);
    const [search, setSearch] = React.useState("");
    const [typeFilter, setTypeFilter] = React.useState<"ALL" | "VIDEO" | "IMAGE">("ALL");
    const [selectedPostId, setSelectedPostId] = React.useState<string | null>(prefill?.ig_post_id ?? null);
    const [selectedPost, setSelectedPost] = React.useState<IgMedia | null>(prefill?.selectedPost ?? null);
    const [keywords, setKeywords] = React.useState(prefill?.keywords ?? "");
    const [matchType, setMatchType] = React.useState<"CONTAINS" | "EXACT">(prefill?.matchType ?? "CONTAINS");
    const [anyKeyword, setAnyKeyword] = React.useState(prefill?.anyKeyword ?? false);
    const [dmMessage, setDmMessage] = React.useState(prefill?.dmMessage ?? "Hey! 👋 Here's the resource you requested: {{resource_url}}");
    const [resourceUrl, setResourceUrl] = React.useState(prefill?.resourceUrl ?? "");
    const [publicReplyEnabled, setPublicReplyEnabled] = React.useState(prefill?.publicReplyEnabled ?? false);
    const [publicReplyMsg, setPublicReplyMsg] = React.useState(prefill?.publicReplyMessage ?? "Thanks for your comment! 😊 Check your DMs! 📩");
    const [automationName, setAutomationName] = React.useState(prefill?.name ?? "");
    const [cooldown, setCooldown] = React.useState(prefill?.cooldown ?? 86400);
    const [step, setStep] = React.useState<CWStep>(1);

    const loadMedia = React.useCallback(async (cursor?: string) => {
        const isFirst = !cursor;
        if (isFirst) setMediaLoading(true); else setMediaLoadingMore(true);
        setMediaError(null);
        try {
            const { fetchInstagramMedia } = await import("@/lib/api/accounts.api");
            const page = await fetchInstagramMedia(20, cursor);
            setMediaList(prev => isFirst ? page.items : [...prev, ...page.items]);
            setNextCursor(page.next_cursor);
        } catch (err: unknown) {
            setMediaError(err instanceof Error ? err.message : "Could not load posts");
        } finally {
            if (isFirst) setMediaLoading(false); else setMediaLoadingMore(false);
        }
    }, []);

    React.useEffect(() => { loadMedia(); }, [loadMedia]);

    React.useEffect(() => {
        if (automationName) return;
        const kw = anyKeyword ? "any comment" : keywords.trim() || "keyword";
        const postLabel = selectedPost ? (selectedPost.caption ?? "").slice(0, 30) || "Selected Post" : "All Posts";
        setAutomationName(`${kw} → DM on ${postLabel}`);
    }, [keywords, anyKeyword, selectedPost, automationName]);

    const visibleMedia = React.useMemo(() => mediaList.filter(m => {
        const mt = typeFilter === "ALL" || (typeFilter === "VIDEO" && m.media_type === "VIDEO") || (typeFilter === "IMAGE" && (m.media_type === "IMAGE" || m.media_type === "CAROUSEL_ALBUM"));
        const ms = !search.trim() || (m.caption ?? "").toLowerCase().includes(search.toLowerCase());
        return mt && ms;
    }), [mediaList, typeFilter, search]);

    const previewDm = dmMessage.replace("{{resource_url}}", resourceUrl || "https://your-link.com");
    const step3Valid = !!dmMessage.trim();
    const step4Valid = !!automationName.trim() && (anyKeyword || !!keywords.trim());

    const handleSave = async () => {
        const actions: CreateAutomationInput["actions"] = [];
        if (publicReplyEnabled && publicReplyMsg.trim()) actions.push({ type: "SEND_PUBLIC_REPLY", order: 0, config: { message: publicReplyMsg.trim() } });
        actions.push({ type: "SEND_PRIVATE_REPLY", order: publicReplyEnabled ? 1 : 0, config: { message: dmMessage.trim(), ...(resourceUrl.trim() ? { resource_url: resourceUrl.trim() } : {}) } });
        await onSave({
            name: automationName.trim(), channel: "INSTAGRAM", cooldown_seconds: cooldown,
            triggers: [{ type: anyKeyword ? "INSTAGRAM_COMMENT" : "INSTAGRAM_COMMENT_KEYWORD", ...(selectedPostId ? { ig_post_id: selectedPostId } : {}) }],
            conditions: anyKeyword ? [] : [{ operator: matchType, value: keywords.trim(), case_insensitive: true }],
            actions,
        });
    };

    const inputStyle = { background: "var(--background)", border: "1px solid var(--border-color)", color: "var(--foreground-color)" };
    const canAdvance = () => {
        if (step === 2 && !anyKeyword && !keywords.trim()) return false;
        if (step === 3 && !step3Valid) return false;
        if (step === 4 && !step4Valid) return false;
        return true;
    };

    const StepBar = () => (
        <div className="flex items-center gap-1 px-5 pt-3 pb-3 shrink-0">
            {([1, 2, 3, 4] as CWStep[]).map((s) => {
                const done = step > s; const active = step === s;
                return (
                    <React.Fragment key={s}>
                        <button type="button" onClick={() => done ? setStep(s) : undefined} className="flex items-center gap-1 shrink-0" style={{ cursor: done ? "pointer" : "default" }}>
                            <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black" style={done ? { background: "#10B981", color: "#fff" } : active ? { background: "linear-gradient(135deg,#e1306c,#a78bfa)", color: "#fff", boxShadow: "0 2px 8px rgba(225,48,108,0.4)" } : { background: "var(--surface-elevated)", color: "var(--foreground-muted)" }}>{done ? "✓" : s}</div>
                            <span className="text-[10px] font-bold" style={{ color: active ? "var(--foreground-color)" : "var(--foreground-muted)" }}>{CW_STEP_LABELS[s]}</span>
                        </button>
                        {s < 4 && <div className="flex-1 h-[2px] rounded-full mx-0.5" style={{ background: done ? "#10B981" : "var(--border-color)" }} />}
                    </React.Fragment>
                );
            })}
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="w-full rounded-t-[32px] shadow-2xl flex flex-col" style={{ background: "var(--surface)", border: "1px solid var(--border-color)", maxHeight: "94dvh", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
                <div className="flex justify-center pt-3 pb-1 shrink-0"><div className="w-10 h-1 rounded-full" style={{ background: "var(--border-color)" }} /></div>
                <div className="flex items-center justify-between px-5 pt-3 pb-0 shrink-0">
                    <div>
                        <h2 className="text-base font-black" style={{ color: "var(--foreground-color)" }}>{isEdit ? "Edit Automation" : "Comment → DM Automation"}</h2>
                        <p className="text-[11px] mt-0.5" style={{ color: "var(--foreground-muted)" }}>{step === 1 ? "Select the post to watch" : step === 2 ? "Set the keyword" : step === 3 ? "Write the private DM" : "Public reply & review"}</p>
                    </div>
                    <button onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: "var(--surface-elevated)", color: "var(--foreground-muted)" }}><X className="h-4 w-4" /></button>
                </div>
                <StepBar />
                <div className="flex-1 overflow-y-auto px-5 pb-2">
                    {/* ── Step 1: Post picker ── */}
                    {step === 1 && (
                        <div className="flex flex-col gap-3">
                            <p className="text-sm font-black" style={{ color: "var(--foreground-color)" }}>When someone comments on…</p>
                            <div className="flex gap-2">
                                <div className="flex-1 flex items-center gap-2 px-3 rounded-xl" style={inputStyle}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--foreground-muted)" }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by caption…" className="flex-1 bg-transparent text-xs outline-none py-2" style={{ color: "var(--foreground-color)" }} />
                                    {search && <button type="button" onClick={() => setSearch("")} style={{ color: "var(--foreground-muted)" }}><X className="h-3 w-3" /></button>}
                                </div>
                                <div className="flex rounded-xl overflow-hidden shrink-0" style={{ border: "1px solid var(--border-color)" }}>
                                    {(["ALL", "VIDEO", "IMAGE"] as const).map(t => (
                                        <button key={t} type="button" onClick={() => setTypeFilter(t)} className="px-2.5 py-1.5 text-[10px] font-bold" style={typeFilter === t ? { background: "rgba(225,48,108,0.15)", color: "#e1306c" } : { background: "var(--background)", color: "var(--foreground-muted)" }}>{t === "ALL" ? "All" : t === "VIDEO" ? "Reels" : "Images"}</button>
                                    ))}
                                </div>
                                <button type="button" onClick={() => { setMediaList([]); setNextCursor(null); loadMedia(); }} className="h-9 w-9 flex items-center justify-center rounded-xl shrink-0" style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-color)" }}><RefreshCw className="h-3.5 w-3.5" style={{ color: "var(--foreground-muted)" }} /></button>
                            </div>
                            <button type="button" onClick={() => { setSelectedPostId(null); setSelectedPost(null); }} className="flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-left" style={{ background: selectedPostId === null ? "rgba(225,48,108,0.1)" : "var(--surface-elevated)", border: `1.5px solid ${selectedPostId === null ? "#e1306c" : "var(--border-color)"}` }}>
                                <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 text-xl" style={{ background: "rgba(225,48,108,0.12)" }}>📸</div>
                                <div className="flex-1"><p className="text-sm font-black" style={{ color: "var(--foreground-color)" }}>All Posts &amp; Reels</p><p className="text-xs" style={{ color: "var(--foreground-muted)" }}>Trigger on any comment on any post</p></div>
                                {selectedPostId === null && <div className="h-5 w-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "#e1306c" }}><Check className="h-3 w-3 text-white" /></div>}
                            </button>
                            {mediaLoading ? (
                                <div className="grid grid-cols-3 gap-2">{Array.from({ length: 9 }).map((_, i) => <div key={i} className="aspect-square rounded-xl animate-pulse" style={{ background: "var(--surface-elevated)" }} />)}</div>
                            ) : mediaError ? (
                                <div className="rounded-xl px-4 py-3 text-xs" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
                                    <p className="font-bold mb-1">⚠ Could not load posts</p><p>{mediaError}</p>
                                    <button type="button" onClick={() => loadMedia()} className="mt-2 flex items-center gap-1 text-xs font-bold" style={{ color: "#e1306c" }}><RefreshCw className="h-3 w-3" /> Retry</button>
                                </div>
                            ) : visibleMedia.length === 0 ? (
                                <p className="text-xs text-center py-6" style={{ color: "var(--foreground-muted)" }}>No posts found.</p>
                            ) : (
                                <>
                                    <div className="grid grid-cols-3 gap-2 overflow-y-auto" style={{ maxHeight: "36dvh" }}>
                                        {visibleMedia.map(item => {
                                            const thumb = item.thumbnail_url || item.media_url || "";
                                            const isSel = selectedPostId === item.id;
                                            return (
                                                <button key={item.id} type="button" onClick={() => { setSelectedPostId(item.id); setSelectedPost(item); }} className="relative rounded-xl overflow-hidden aspect-square group" style={{ border: `2.5px solid ${isSel ? "#e1306c" : "transparent"}` }}>
                                                    {thumb
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        ? <img src={thumb} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                                        : <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--surface-elevated)" }}><Camera className="h-5 w-5" style={{ color: "var(--foreground-muted)" }} /></div>}
                                                    {item.media_type === "VIDEO" && <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold text-white" style={{ background: "rgba(0,0,0,0.75)" }}>REEL</div>}
                                                    {isSel && <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(225,48,108,0.2)" }}><div className="h-7 w-7 rounded-full flex items-center justify-center" style={{ background: "#e1306c" }}><Check className="h-4 w-4 text-white" /></div></div>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {nextCursor && !search && typeFilter === "ALL" && (
                                        <button type="button" onClick={() => loadMedia(nextCursor)} disabled={mediaLoadingMore} className="w-full py-2 rounded-xl text-xs font-bold" style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-color)", color: "var(--foreground-muted)" }}>
                                            {mediaLoadingMore ? <RefreshCw className="h-3.5 w-3.5 animate-spin inline" /> : "Load more posts"}
                                        </button>
                                    )}
                                </>
                            )}
                            {selectedPost && (
                                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "rgba(225,48,108,0.08)", border: "1px solid rgba(225,48,108,0.2)" }}>
                                    <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0">
                                        {(selectedPost.thumbnail_url || selectedPost.media_url)
                                            // eslint-disable-next-line @next/next/no-img-element
                                            ? <img src={selectedPost.thumbnail_url || selectedPost.media_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                            : <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--surface-elevated)" }}><Camera className="h-4 w-4" style={{ color: "var(--foreground-muted)" }} /></div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold" style={{ color: "#e1306c" }}>{selectedPost.media_type === "VIDEO" ? "🎬 Reel" : "🖼 Post"} selected</p>
                                        <p className="text-[11px] truncate" style={{ color: "var(--foreground-muted)" }}>{selectedPost.caption?.slice(0, 50) || selectedPost.permalink}</p>
                                    </div>
                                    <a href={selectedPost.permalink} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold shrink-0" style={{ color: "#e1306c" }} onClick={e => e.stopPropagation()}>View ↗</a>
                                </div>
                            )}
                        </div>
                    )}
                    {/* ── Step 2: Keyword ── */}
                    {step === 2 && (
                        <div className="flex flex-col gap-4">
                            <p className="text-sm font-black" style={{ color: "var(--foreground-color)" }}>And this comment has…</p>
                            <div className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer" style={{ background: anyKeyword ? "rgba(225,48,108,0.08)" : "var(--surface-elevated)", border: `1px solid ${anyKeyword ? "rgba(225,48,108,0.3)" : "var(--border-color)"}` }} onClick={() => setAnyKeyword(v => !v)}>
                                <div><p className="text-sm font-bold" style={{ color: "var(--foreground-color)" }}>Any keyword</p><p className="text-xs" style={{ color: "var(--foreground-muted)" }}>Reply to every comment regardless of text</p></div>
                                <div className="relative inline-flex h-6 w-11 rounded-full shrink-0" style={{ background: anyKeyword ? "#e1306c" : "var(--border-color)" }}><span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300" style={{ transform: anyKeyword ? "translateX(20px)" : "translateX(0)" }} /></div>
                            </div>
                            {!anyKeyword && (
                                <>
                                    <div className="flex gap-2">
                                        {(["CONTAINS", "EXACT"] as const).map(t => (
                                            <button key={t} type="button" onClick={() => setMatchType(t)} className="flex-1 py-2 rounded-xl text-xs font-bold" style={matchType === t ? { background: "rgba(225,48,108,0.12)", border: "1px solid #e1306c", color: "#e1306c" } : { background: "var(--surface-elevated)", border: "1px solid var(--border-color)", color: "var(--foreground-muted)" }}>{t === "CONTAINS" ? "Contains" : "Exact match"}</button>
                                        ))}
                                    </div>
                                    <input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="e.g. DSA, notes, pdf, link" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={{ ...inputStyle, border: "1.5px solid rgba(225,48,108,0.35)" }} autoFocus />
                                </>
                            )}
                            <div className="rounded-xl px-4 py-3 text-xs" style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-color)" }}>
                                <p className="font-bold mb-1" style={{ color: "var(--foreground-color)" }}>Will trigger when:</p>
                                <p style={{ color: "var(--foreground-muted)" }}>Someone comments {anyKeyword ? <strong style={{ color: "#e1306c" }}>anything</strong> : matchType === "CONTAINS" ? <strong style={{ color: "#e1306c" }}>containing &ldquo;{keywords || "…"}&rdquo;</strong> : <strong style={{ color: "#e1306c" }}>exactly &ldquo;{keywords || "…"}&rdquo;</strong>} on {selectedPost ? <strong style={{ color: "#e1306c" }}>{(selectedPost.caption ?? "").slice(0, 30) || "selected post"}</strong> : "any post"}.</p>
                            </div>
                        </div>
                    )}
                    {/* ── Step 3: DM Message ── */}
                    {step === 3 && (
                        <div className="flex flex-col gap-4">
                            <p className="text-sm font-black" style={{ color: "var(--foreground-color)" }}>They will get a private DM…</p>
                            <div>
                                <textarea value={dmMessage} onChange={e => setDmMessage(e.target.value)} rows={4} maxLength={1000} placeholder="Hey! 👋 Here's the resource: {{resource_url}}" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none" style={{ ...inputStyle, border: "1.5px solid rgba(225,48,108,0.35)" }} />
                                <p className="text-[10px] mt-1 text-right" style={{ color: "var(--foreground-muted)" }}>{dmMessage.length}/1000</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold mb-1.5" style={{ color: "var(--foreground-muted)" }}>Resource URL — replaces <code className="text-[10px] font-mono">{"{{resource_url}}"}</code></p>
                                <input value={resourceUrl} onChange={e => setResourceUrl(e.target.value)} type="url" placeholder="https://your-domain.com/resource.pdf" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
                            </div>
                            <div className="rounded-2xl p-4" style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-color)" }}>
                                <div className="flex items-end gap-2">
                                    <div className="h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black text-white" style={{ background: "linear-gradient(135deg,#e1306c,#833ab4)" }}>You</div>
                                    <div className="rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-xs max-w-[85%]" style={{ background: "linear-gradient(135deg,#833ab4,#e1306c)", color: "#fff" }}>{previewDm}</div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* ── Step 4: Review ── */}
                    {step === 4 && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <p className="text-sm font-black mb-2" style={{ color: "var(--foreground-color)" }}>Also reply publicly? <span className="text-xs font-normal" style={{ color: "var(--foreground-muted)" }}>(optional)</span></p>
                                <div className="flex items-start justify-between px-4 py-3 rounded-xl cursor-pointer" style={{ background: publicReplyEnabled ? "rgba(225,48,108,0.08)" : "var(--surface-elevated)", border: `1px solid ${publicReplyEnabled ? "rgba(225,48,108,0.3)" : "var(--border-color)"}` }} onClick={() => setPublicReplyEnabled(v => !v)}>
                                    <div className="flex-1 pr-4"><p className="text-sm font-bold" style={{ color: "var(--foreground-color)" }}>Public comment reply</p><p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>Visible under the post. Requires <code className="text-[10px]">instagram_manage_comments</code>.</p></div>
                                    <div className="relative inline-flex h-6 w-11 rounded-full shrink-0 mt-0.5" style={{ background: publicReplyEnabled ? "#e1306c" : "var(--border-color)" }}><span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300" style={{ transform: publicReplyEnabled ? "translateX(20px)" : "translateX(0)" }} /></div>
                                </div>
                                {publicReplyEnabled && (
                                    <div className="mt-2">
                                        <textarea value={publicReplyMsg} onChange={e => setPublicReplyMsg(e.target.value)} rows={2} maxLength={2200} placeholder="Thanks for your comment! 😊 Check your DMs! 📩" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none mt-2" style={{ ...inputStyle, border: "1.5px solid rgba(225,48,108,0.3)" }} />
                                        <p className="text-[10px] mt-1 text-right" style={{ color: "var(--foreground-muted)" }}>{publicReplyMsg.length}/2200</p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-xs font-bold mb-1.5" style={{ color: "var(--foreground-muted)" }}>Automation name</p>
                                <input value={automationName} onChange={e => setAutomationName(e.target.value)} placeholder="e.g. DSA PDF Auto Reply" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
                            </div>
                            <div>
                                <p className="text-xs font-bold mb-1.5" style={{ color: "var(--foreground-muted)" }}>Cooldown</p>
                                <select value={cooldown} onChange={e => setCooldown(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
                                    <option value={0}>No cooldown</option>
                                    <option value={3600}>1 hour</option>
                                    <option value={86400}>24 hours (recommended)</option>
                                    <option value={604800}>7 days</option>
                                </select>
                            </div>
                            <div className="rounded-2xl p-4 space-y-2" style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-color)" }}>
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
                                        <span style={{ color: "var(--foreground-color)" }}>{value}</span>
                                    </div>
                                ))}
                            </div>
                            {savingError && <div className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}><span>⚠ {savingError}</span></div>}
                        </div>
                    )}
                </div>
                <div className="shrink-0 flex items-center justify-between gap-3 px-5 py-4" style={{ borderTop: "1px solid var(--border-color)" }}>
                    {step > 1 ? <button type="button" onClick={() => setStep(s => (s - 1) as CWStep)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold" style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-color)", color: "var(--foreground-muted)" }}>← Back</button> : <div />}
                    {step < 4
                        ? <button type="button" onClick={() => canAdvance() && setStep(s => (s + 1) as CWStep)} disabled={!canAdvance()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white disabled:opacity-50" style={{ background: "linear-gradient(135deg,#e1306c,#a78bfa)", boxShadow: "0 4px 16px rgba(225,48,108,0.35)" }}>Next →</button>
                        : <button type="button" onClick={handleSave} disabled={saving || !step4Valid} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white disabled:opacity-50" style={{ background: "linear-gradient(135deg,#e1306c,#a78bfa)", boxShadow: "0 4px 16px rgba(225,48,108,0.35)" }}>
                            {saving ? <><RefreshCw className="h-4 w-4 animate-spin" />{isEdit ? "Saving…" : "Creating…"}</> : <><Check className="h-4 w-4" />{isEdit ? "Save Changes" : "Create & Activate"}</>}
                        </button>}
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AutomationsPage() {
    const [automations, setAutomations] = React.useState<Automation[]>([]);
    const [stats, setStats] = React.useState<AutomationStats | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [loadError, setLoadError] = React.useState<string | null>(null);

    // Modal state: type selector → opens the right wizard
    const [showTypeSelector, setShowTypeSelector] = React.useState(false);
    const [activeWizard, setActiveWizard] = React.useState<AutomationType | null>(null);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [editingType, setEditingType] = React.useState<AutomationType | null>(null);

    const [saving, setSaving] = React.useState(false);
    const [savingError, setSavingError] = React.useState<string | null>(null);
    const [toggling, setToggling] = React.useState<string | null>(null);
    const [deleting, setDeleting] = React.useState<string | null>(null);
    const [logsFor, setLogsFor] = React.useState<string | null>(null);

    const load = React.useCallback(async () => {
        setLoading(true); setLoadError(null);
        try {
            const [autoList, autoStats] = await Promise.all([fetchAutomations(), fetchAutomationStats()]);
            setAutomations(autoList); setStats(autoStats);
        } catch (err) {
            setLoadError(err instanceof Error ? err.message : "Failed to load automations.");
        } finally { setLoading(false); }
    }, []);

    React.useEffect(() => { load(); }, [load]);

    const closeAll = () => { setShowTypeSelector(false); setActiveWizard(null); setEditingId(null); setEditingType(null); setSavingError(null); };

    const handleCreate = async (input: CreateAutomationInput) => {
        setSaving(true); setSavingError(null);
        try {
            const created = await createAutomation(input);
            const activated = await activateAutomation(created.id).catch(() => created);
            setAutomations(prev => [activated, ...prev]);
            closeAll();
            void fetchAutomationStats().then(setStats).catch(() => { });
        } catch (err) {
            setSavingError(err instanceof Error ? err.message : "Failed to create automation.");
        } finally { setSaving(false); }
    };

    const handleEdit = async (input: CreateAutomationInput) => {
        if (!editingId) return;
        setSaving(true); setSavingError(null);
        try {
            const updated = await updateAutomation(editingId, input);
            setAutomations(prev => prev.map(a => a.id === editingId ? updated : a));
            closeAll();
            void fetchAutomationStats().then(setStats).catch(() => { });
        } catch (err) {
            setSavingError(err instanceof Error ? err.message : "Failed to update automation.");
        } finally { setSaving(false); }
    };

    const handleToggle = async (id: string, activate: boolean) => {
        setToggling(id);
        try {
            const updated = activate ? await activateAutomation(id) : await pauseAutomation(id);
            setAutomations(prev => prev.map(a => a.id === id ? { ...a, status: updated.status } : a));
            void fetchAutomationStats().then(setStats).catch(() => { });
        } catch { } finally { setToggling(null); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this automation? This cannot be undone.")) return;
        setDeleting(id);
        try {
            await deleteAutomation(id);
            setAutomations(prev => prev.filter(a => a.id !== id));
            void fetchAutomationStats().then(setStats).catch(() => { });
        } catch { } finally { setDeleting(null); }
    };

    const handleEditOpen = (id: string) => {
        const auto = automations.find(a => a.id === id);
        if (!auto) return;
        setEditingId(id);
        setEditingType(detectAutomationType(auto));
    };

    // Build prefill for edit — comment wizard
    const editingAuto = editingId ? automations.find(a => a.id === editingId) : null;
    const commentPrefill = editingAuto && editingType === "comment" ? (() => {
        const editTriggers = editingAuto.triggers ?? [];
        const editConditions = editingAuto.conditions ?? [];
        const editActions = editingAuto.actions ?? [];
        const trigger = editTriggers[0];
        const condition = editConditions[0];
        const dmAction = editActions.find(a => a.type === "SEND_PRIVATE_REPLY");
        const pubAction = editActions.find(a => a.type === "SEND_PUBLIC_REPLY");
        const cfg = dmAction?.config as Record<string, unknown> | undefined;
        const pubCfg = pubAction?.config as Record<string, unknown> | undefined;
        return {
            name: editingAuto.name,
            ig_post_id: trigger?.ig_post_id ?? null,
            selectedPost: null,
            keywords: condition?.value ?? "",
            matchType: (condition?.operator === "EXACT" ? "EXACT" : "CONTAINS") as "CONTAINS" | "EXACT",
            anyKeyword: !condition || condition.operator === "ANY" || editConditions.length === 0,
            dmMessage: (cfg?.message as string) ?? "",
            resourceUrl: (cfg?.resource_url as string) ?? "",
            publicReplyEnabled: !!pubAction,
            publicReplyMessage: (pubCfg?.message as string) ?? "",
            cooldown: editingAuto.cooldown_seconds,
        };
    })() : undefined;

    // Build prefill for edit — DM wizard
    const dmPrefill = editingAuto && editingType === "dm" ? (() => {
        const editConditions = editingAuto.conditions ?? [];
        const editActions = editingAuto.actions ?? [];
        const condition = editConditions[0];
        const action = editActions[0];
        const cfg = action?.config as Record<string, unknown> | undefined;
        return {
            name: editingAuto.name,
            keywords: condition?.value ?? "",
            matchType: (condition?.operator === "EXACT" ? "EXACT" : "CONTAINS") as "CONTAINS" | "EXACT",
            anyKeyword: !condition || condition.operator === "ANY" || editConditions.length === 0,
            replyMessage: (cfg?.message as string) ?? "",
            useAI: action?.type === "AI_REPLY",
            cooldown: editingAuto.cooldown_seconds,
        };
    })() : undefined;

    return (
        <div className="flex flex-col flex-1 min-h-0 p-3 sm:p-5" style={{ background: "var(--background)" }}>

            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: "rgba(108,92,231,0.12)", border: "1px solid rgba(108,92,231,0.25)", color: "#a29bfe" }}>
                        <Zap className="h-3 w-3" /><span>AUTOMATION</span>
                    </div>
                    <button onClick={() => setShowTypeSelector(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
                        style={{ background: "linear-gradient(135deg,#e1306c,#a78bfa)", boxShadow: "0 4px 12px rgba(225,48,108,0.35)" }}>
                        <Plus className="h-3.5 w-3.5" />New
                    </button>
                </div>
            </div>

            {/* Error */}
            {loadError && (
                <div className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-5" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
                    <AlertCircle className="h-4 w-4 shrink-0" style={{ color: "#EF4444" }} />
                    <p className="text-sm flex-1" style={{ color: "#EF4444" }}>{loadError}</p>
                    <button onClick={load} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>
                        <RefreshCw className="h-3 w-3" />Retry
                    </button>
                </div>
            )}

            {/* Stats */}
            {stats && (
                <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
                    <StatCard label="Total" value={stats.total} icon={Zap} color="#a29bfe" />
                    <StatCard label="Active" value={stats.active} icon={Activity} color="#10B981" />
                    <StatCard label="Runs" value={stats.totalExecs} icon={BarChart2} color="#F59E0B" />
                    <StatCard label="Succeeded" value={stats.successExecs} icon={CheckCircle2} color="#10B981" />
                    <StatCard label="Failed" value={stats.failedExecs} icon={AlertCircle} color="#EF4444" />
                </div>
            )}

            {/* List */}
            {loading ? (
                <div className="flex items-center justify-center py-20"><RefreshCw className="h-6 w-6 animate-spin" style={{ color: "#6C5CE7" }} /></div>
            ) : automations.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 rounded-2xl py-20" style={{ background: "var(--surface)", border: "2px dashed rgba(108,92,231,0.2)" }}>
                    <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg,#6C5CE7,#a29bfe)", boxShadow: "0 8px 28px rgba(108,92,231,0.35)" }}><Zap className="h-8 w-8 text-white" /></div>
                    <h2 className="text-lg font-black mb-2" style={{ color: "var(--foreground-color)" }}>No automations yet</h2>
                    <p className="text-sm text-center max-w-sm mb-6 leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                        Create your first automation to auto-reply to comments and DMs — even while you sleep.
                    </p>
                    <button onClick={() => setShowTypeSelector(true)} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,#6C5CE7,#a29bfe)", boxShadow: "0 4px 18px rgba(108,92,231,0.4)" }}>
                        <Plus className="h-4 w-4" />Create First Automation
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {automations.map(auto => (
                        <AutomationCard key={auto.id} automation={auto} onToggle={handleToggle} onDelete={handleDelete} onViewLogs={setLogsFor} onEdit={handleEditOpen} deleting={deleting} toggling={toggling} />
                    ))}
                </div>
            )}

            {/* How it works */}
            {!loading && (
                <div className="mt-6 rounded-2xl p-5" style={{ background: "rgba(108,92,231,0.08)", border: "1px solid rgba(108,92,231,0.2)" }}>
                    <div className="flex items-center gap-2 mb-3"><Sparkles className="h-4 w-4" style={{ color: "#a29bfe" }} /><span className="text-xs font-black" style={{ color: "#a29bfe" }}>HOW AUTOMATIONS WORK</span></div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {[
                            { icon: MessageCircle, title: "1. Trigger", desc: "A DM or comment arrives on your connected Instagram account." },
                            { icon: CheckCircle2, title: "2. Condition", desc: "Optionally only fire if the message matches a keyword." },
                            { icon: Bot, title: "3. Action", desc: "Send a fixed reply, link, or let AI craft a personalized response." },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="flex gap-3 flex-1">
                                <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(108,92,231,0.15)" }}><Icon className="h-4 w-4" style={{ color: "#a29bfe" }} /></div>
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

            {/* Type selector — shown when clicking New */}
            {showTypeSelector && (
                <TypeSelector
                    onSelect={(type) => { setShowTypeSelector(false); setActiveWizard(type); }}
                    onClose={() => setShowTypeSelector(false)}
                />
            )}

            {/* Comment wizard — new */}
            {activeWizard === "comment" && (
                <CommentWizard onClose={closeAll} onSave={handleCreate} saving={saving} savingError={savingError} mode="create" />
            )}

            {/* DM wizard — new */}
            {activeWizard === "dm" && (
                <DMWizard onClose={closeAll} onSave={handleCreate} saving={saving} savingError={savingError} mode="create" />
            )}

            {/* Comment wizard — edit */}
            {editingId && editingType === "comment" && commentPrefill && (
                <CommentWizard onClose={closeAll} onSave={handleEdit} saving={saving} savingError={savingError} mode="edit" prefill={commentPrefill} />
            )}

            {/* DM wizard — edit */}
            {editingId && editingType === "dm" && dmPrefill && (
                <DMWizard onClose={closeAll} onSave={handleEdit} saving={saving} savingError={savingError} mode="edit" prefill={dmPrefill} />
            )}

            {/* Logs */}
            {logsFor && <LogsPanel automationId={logsFor} onClose={() => setLogsFor(null)} />}
        </div>
    );
}
