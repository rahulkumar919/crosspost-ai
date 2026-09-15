import * as React from "react";
import { MessageCircle, Mail, Phone } from "lucide-react";

export default function SupportPage() {
    return (
        <div className="flex flex-col flex-1 min-h-0 p-6" style={{ background: "var(--background)" }}>
            <div className="mb-6">
                <p className="text-sm font-medium mb-1" style={{ color: "#6C5CE7" }}>Get help</p>
                <h1 className="text-2xl font-black text-[var(--foreground-color)]">Contact <span style={{ color: "#6C5CE7" }}>Support</span></h1>
                <p className="text-sm text-[var(--foreground-muted)] mt-1">We're here to help you 24/7.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mb-8">
                {[
                    { icon: MessageCircle, label: "Live Chat", desc: "Chat with our team", color: "#6C5CE7" },
                    { icon: Mail, label: "Email Support", desc: "support@crosspostai.com", color: "#0077B5" },
                    { icon: Phone, label: "Phone", desc: "Available 9am–6pm IST", color: "#00b894" },
                ].map(({ icon: Icon, label, desc, color }) => (
                    <button key={label} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[var(--surface)] text-center transition-all hover:shadow-none"
                        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.05)" }}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: `${color}18` }}>
                            <Icon className="h-6 w-6" style={{ color }} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-[var(--foreground-color)]">{label}</p>
                            <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{desc}</p>
                        </div>
                    </button>
                ))}
            </div>
            <div className="max-w-lg bg-[var(--surface)] rounded-2xl p-6" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.05)" }}>
                <h2 className="text-base font-black text-[var(--foreground-color)] mb-4">Send us a message</h2>
                <div className="flex flex-col gap-3">
                    <input placeholder="Your name" className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-sm outline-none focus:border-purple-400" />
                    <input placeholder="Your email" className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-sm outline-none focus:border-purple-400" />
                    <textarea placeholder="Describe your issue..." rows={4} className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-sm outline-none focus:border-purple-400 resize-none" />
                    <button className="w-full py-3 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #6C5CE7, #a29bfe)" }}>
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    );
}


