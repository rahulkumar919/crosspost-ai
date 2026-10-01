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
    deleting: string | null;
    toggling: string | null;
}

function AutomationCard({ automation, onToggle, onDelete, onViewLogs, deleting, toggling }: AutomationCardProps) {
    const isActive = automation.status === "ACTIVE";
    const execCount = automation._count?.executions ?? 0;
    const [expanded, setExpanded] = React.useState(false);

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
                    {/* Channel icon */}
                    <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: channelBg(automation.channel) }}
                    >
                        {channelIcon(automation.channel)}
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

// ─── Create Automation Modal ──────────────────────────────────────────────────

interface CreateModalProps {
    onClose: () => void;
    onCreate: (input: CreateAutomationInput) => Promise<void>;
    saving: boolean;
}

function CreateAutomationModal({ onClose, onCreate, saving }: CreateModalProps) {
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [channel, setChannel] = React.useState<AutomationChannel>("INSTAGRAM");
    const [triggerType, setTriggerType] = React.useState<AutomationTriggerType>("INSTAGRAM_DM");
    const [conditionOperator, setConditionOperator] = React.useState<AutomationConditionOperator>("CONTAINS");
    const [conditionValue, setConditionValue] = React.useState("");
    const [hasCondition, setHasCondition] = React.useState(false);
    const [actionType, setActionType] = React.useState<AutomationActionType>("SEND_MESSAGE");
    const [actionMessage, setActionMessage] = React.useState("");
    const [tagName, setTagName] = React.useState("");
    const [linkUrl, setLinkUrl] = React.useState("");
    const [cooldownSeconds, setCooldownSeconds] = React.useState(0);

    // Reset trigger to a valid one when channel changes
    React.useEffect(() => {
        const validTriggers = TRIGGERS_BY_CHANNEL[channel];
        if (!validTriggers.includes(triggerType)) {
            setTriggerType(validTriggers[0]);
        }
    }, [channel, triggerType]);

    const needsMessage = actionType === "SEND_MESSAGE" || actionType === "SEND_PUBLIC_REPLY" || actionType === "SEND_PRIVATE_REPLY" || actionType === "AI_REPLY";
    const needsLink = actionType === "SEND_LINK";
    const needsTag = actionType === "TAG_CONVERSATION";
    const isValid = name.trim() && (
        needsMessage ? actionMessage.trim() :
        needsLink ? (actionMessage.trim() && linkUrl.trim()) :
        needsTag ? tagName.trim() : true
    );

    const buildActionConfig = (): Record<string, unknown> => {
        if (needsMessage) return actionType === "AI_REPLY" ? { prompt: actionMessage } : { message: actionMessage };
        if (needsLink) return { message: actionMessage, url: linkUrl, buttonText: "Learn More" };
        if (needsTag) return { tagName, color: "#6C5CE7" };
        return {};
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        const input: CreateAutomationInput = {
            name: name.trim(),
            description: description.trim() || undefined,
            channel,
            cooldown_seconds: cooldownSeconds,
            triggers: [{ type: triggerType }],
            conditions: hasCondition && conditionValue.trim()
                ? [{ operator: conditionOperator, value: conditionValue.trim() }]
                : [],
            actions: [{ type: actionType, config: buildActionConfig() }],
        };

        await onCreate(input);
    };

    const inputStyle = {
        background: "var(--background)",
        border: "1px solid var(--border-color)",
        color: "var(--foreground-color)",
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
                style={{ background: "var(--surface)", border: "1px solid var(--border-color)" }}
            >
                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border-color)" }}>
                    <div>
                        <h2 className="text-lg font-black" style={{ color: "var(--foreground-color)" }}>Create Automation</h2>
                        <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>Trigger → Condition → Action</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 rounded-xl flex items-center justify-center transition-all hover:bg-red-500/10"
                        style={{ color: "var(--foreground-muted)" }}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">

                    {/* Name */}
                    <div>
                        <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--foreground-muted)" }}>
                            Automation Name *
                        </label>
                        <input
                            id="automation-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Welcome DM Reply"
                            required
                            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                            style={inputStyle}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--foreground-muted)" }}>
                            Description (optional)
                        </label>
                        <input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What does this automation do?"
                            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                            style={inputStyle}
                        />
                    </div>

                    {/* Channel */}
                    <div>
                        <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--foreground-muted)" }}>
                            Channel *
                        </label>
                        <div className="flex gap-2">
                            {(["INSTAGRAM", "WHATSAPP", "BOTH"] as AutomationChannel[]).map((ch) => {
                                const colors = { INSTAGRAM: "#e1306c", WHATSAPP: "#25D366", BOTH: "#a29bfe" };
                                const bgs = { INSTAGRAM: "rgba(225,48,108,0.15)", WHATSAPP: "rgba(37,211,102,0.15)", BOTH: "rgba(108,92,231,0.15)" };
                                const icons = { INSTAGRAM: Camera, WHATSAPP: Phone, BOTH: MessageSquare };
                                const Icon = icons[ch];
                                return (
                                    <button
                                        key={ch}
                                        type="button"
                                        onClick={() => setChannel(ch)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
                                        style={
                                            channel === ch
                                                ? { background: bgs[ch], border: `1px solid ${colors[ch]}`, color: colors[ch] }
                                                : { background: "var(--background)", border: "1px solid var(--border-color)", color: "var(--foreground-muted)" }
                                        }
                                    >
                                        <Icon className="h-4 w-4" />
                                        {ch === "BOTH" ? "Both" : ch === "INSTAGRAM" ? "Instagram" : "WhatsApp"}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Trigger */}
                    <div>
                        <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--foreground-muted)" }}>
                            ⚡ Trigger (when this happens)
                        </label>
                        <select
                            id="automation-trigger"
                            value={triggerType}
                            onChange={(e) => setTriggerType(e.target.value as AutomationTriggerType)}
                            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                            style={inputStyle}
                        >
                            {TRIGGERS_BY_CHANNEL[channel].map((val) => (
                                <option key={val} value={val}>{TRIGGER_LABELS[val]}</option>
                            ))}
                        </select>
                    </div>

                    {/* Optional condition */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold mb-2 cursor-pointer" style={{ color: "var(--foreground-muted)" }}>
                            <input
                                type="checkbox"
                                checked={hasCondition}
                                onChange={(e) => setHasCondition(e.target.checked)}
                                className="rounded"
                            />
                            Add keyword condition (filter by message content)
                        </label>
                        {hasCondition && (
                            <div className="flex gap-2">
                                <select
                                    value={conditionOperator}
                                    onChange={(e) => setConditionOperator(e.target.value as AutomationConditionOperator)}
                                    className="px-3 py-2.5 rounded-xl text-sm outline-none shrink-0"
                                    style={inputStyle}
                                >
                                    {(Object.entries(OPERATOR_LABELS) as [AutomationConditionOperator, string][]).map(([val, label]) => (
                                        <option key={val} value={val}>{label}</option>
                                    ))}
                                </select>
                                <input
                                    value={conditionValue}
                                    onChange={(e) => setConditionValue(e.target.value)}
                                    placeholder="e.g. price, hello, info"
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                                    style={{ ...inputStyle, border: "1px solid rgba(236,72,153,0.3)" }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Action */}
                    <div>
                        <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--foreground-muted)" }}>
                            → Action (then do this)
                        </label>
                        <select
                            id="automation-action"
                            value={actionType}
                            onChange={(e) => setActionType(e.target.value as AutomationActionType)}
                            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none mb-2"
                            style={inputStyle}
                        >
                            {(Object.entries(ACTION_LABELS) as [AutomationActionType, string][]).map(([val, label]) => (
                                <option key={val} value={val}>{label}</option>
                            ))}
                        </select>

                        {needsMessage && (
                            <textarea
                                id="automation-message"
                                value={actionMessage}
                                onChange={(e) => setActionMessage(e.target.value)}
                                placeholder={
                                    actionType === "AI_REPLY"
                                        ? "e.g. You are a helpful assistant for my brand. Answer questions about pricing and services."
                                        : "e.g. Hi! Thanks for your DM. We'll get back to you soon! 🙌"
                                }
                                rows={3}
                                required
                                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                                style={{ ...inputStyle, border: "1px solid rgba(16,185,129,0.3)" }}
                            />
                        )}

                        {needsLink && (
                            <div className="space-y-2">
                                <textarea
                                    value={actionMessage}
                                    onChange={(e) => setActionMessage(e.target.value)}
                                    placeholder="Message text (e.g. Check out my new course!)"
                                    rows={2}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                                    style={{ ...inputStyle, border: "1px solid rgba(16,185,129,0.3)" }}
                                />
                                <input
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://your-link.com"
                                    type="url"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                                    style={{ ...inputStyle, border: "1px solid rgba(16,185,129,0.3)" }}
                                />
                            </div>
                        )}

                        {needsTag && (
                            <input
                                value={tagName}
                                onChange={(e) => setTagName(e.target.value)}
                                placeholder="Tag name (e.g. interested, hot-lead)"
                                required
                                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                                style={{ ...inputStyle, border: "1px solid rgba(16,185,129,0.3)" }}
                            />
                        )}

                        {(actionType === "ASSIGN_HUMAN" || actionType === "PAUSE_AUTOMATION") && (
                            <p className="text-xs px-3 py-2 rounded-xl" style={{ background: "var(--background)", color: "var(--foreground-muted)" }}>
                                {actionType === "ASSIGN_HUMAN"
                                    ? "The conversation will be routed to a human agent and bots won't reply until it's re-opened."
                                    : "The bot will stop replying to this conversation until manually resumed."}
                            </p>
                        )}
                    </div>

                    {/* Cooldown */}
                    <div>
                        <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--foreground-muted)" }}>
                            Cooldown (seconds between re-fires per conversation)
                        </label>
                        <select
                            value={cooldownSeconds}
                            onChange={(e) => setCooldownSeconds(Number(e.target.value))}
                            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                            style={inputStyle}
                        >
                            <option value={0}>No cooldown (fire on every message)</option>
                            <option value={60}>1 minute</option>
                            <option value={300}>5 minutes</option>
                            <option value={3600}>1 hour</option>
                            <option value={86400}>24 hours</option>
                        </select>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={saving || !isValid}
                        className="w-full py-3 rounded-xl text-sm font-black text-white transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
                        style={{
                            background: "linear-gradient(135deg, #6C5CE7, #a29bfe)",
                            boxShadow: "0 4px 18px rgba(108,92,231,0.4)",
                            opacity: saving || !isValid ? 0.6 : 1,
                        }}
                    >
                        {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        {saving ? "Creating…" : "Create Automation"}
                    </button>
                </form>
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AutomationsPage() {
    const [automations, setAutomations] = React.useState<Automation[]>([]);
    const [stats, setStats] = React.useState<AutomationStats | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [loadError, setLoadError] = React.useState<string | null>(null);
    const [showModal, setShowModal] = React.useState(false);
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
            setAutomations((prev) => [created, ...prev]);
            setShowModal(false);
            fetchAutomationStats().then(setStats).catch(() => {});
        } catch (err) {
            setSavingError(err instanceof Error ? err.message : "Failed to create automation.");
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (id: string, activate: boolean) => {
        setToggling(id);
        try {
            const updated = activate ? await activateAutomation(id) : await pauseAutomation(id);
            setAutomations((prev) => prev.map((a) => (a.id === id ? { ...a, status: updated.status } : a)));
            fetchAutomationStats().then(setStats).catch(() => {});
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
            fetchAutomationStats().then(setStats).catch(() => {});
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
                <CreateAutomationModal
                    onClose={() => setShowModal(false)}
                    onCreate={handleCreate}
                    saving={saving}
                />
            )}
            {logsFor && (
                <LogsPanel
                    automationId={logsFor}
                    onClose={() => setLogsFor(null)}
                />
            )}
        </div>
    );
}