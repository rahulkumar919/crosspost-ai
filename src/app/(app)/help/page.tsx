import * as React from "react";
import { HelpCircle, Search, ChevronRight } from "lucide-react";

const faqs = [
    { q: "How do I connect my YouTube account?", a: "Go to Connected Accounts and click Connect next to YouTube. You'll be redirected to Google to authorize." },
    { q: "Which platforms are supported?", a: "We currently support YouTube, Instagram, LinkedIn. Facebook is coming soon." },
    { q: "How does AI caption generation work?", a: "Our AI analyzes your video content and generates platform-optimized captions automatically." },
    { q: "Is my data secure?", a: "Yes. We use OAuth 2.0 and never store your social media passwords." },
];

export default function HelpPage() {
    return (
        <div className="flex flex-col flex-1 min-h-0 p-6" style={{ background: "#F5F3FF" }}>
            <div className="mb-6">
                <p className="text-sm font-medium mb-1" style={{ color: "#6C5CE7" }}>Support</p>
                <h1 className="text-2xl font-black text-gray-900">Help <span style={{ color: "#6C5CE7" }}>Center</span></h1>
                <p className="text-sm text-gray-500 mt-1">Find answers to common questions.</p>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-gray-100 mb-6 max-w-lg">
                <Search className="h-4 w-4 text-gray-400" />
                <input placeholder="Search for help..." className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400" />
            </div>
            <div className="flex flex-col gap-3 max-w-2xl">
                {faqs.map(({ q, a }) => (
                    <div key={q} className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.05)" }}>
                        <div className="flex items-start gap-3">
                            <HelpCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#6C5CE7" }} />
                            <div>
                                <p className="text-sm font-bold text-gray-900 mb-1">{q}</p>
                                <p className="text-xs text-gray-500 leading-relaxed">{a}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
