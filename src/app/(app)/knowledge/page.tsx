"use client";

import * as React from "react";
import {
    BookOpen, Plus, Trash2, Save, RefreshCw, Sparkles,
    User, Tag, Link, HelpCircle, Phone, FileText,
    ChevronDown, ChevronUp, Check, X, Bot,
} from "lucide-react";
import {
    fetchKnowledgeBase,
    upsertKnowledgeBase,
    type KnowledgeBase,
    type KnowledgeBaseInput,
} from "@/lib/api/knowledge.api";

// ─── Collapsible Section ───────────────────────────────────────────────────────

function Section({
    icon: Icon,
    title,
    subtitle,
    color,
    children,
    defaultOpen = false,
}: {
    icon: React.ElementType;
    title: string;
    subtitle: string;
    color: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = React.useState(defaultOpen);

    return (
        <div
            className="rounded-2xl overflow-hidden transition-all"
            style={{ background: "var(--surface)", border: "1px solid var(--border-color)" }}
        >
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full px-5 py-4 transition-all hover:opacity-80"
            >
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
                        <Icon className="h-5 w-5" style={{ color }} />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-black" style={{ color: "var(--foreground-color)" }}>{title}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: "var(--foreground-muted)" }}>{subtitle}</p>
                    </div>
                </div>
                {open
                    ? <ChevronUp className="h-4 w-4 shrink-0" style={{ color: "var(--foreground-muted)" }} />
                    : <ChevronDown className="h-4 w-4 shrink-0" style={{ color: "var(--foreground-muted)" }} />}
            </button>
            {open && (
                <div className="px-5 pb-5 border-t" style={{ borderColor: "var(--border-color)" }}>
                    <div className="pt-4">{children}</div>
                </div>
            )}
        </div>
    );
}

// ─── Dynamic list editor ───────────────────────────────────────────────────────

interface ListItem {
    [key: string]: string;
}

function DynamicList({
    items,
    onChange,
    fields,
    addLabel,
}: {
    items: ListItem[];
    onChange: (items: ListItem[]) => void;
    fields: { key: string; label: string; placeholder: string; multiline?: boolean }[];
    addLabel: string;
}) {
    const addItem = () => {
        const empty = Object.fromEntries(fields.map((f) => [f.key, ""]));
        onChange([...items, empty]);
    };

    const updateItem = (index: number, key: string, value: string) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [key]: value };
        onChange(updated);
    };

    const removeItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const inputStyle: React.CSSProperties = {
        background: "var(--background)",
        border: "1px solid var(--border-color)",
        color: "var(--foreground-color)",
        borderRadius: "10px",
        padding: "8px 12px",
        fontSize: "13px",
        outline: "none",
        width: "100%",
        fontFamily: "inherit",
    };

    return (
        <div className="space-y-3">
            {items.map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                    <div className={`flex-1 ${fields.length > 1 ? "grid gap-2" : ""}`} style={fields.length > 1 ? { gridTemplateColumns: `repeat(${fields.length}, 1fr)` } : {}}>
                        {fields.map((f) =>
                            f.multiline ? (
                                <textarea
                                    key={f.key}
                                    value={item[f.key] ?? ""}
                                    onChange={(e) => updateItem(i, f.key, e.target.value)}
                                    placeholder={f.placeholder}
                                    rows={2}
                                    style={{ ...inputStyle, resize: "vertical" }}
                                />
                            ) : (
                                <input
                                    key={f.key}
                                    value={item[f.key] ?? ""}
                                    onChange={(e) => updateItem(i, f.key, e.target.value)}
                                    placeholder={f.placeholder}
                                    style={inputStyle}
                                />
                            )
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => removeItem(i)}
                        className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all hover:scale-105"
                        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-95"
                style={{ background: "rgba(108,92,231,0.1)", border: "1px solid rgba(108,92,231,0.2)", color: "#a29bfe" }}
            >
                <Plus className="h-3.5 w-3.5" />
                {addLabel}
            </button>
        </div>
    );
}

// ─── Tags editor ──────────────────────────────────────────────────────────────

function TagsEditor({
    tags,
    onChange,
    placeholder,
}: {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder: string;
}) {
    const [input, setInput] = React.useState("");

    const add = () => {
        const val = input.trim();
        if (val && !tags.includes(val)) {
            onChange([...tags, val]);
            setInput("");
        }
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background: "rgba(108,92,231,0.12)", border: "1px solid rgba(108,92,231,0.2)", color: "#a29bfe" }}
                    >
                        {tag}
                        <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))}>
                            <X className="h-2.5 w-2.5" />
                        </button>
                    </span>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
                    placeholder={placeholder}
                    className="flex-1 px-4 py-2 rounded-xl text-sm outline-none"
                    style={{ background: "var(--background)", border: "1px solid var(--border-color)", color: "var(--foreground-color)" }}
                />
                <button
                    type="button"
                    onClick={add}
                    className="px-3 py-2 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-95"
                    style={{ background: "rgba(108,92,231,0.12)", border: "1px solid rgba(108,92,231,0.2)", color: "#a29bfe" }}
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function KnowledgePage() {
    const [kb, setKb] = React.useState<KnowledgeBase | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [saved, setSaved] = React.useState(false);

    // Form state
    const [creatorName, setCreatorName] = React.useState("");
    const [about, setAbout] = React.useState("");
    const [topics, setTopics] = React.useState<string[]>([]);
    const [systemPrompt, setSystemPrompt] = React.useState("");
    const [services, setServices] = React.useState<Array<{ name: string; description: string }>>([]);
    const [courses, setCourses] = React.useState<Array<{ name: string; url: string; description: string }>>([]);
    const [resources, setResources] = React.useState<Array<{ name: string; url: string; description: string }>>([]);
    const [faqs, setFaqs] = React.useState<Array<{ question: string; answer: string }>>([]);
    const [links, setLinks] = React.useState<Array<{ label: string; url: string }>>([]);
    const [policies, setPolicies] = React.useState("");

    // Populate from KB
    React.useEffect(() => {
        fetchKnowledgeBase()
            .then((data) => {
                if (data) {
                    setKb(data);
                    setCreatorName(data.creator_name ?? "");
                    setAbout(data.about ?? "");
                    setTopics(data.topics ?? []);
                    setSystemPrompt(data.ai_system_prompt ?? "");
                    setServices((data.services as { name: string; description: string }[]) ?? []);
                    setCourses((data.courses as { name: string; url: string; description: string }[]) ?? []);
                    setResources((data.resources as { name: string; url: string; description: string }[]) ?? []);
                    setFaqs((data.faqs as { question: string; answer: string }[]) ?? []);
                    setLinks((data.links as { label: string; url: string }[]) ?? []);
                    setPolicies(data.policies ?? "");
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const input: KnowledgeBaseInput = {
                creator_name: creatorName,
                about,
                topics,
                ai_system_prompt: systemPrompt || undefined,
                services: services as KnowledgeBase["services"],
                courses: courses as KnowledgeBase["courses"],
                resources: resources as KnowledgeBase["resources"],
                faqs: faqs as KnowledgeBase["faqs"],
                links: links as KnowledgeBase["links"],
                policies,
            };
            const updated = await upsertKnowledgeBase(input);
            setKb(updated);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch {
            // no-op
        } finally {
            setSaving(false);
        }
    };

    const textareaStyle: React.CSSProperties = {
        background: "var(--background)",
        border: "1px solid var(--border-color)",
        color: "var(--foreground-color)",
        borderRadius: "12px",
        padding: "12px 16px",
        fontSize: "13px",
        outline: "none",
        width: "100%",
        resize: "vertical",
        fontFamily: "inherit",
        lineHeight: "1.6",
    };

    const inputStyle: React.CSSProperties = {
        background: "var(--background)",
        border: "1px solid var(--border-color)",
        color: "var(--foreground-color)",
        borderRadius: "12px",
        padding: "10px 16px",
        fontSize: "13px",
        outline: "none",
        width: "100%",
        fontFamily: "inherit",
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center flex-1 py-20">
                <RefreshCw className="h-6 w-6 animate-spin" style={{ color: "#6C5CE7" }} />
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 min-h-0 p-4 sm:p-6 lg:p-8" style={{ background: "var(--background)" }}>

            {/* ── Header ── */}
            <div className="mb-6">
                <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2"
                    style={{ background: "rgba(108,92,231,0.12)", border: "1px solid rgba(108,92,231,0.25)", color: "#a29bfe" }}
                >
                    <Bot className="h-3.5 w-3.5" />
                    <span>AI BRAIN</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: "var(--foreground-color)" }}>
                            Knowledge{" "}
                            <span style={{ background: "linear-gradient(135deg,#6C5CE7,#a29bfe)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Base
                            </span>
                        </h1>
                        <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--foreground-muted)" }}>
                            Train your AI bot with your brand info, FAQs, services and more.
                        </p>
                    </div>
                    <button
                        id="knowledge-save-btn"
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95 shrink-0"
                        style={{
                            background: saved ? "linear-gradient(135deg,#10B981,#34D399)" : "linear-gradient(135deg,#6C5CE7,#a29bfe)",
                            boxShadow: "0 4px 14px rgba(108,92,231,0.35)",
                        }}
                    >
                        {saving ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : saved ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {saving ? "Saving…" : saved ? "Saved!" : "Save All"}
                    </button>
                </div>

                {/* Info banner */}
                <div
                    className="mt-4 flex items-start gap-3 rounded-2xl p-4"
                    style={{ background: "rgba(108,92,231,0.08)", border: "1px solid rgba(108,92,231,0.2)" }}
                >
                    <Sparkles className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#a29bfe" }} />
                    <p className="text-xs leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                        Everything you fill in here is used by your AI bot to answer questions intelligently.
                        The more detail you provide, the more accurate and helpful your AI will be.
                    </p>
                </div>
            </div>

            {/* ── Sections ── */}
            <div className="space-y-4 max-w-3xl">

                {/* Creator Identity */}
                <Section icon={User} title="Creator Identity" subtitle="Your name, about, and niche topics" color="#6C5CE7" defaultOpen={true}>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--foreground-muted)" }}>Creator / Brand Name</label>
                            <input
                                id="kb-creator-name"
                                value={creatorName}
                                onChange={(e) => setCreatorName(e.target.value)}
                                placeholder="e.g. Rahul Kumar"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--foreground-muted)" }}>About You</label>
                            <textarea
                                id="kb-about"
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                placeholder="e.g. I'm a BCA student and AI Full Stack Developer. I create content about AI, web development, and career growth for students."
                                rows={4}
                                style={textareaStyle}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--foreground-muted)" }}>Content Topics</label>
                            <TagsEditor tags={topics} onChange={setTopics} placeholder="Add topic (press Enter)" />
                        </div>
                    </div>
                </Section>

                {/* AI System Prompt */}
                <Section icon={Bot} title="AI System Prompt" subtitle="Custom instructions for your AI bot personality" color="#a29bfe">
                    <div>
                        <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--foreground-muted)" }}>
                            Custom AI Prompt (optional — overrides default bot behavior)
                        </label>
                        <textarea
                            id="kb-system-prompt"
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            placeholder="e.g. You are Rahul's assistant. Be friendly, helpful and concise. Answer questions about his courses and services. If someone asks about pricing, direct them to the link."
                            rows={5}
                            style={textareaStyle}
                        />
                        <p className="text-[11px] mt-1.5" style={{ color: "var(--foreground-muted)" }}>
                            Leave blank to use the default AI behaviour based on your knowledge base content.
                        </p>
                    </div>
                </Section>

                {/* Services */}
                <Section icon={Tag} title="Services" subtitle="What you offer — the AI can answer questions about these" color="#ec4899">
                    <DynamicList
                        items={services as ListItem[]}
                        onChange={(v) => setServices(v as typeof services)}
                        fields={[
                            { key: "name", label: "Service Name", placeholder: "e.g. 1-on-1 Mentorship" },
                            { key: "description", label: "Description", placeholder: "What's included, pricing, etc.", multiline: true },
                        ]}
                        addLabel="Add Service"
                    />
                </Section>

                {/* Courses */}
                <Section icon={BookOpen} title="Courses & Products" subtitle="Digital products, courses, and paid content" color="#F59E0B">
                    <DynamicList
                        items={courses as ListItem[]}
                        onChange={(v) => setCourses(v as typeof courses)}
                        fields={[
                            { key: "name", label: "Name", placeholder: "e.g. Full Stack AI Bootcamp" },
                            { key: "url", label: "URL", placeholder: "https://..." },
                            { key: "description", label: "Description", placeholder: "What students learn, price, etc." },
                        ]}
                        addLabel="Add Course"
                    />
                </Section>

                {/* Resources */}
                <Section icon={Link} title="Resources & Links" subtitle="Free resources, GitHub repos, guides, portfolios" color="#10B981">
                    <DynamicList
                        items={resources as ListItem[]}
                        onChange={(v) => setResources(v as typeof resources)}
                        fields={[
                            { key: "name", label: "Name", placeholder: "e.g. AI Roadmap PDF" },
                            { key: "url", label: "URL", placeholder: "https://..." },
                            { key: "description", label: "Description (optional)", placeholder: "What is this?" },
                        ]}
                        addLabel="Add Resource"
                    />
                </Section>

                {/* FAQs */}
                <Section icon={HelpCircle} title="FAQs" subtitle="Common questions your audience asks — the AI uses these directly" color="#60a5fa">
                    <DynamicList
                        items={faqs as ListItem[]}
                        onChange={(v) => setFaqs(v as typeof faqs)}
                        fields={[
                            { key: "question", label: "Question", placeholder: "e.g. How do I join your mentorship?" },
                            { key: "answer", label: "Answer", placeholder: "Write a detailed answer…", multiline: true },
                        ]}
                        addLabel="Add FAQ"
                    />
                </Section>

                {/* Contact */}
                <Section icon={Phone} title="Social Links" subtitle="Your social media profiles and contact links" color="#e1306c">
                    <DynamicList
                        items={links as ListItem[]}
                        onChange={(v) => setLinks(v as typeof links)}
                        fields={[
                            { key: "label", label: "Label", placeholder: "e.g. Instagram, YouTube, Portfolio" },
                            { key: "url", label: "URL", placeholder: "https://..." },
                        ]}
                        addLabel="Add Link"
                    />
                </Section>

                {/* Policies */}
                <Section icon={FileText} title="Policies & Terms" subtitle="Refund, privacy, or usage policies the AI should be aware of" color="#9CA3AF">
                    <textarea
                        id="kb-policies"
                        value={policies}
                        onChange={(e) => setPolicies(e.target.value)}
                        placeholder="e.g. All sales are final. No refunds after 7 days of course purchase..."
                        rows={4}
                        style={textareaStyle}
                    />
                </Section>

                {/* Save again at bottom */}
                <div className="pt-2 pb-6">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-3.5 rounded-xl text-sm font-black text-white transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
                        style={{
                            background: saved ? "linear-gradient(135deg,#10B981,#34D399)" : "linear-gradient(135deg,#6C5CE7,#a29bfe)",
                            boxShadow: "0 4px 18px rgba(108,92,231,0.4)",
                        }}
                    >
                        {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                        {saving ? "Saving…" : saved ? "All Saved!" : "Save Knowledge Base"}
                    </button>
                </div>
            </div>
        </div>
    );
}
