"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { ChevronDown, LogOut, X, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { InstallButton } from "@/components/pwa/InstallButton";
import { ThemeToggle } from "./ThemeToggle";

// ─── User Avatar ──────────────────────────────────────────────────────────────
function UserAvatar({ size = 32 }: { size?: number }) {
    const { data: session } = useSession();
    const initial = session?.user?.name?.[0]?.toUpperCase()
        ?? session?.user?.email?.[0]?.toUpperCase()
        ?? "U";

    if (session?.user?.image) {
        return (
            <img
                src={session.user.image}
                alt={session.user.name ?? "User"}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                className="rounded-full object-cover shrink-0"
                style={{
                    width: size,
                    height: size,
                    boxShadow: "0 0 0 2.5px rgba(236,72,153,0.65)",
                    display: "block",
                }}
                onError={(e) => {
                    // Fallback to initial avatar if image fails
                    const el = e.currentTarget;
                    el.style.display = "none";
                    const fallback = el.nextElementSibling as HTMLElement | null;
                    if (fallback) fallback.style.display = "flex";
                }}
            />
        );
    }

    return (
        <div
            className="flex items-center justify-center rounded-full text-white font-black shrink-0"
            style={{
                width: size,
                height: size,
                fontSize: size * 0.38,
                background: "linear-gradient(135deg, #ec4899, #a78bfa)",
                boxShadow: "0 0 0 2.5px rgba(236,72,153,0.5)",
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
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed bottom-0 left-0 right-0 z-50">
                <div
                    className="rounded-t-[28px] pb-10 overflow-hidden"
                    style={{
                        background: "rgba(12,10,30,0.98)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        backdropFilter: "blur(24px)",
                        boxShadow: "0 -24px 80px rgba(0,0,0,0.8)",
                    }}
                >
                    {/* Handle */}
                    <div className="flex justify-center pt-3 pb-1">
                        <div className="h-1 w-10 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 pt-2 pb-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(236,72,153,0.7)" }}>
                            My Account
                        </p>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-7 w-7 items-center justify-center rounded-full"
                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                            aria-label="Close"
                        >
                            <X className="h-3.5 w-3.5 text-white/60" />
                        </button>
                    </div>

                    {/* User info card */}
                    <div
                        className="mx-4 mb-4 flex items-center gap-3 p-4 rounded-2xl"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        <UserAvatar size={52} />
                        <div className="min-w-0 flex-1">
                            <p className="text-[15px] font-black text-white truncate">{name}</p>
                            <p className="text-[11px] truncate mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{email}</p>
                            <div
                                className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold"
                                style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                                Active
                            </div>
                        </div>
                    </div>

                    {/* Appearance row */}
                    <div
                        className="mx-4 mb-3 flex items-center justify-between rounded-2xl px-4 py-3.5"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                        <span className="text-[13px] font-semibold text-white/70">Appearance</span>
                        <ThemeToggle />
                    </div>

                    {/* Connected Platforms link */}
                    <Link
                        href="/accounts"
                        onClick={onClose}
                        className="mx-4 mb-3 flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all hover:bg-white/5"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                        <Settings className="h-4 w-4 shrink-0" style={{ color: "rgba(236,72,153,0.8)" }} />
                        <span className="text-[13px] font-semibold text-white/80">Connected Platforms</span>
                        <ChevronDown className="h-3.5 w-3.5 ml-auto -rotate-90 text-white/30" />
                    </Link>

                    {/* Sign out → redirects to home page */}
                    <button
                        type="button"
                        onClick={() => { onClose(); signOut({ callbackUrl: "/" }); }}
                        className="mx-4 flex w-[calc(100%-32px)] items-center gap-3 rounded-2xl px-4 py-4 transition-all active:scale-[0.98]"
                        style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)" }}
                    >
                        <LogOut className="h-4 w-4 text-red-400 shrink-0" />
                        <span className="text-[13px] font-bold text-red-400">Sign out</span>
                    </button>
                </div>
            </div>
        </>
    );
}

// ─── Main MobileHeader ────────────────────────────────────────────────────────
export function MobileHeader() {
    const { data: session } = useSession();
    const [sheetOpen, setSheetOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    return (
        <>
            <header
                className="lg:hidden sticky top-0 z-40 w-full"
                style={{
                    background: scrolled ? "rgba(12,10,30,0.95)" : "#0e0c1a",
                    backdropFilter: scrolled ? "blur(20px)" : "none",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    boxShadow: scrolled ? "0 1px 0 rgba(236,72,153,0.06), 0 4px 24px rgba(0,0,0,0.4)" : "none",
                    transition: "background 0.3s, box-shadow 0.3s",
                }}
            >
                {/* Top gradient accent line */}
                <div
                    style={{
                        height: 2,
                        background: "linear-gradient(90deg, #ec4899 0%, #a78bfa 50%, #60a5fa 100%)",
                    }}
                />

                <div className="flex items-center justify-between px-4 h-[60px]">

                    {/* ── Logo ── */}
                    <Link href="/accounts" className="flex items-center gap-2.5 shrink-0">
                        <div
                            className="relative rounded-[12px] overflow-hidden shrink-0"
                            style={{
                                width: 44,
                                height: 44,
                                boxShadow: "0 0 0 2px rgba(236,72,153,0.3), 0 4px 18px rgba(236,72,153,0.2)",
                            }}
                        >
                            <Image
                                src="/logo.png"
                                alt="CrossPost AI"
                                fill
                                sizes="44px"
                                className="object-cover"
                                priority
                                onError={(e) => {
                                    const t = e.target as HTMLImageElement;
                                    t.style.display = "none";
                                    const p = t.parentElement;
                                    if (p) {
                                        p.style.background = "linear-gradient(135deg, #ec4899, #a78bfa)";
                                        p.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:20px;color:white;font-weight:900;">✦</div>`;
                                    }
                                }}
                            />
                        </div>
                        <div className="leading-none">
                            <p className="font-black text-[16px] text-white tracking-tight leading-none">
                                CrossPost{" "}
                                <span
                                    style={{
                                        background: "linear-gradient(135deg, #ec4899, #a78bfa)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    AI
                                </span>
                            </p>
                            <p
                                className="text-[9.5px] font-medium mt-0.5 tracking-wide"
                                style={{ color: "rgba(255,255,255,0.35)" }}
                            >
                                Create Once. Post Everywhere.
                            </p>
                        </div>
                    </Link>

                    {/* ── Right controls ── */}
                    <div className="flex items-center gap-2 shrink-0">
                        {/* PWA Install button */}
                        <InstallButton variant="header" />

                        {/* Theme toggle — always visible */}
                        <ThemeToggle />

                        {/* Avatar opens user sheet */}
                        {session ? (
                            <button
                                type="button"
                                onClick={() => setSheetOpen(true)}
                                aria-label="Open user menu"
                                aria-expanded={sheetOpen}
                                className="flex items-center gap-1.5 rounded-full transition-all hover:opacity-90 active:scale-95"
                                style={{ outline: "none" }}
                            >
                                <UserAvatar size={38} />
                                <ChevronDown
                                    className={cn(
                                        "h-3.5 w-3.5 text-white/40 transition-transform duration-200",
                                        sheetOpen && "rotate-180"
                                    )}
                                />
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95"
                                style={{
                                    background: "linear-gradient(135deg, #ec4899, #a78bfa)",
                                    boxShadow: "0 4px 14px rgba(236,72,153,0.4)",
                                }}
                            >
                                Sign In →
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {sheetOpen && <UserSheet onClose={() => setSheetOpen(false)} />}
        </>
    );
}
