"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    Link2, BookOpen, Clock,
    CalendarDays, BarChart3,
    LogOut, ChevronUp,
    MessageCircle, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InstallButton } from "@/components/pwa/InstallButton";
import { ThemeToggle } from "./ThemeToggle";
import { useDraftPostStore } from "@/store/useDraftPostStore";

const mainNav = [
    { href: "/accounts", label: "Connected Accounts", icon: Link2 },
    { href: "/history", label: "Post History", icon: Clock },
    { href: "/calendar", label: "Content Calendar", icon: CalendarDays },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

const communityNav = [
    { href: "/inbox", label: "Inbox & DMs", icon: MessageCircle },
    { href: "/automations", label: "Automations", icon: Zap },
    { href: "/knowledge", label: "Knowledge Base", icon: BookOpen },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const [profileOpen, setProfileOpen] = React.useState(false);
    const resetDraft = useDraftPostStore((s) => s.resetDraft);

    const isOnAccounts = pathname === "/accounts" || pathname === "/";

    const isActive = (href: string) => {
        if (href === "/accounts") return isOnAccounts;
        return pathname === href || pathname.startsWith(href + "/");
    };

    const userName = session?.user?.name ?? "User";
    const userEmail = session?.user?.email ?? "";
    const userInitial = userName.charAt(0).toUpperCase();
    const userImage = session?.user?.image;

    return (
        <aside
            className="hidden lg:flex flex-col w-[220px] shrink-0 min-h-screen sticky top-0 self-start overflow-y-auto sidebar-scroll bg-[var(--surface)] border-r border-[var(--border-color)]"
            style={{ transition: "background-color 0.2s, border-color 0.2s" }}
        >
            {/* ── Logo ── */}
            <div className="px-5 pt-6 pb-4">
                <Link href="/accounts" className="flex flex-col items-center gap-2">
                    <div
                        className="relative h-[68px] w-[68px] rounded-2xl overflow-hidden shadow-lg"
                        style={{ boxShadow: "0 0 24px rgba(108,92,231,0.4)" }}
                    >
                        <Image
                            src="/logo.png"
                            alt="CrossPost AI"
                            fill
                            sizes="68px"
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="text-center leading-none">
                        <p className="text-[var(--foreground-color)] font-black text-[15px] tracking-tight">
                            CrossPost <span className="text-[#6C5CE7]">AI</span>
                        </p>
                        <p className="text-[9px] font-semibold mt-1 tracking-[0.12em] uppercase text-[var(--foreground-muted)]">
                            One Post, Every Platform
                        </p>
                    </div>
                </Link>
            </div>

            <div className="mx-5 my-1 h-[1px] bg-[var(--border-color)]" />

            {/* ── Upload Video CTA ── */}
            <div className="px-3 pt-3 pb-1">
                <button
                    type="button"
                    onClick={() => {
                        // Always reset the draft so stale video/publish state
                        // from the previous post is completely cleared
                        resetDraft();
                        router.push("/create");
                    }}
                    className="group flex items-center gap-3 w-full px-3 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
                    style={{
                        background: "linear-gradient(135deg, #6C5CE7 0%, #7C3AED 100%)",
                        boxShadow: "0 4px 16px rgba(108,92,231,0.35)",
                    }}
                >
                    {/* Icon */}
                    <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20 transition-all duration-200 group-hover:scale-110 text-white"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-black text-white leading-none">
                            Upload Video
                        </p>
                        <p className="text-[10px] mt-0.5 truncate text-white/75">
                            AI optimizes for all platforms
                        </p>
                    </div>

                    {/* Arrow */}
                    <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 shrink-0 text-white/60 group-hover:text-white transition-colors" aria-hidden="true">
                        <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
                    </svg>
                </button>
            </div>

            {/* ── Main nav ── */}
            <nav className="flex-1 px-3 py-2 space-y-1">
                {mainNav.map(({ href, label, icon: Icon }, idx) => {
                    const active = isActive(href);
                    return (
                        <Link
                            key={`${href}-${idx}`}
                            href={href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-[9px] rounded-xl text-[13px] font-medium transition-all duration-150",
                                active
                                    ? "text-white shadow-md font-bold"
                                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground-color)] hover:bg-[var(--surface-elevated)]"
                            )}
                            style={active ? {
                                background: "linear-gradient(135deg, #6C5CE7 0%, #7C3AED 100%)",
                                boxShadow: "0 4px 14px rgba(108,92,231,0.35)",
                            } : {}}
                        >
                            <Icon className="h-[17px] w-[17px] shrink-0" aria-hidden="true" />
                            <span>{label}</span>
                        </Link>
                    );
                })}

                {/* ── Community divider ── */}
                <div className="pt-2 pb-1 px-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.14em]" style={{ color: "var(--foreground-muted)" }}>
                        Community &amp; AI
                    </p>
                </div>

                {communityNav.map(({ href, label, icon: Icon }, idx) => {
                    const active = isActive(href);
                    return (
                        <Link
                            key={`community-${href}-${idx}`}
                            href={href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-[9px] rounded-xl text-[13px] font-medium transition-all duration-150",
                                active
                                    ? "text-white shadow-md font-bold"
                                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground-color)] hover:bg-[var(--surface-elevated)]"
                            )}
                            style={active ? {
                                background: "linear-gradient(135deg, #ec4899 0%, #a78bfa 100%)",
                                boxShadow: "0 4px 14px rgba(236,72,153,0.35)",
                            } : {}}
                        >
                            <Icon className="h-[17px] w-[17px] shrink-0" aria-hidden="true" />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mx-5 my-1 h-[1px] bg-[var(--border-color)]" />

            {/* ── Install App button (only visible when installable) ── */}
            <InstallButton variant="sidebar" />

            {/* ── Theme Toggle ── */}
            <div
                className="mx-3 mb-2 flex items-center justify-between px-3 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-color)]"
            >
                <span className="text-[11px] font-semibold text-[var(--foreground-muted)]">Appearance</span>
                <ThemeToggle />
            </div>

            {/* ── User profile section ── */}
            <div className="px-3 py-3">
                {/* Sign out popup */}
                {profileOpen && (
                    <div
                        className="mb-2 rounded-xl overflow-hidden bg-[var(--surface-elevated)] border border-[var(--border-color)] shadow-lg"
                    >
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                            Sign out
                        </button>
                    </div>
                )}

                {/* Profile card */}
                <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-150 hover:bg-[var(--surface-elevated)] group"
                    aria-expanded={profileOpen}
                    aria-label="User profile menu"
                >
                    {/* Avatar */}
                    {userImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={userImage}
                            alt={userName}
                            className="h-8 w-8 shrink-0 rounded-xl object-cover ring-2 ring-primary/40"
                        />
                    ) : (
                        <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
                            style={{
                                background: "linear-gradient(135deg, #6C5CE7, #a29bfe)",
                                boxShadow: "0 2px 8px rgba(108,92,231,0.4)",
                            }}
                        >
                            {userInitial}
                        </div>
                    )}

                    {/* Name & email */}
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-[12px] font-bold text-[var(--foreground-color)] truncate leading-none">
                            {userName}
                        </p>
                        {userEmail && (
                            <p className="text-[10px] text-[var(--foreground-muted)] truncate mt-0.5">
                                {userEmail}
                            </p>
                        )}
                    </div>

                    {/* Chevron */}
                    <ChevronUp
                        className={cn(
                            "h-3.5 w-3.5 shrink-0 text-[var(--foreground-muted)] transition-transform duration-200 group-hover:text-[var(--foreground-color)]",
                            profileOpen ? "rotate-0" : "rotate-180"
                        )}
                        aria-hidden="true"
                    />
                </button>
            </div>
        </aside>
    );
}
