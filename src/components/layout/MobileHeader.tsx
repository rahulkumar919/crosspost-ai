"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { ChevronDown, LogOut, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { InstallButton } from "@/components/pwa/InstallButton";
import { ThemeToggle } from "./ThemeToggle";

// ─── Avatar ───────────────────────────────────────────────────────────────────

function UserAvatar({ size = 32 }: { size?: number }) {
    const { data: session } = useSession();
    const name = session?.user?.name ?? session?.user?.email ?? "U";
    const initial = name.charAt(0).toUpperCase();
    const image = session?.user?.image;

    if (image) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={image}
                alt={name}
                referrerPolicy="no-referrer"
                style={{ width: size, height: size, borderRadius: "50%", display: "block", objectFit: "cover" }}
            />
        );
    }

    return (
        <div
            style={{
                width: size, height: size, borderRadius: "50%",
                background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                color: "#fff", fontWeight: 700,
                fontSize: size * 0.4,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
            }}
        >
            {initial}
        </div>
    );
}

// ─── User Sheet ───────────────────────────────────────────────────────────────

function UserSheet({ onClose }: { onClose: () => void }) {
    const { data: session } = useSession();
    const name = session?.user?.name ?? "User";
    const email = session?.user?.email ?? "";

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[60] bg-black/40"
                style={{ backdropFilter: "blur(4px)" }}
                onClick={onClose}
            />

            {/* Sheet */}
            <div className="fixed bottom-0 left-0 right-0 z-[61] animate-slide-up">
                <div
                    className="rounded-t-3xl neu-card"
                    style={{
                        background: "var(--surface)",
                        borderTop: "1px solid var(--border-color)",
                        borderRadius: "24px 24px 0 0",
                        maxHeight: "90dvh",
                        overflowY: "auto",
                    }}
                >
                    {/* Handle */}
                    <div className="flex justify-center pt-2.5 pb-1">
                        <div className="h-1 w-10 rounded-full" style={{ background: "var(--border-color)" }} />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 pt-1 pb-3 border-b" style={{ borderColor: "var(--border-color)" }}>
                        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--foreground-muted)" }}>
                            Account
                        </p>
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-7 w-7 flex items-center justify-center rounded-full transition-colors hover:bg-[var(--surface-elevated)]"
                            style={{ color: "var(--foreground-muted)" }}
                            aria-label="Close"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    {/* User info */}
                    <div className="flex items-center gap-3 px-5 py-4">
                        <UserAvatar size={44} />
                        <div className="min-w-0 flex-1">
                            <p className="text-[15px] font-semibold truncate" style={{ color: "var(--foreground-color)" }}>
                                {name}
                            </p>
                            <p className="text-[12px] truncate mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                                {email}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-4 pb-2 space-y-1">
                        {/* Appearance row */}
                        <div
                            className="flex items-center justify-between px-4 py-3 rounded-xl"
                            style={{ background: "var(--surface-elevated)" }}
                        >
                            <span className="text-[13px] font-medium" style={{ color: "var(--foreground-color)" }}>Appearance</span>
                            <ThemeToggle />
                        </div>

                        {/* Connected accounts */}
                        <Link
                            href="/accounts"
                            onClick={onClose}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-[var(--surface-elevated)]"
                        >
                            <Settings className="h-4 w-4 shrink-0" style={{ color: "var(--foreground-muted)" }} />
                            <span className="text-[13px] font-medium" style={{ color: "var(--foreground-color)" }}>
                                Connected Platforms
                            </span>
                            <ChevronDown
                                className="h-3.5 w-3.5 ml-auto -rotate-90"
                                style={{ color: "var(--foreground-muted)" }}
                            />
                        </Link>

                        {/* Sign out */}
                        <button
                            type="button"
                            onClick={() => { onClose(); signOut({ callbackUrl: "/login" }); }}
                            className="flex items-center justify-center gap-2.5 w-full px-4 py-3 rounded-xl transition-all font-semibold text-white active:scale-[0.98]"
                            style={{
                                background: "linear-gradient(135deg, #EF4444, #DC2626)",
                                boxShadow: "0 2px 8px rgba(239,68,68,0.3)",
                            }}
                        >
                            <LogOut className="h-4 w-4 shrink-0" />
                            <span className="text-[14px]">Sign out</span>
                        </button>
                    </div>

                    {/* Safe area + extra bottom spacing */}
                    <div className="h-6" />
                    <div className="h-[env(safe-area-inset-bottom,8px)]" />
                </div>
            </div>
        </>
    );
}

// ─── MobileHeader ─────────────────────────────────────────────────────────────

export function MobileHeader() {
    const { data: session } = useSession();
    const [sheetOpen, setSheetOpen] = React.useState(false);

    return (
        <>
            <header
                className={cn(
                    "lg:hidden sticky top-0 z-40 w-full mobile-header",
                    "flex items-center justify-between px-4 h-14"
                )}
                style={{
                    background: "var(--surface)",
                    borderBottom: "1px solid var(--border-color)",
                }}
            >
                {/* Logo */}
                <Link href="/accounts" className="flex items-center gap-2 shrink-0">
                    <div className="relative h-7 w-7 rounded-lg overflow-hidden shadow-sm shrink-0">
                        <Image src="/logo.png" alt="CrossPost AI" fill sizes="28px" className="object-cover" priority />
                    </div>
                    <span className="font-bold text-[15px] tracking-tight" style={{ color: "var(--foreground-color)" }}>
                        CrossPost <span style={{ color: "#6366F1" }}>AI</span>
                    </span>
                </Link>

                {/* Right controls */}
                <div className="flex items-center gap-2 shrink-0">
                    <InstallButton variant="header" />
                    <ThemeToggle />

                    {session ? (
                        <button
                            type="button"
                            onClick={() => setSheetOpen(true)}
                            aria-label="Open user menu"
                            aria-expanded={sheetOpen}
                            className="flex items-center gap-1.5 rounded-full transition-opacity hover:opacity-80 active:scale-95"
                        >
                            <UserAvatar size={34} />
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="px-3.5 py-1.5 rounded-lg text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                            style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </header>

            {sheetOpen && <UserSheet onClose={() => setSheetOpen(false)} />}
        </>
    );
}
