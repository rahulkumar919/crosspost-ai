import * as React from "react";
import { Wand2, Hash, Lightbulb, CalendarDays, ChevronRight, Zap } from "lucide-react";

const tools = [
    { icon: Wand2, label: "AI Caption Generator", desc: "Generate engaging captions for your posts in seconds.", color: "#8B5CF6", bg: "#EDE9FE" },
    { icon: Hash, label: "Hashtag Generator", desc: "Find the most trending and relevant hashtags.", color: "#F59E0B", bg: "#FEF3C7" },
    { icon: Lightbulb, label: "Content Ideas", desc: "Get inspired content ideas tailored to your niche.", color: "#6C5CE7", bg: "#EDE9FE" },
    { icon: CalendarDays, label: "Content Calendar", desc: "AI-powered scheduling suggestions.", color: "#EF4444", bg: "#FEE2E2" },
    { icon: Zap, label: "Auto-Optimize", desc: "AI optimizes your content for each platform.", color: "#10B981", bg: "#D1FAE5" },
];

export default function AIToolsPage() {
    return (
        <div className="flex flex-col flex-1 min-h-0 p-6" style={{ background: "#F5F3FF" }}>
            <div className="mb-6">
                <p className="text-sm font-medium mb-1" style={{ color: "#6C5CE7" }}>Powered by AI</p>
                <h1 className="text-2xl font-black text-gray-900">
                    AI <span style={{ color: "#6C5CE7" }}>Tools</span>
                </h1>
                <p className="text-sm text-gray-500 mt-1">Smart tools to create better content, faster.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map(({ icon: Icon, label, desc, color, bg }) => (
                    <button
                        key={label}
                        className="flex items-center gap-4 p-5 rounded-2xl bg-white text-left transition-all duration-200 hover:shadow-lg group"
                        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.05)" }}
                    >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: bg }}>
                            <Icon className="h-6 w-6" style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900">{label}</p>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 group-hover:text-purple-400 transition-colors" />
                    </button>
                ))}
            </div>
        </div>
    );
}
