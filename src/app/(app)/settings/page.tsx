import * as React from "react";
import { Settings, User, Bell, Lock, Palette, Globe } from "lucide-react";

const sections = [
    { icon: User, label: "Profile Settings", desc: "Update your name, email and avatar." },
    { icon: Bell, label: "Notifications", desc: "Choose what notifications you receive." },
    { icon: Lock, label: "Security", desc: "Manage your password and two-factor auth." },
    { icon: Palette, label: "Appearance", desc: "Customize the look and feel of the app." },
    { icon: Globe, label: "Language & Region", desc: "Set your preferred language and timezone." },
];

export default function SettingsPage() {
    return (
        <div className="flex flex-col flex-1 min-h-0 p-6" style={{ background: "#F5F3FF" }}>
            <div className="mb-6">
                <p className="text-sm font-medium mb-1" style={{ color: "#6C5CE7" }}>Preferences</p>
                <h1 className="text-2xl font-black text-gray-900">
                    <span style={{ color: "#6C5CE7" }}>Settings</span>
                </h1>
                <p className="text-sm text-gray-500 mt-1">Manage your account preferences and settings.</p>
            </div>

            <div className="flex flex-col gap-3 max-w-2xl">
                {sections.map(({ icon: Icon, label, desc }) => (
                    <button
                        key={label}
                        className="flex items-center gap-4 p-5 rounded-2xl bg-white text-left transition-all hover:shadow-md group"
                        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.05)" }}
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(108,92,231,0.1)" }}>
                            <Icon className="h-5 w-5" style={{ color: "#6C5CE7" }} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">{label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                        </div>
                        <Settings className="h-4 w-4 text-gray-300 group-hover:text-purple-400 transition-colors" />
                    </button>
                ))}
            </div>
        </div>
    );
}
