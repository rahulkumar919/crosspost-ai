"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    Link2, BookOpen, Clock,
    CalendarDays, BarChart3,
    LogOut, ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNav = [
    { href: "/accounts", label: "Connected Accounts", icon: Link2 },
    { href: "/history", label: "Post History", icon: Clock },
    { href: "/calendar", label: "Content Calendar", icon: CalendarDays },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [profileOpen, setProfileOpen] = React.useState(false);

    const isOnAccounts = pathname === "/accounts" || pathname === "/";

    const isActive = (href: string) => {
        if (href === "/accounts") return isOnAccounts;
        return pathname === href || pathname.startsWith(href + "/");
    };

    const userName = session?.user?.name ?? "User";
    const userEmail = session?.user?.email ?? "";
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <aside
            className="hidden lg:flex flex-col w-[220px] shrink-0 min-h-screen sticky top-0 self-start overflow-y-auto sidebar-scroll"
            style={{ background: "linear-gradient(180deg, #0D0A2E 0%, #0f0c35 100%)" }}
        >
            {/* ── Logo ── */}
            <div className="px-5 pt-6 pb-4">
                <Link href="/accounts" className="flex flex-col items-center gap-2">
                    <div
                        className="relative h-[72px] w-[72px] rounded-2xl overflow-hidden"
                        style={{ boxShadow: "0 0 30px rgba(108,92,231,0.6), 0 0 60px rgba(108,92,231,0.2)" }}
                    >
                        <Image
                            src="/logo.png"
                            alt="CrossPost AI"
                            fill
                            sizes="72px"
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="text-center leading-none">
                        <p className="text-white font-black text-[15px] tracking-tight">
                            CrossPost <span style={{ color: "#a29bfe" }}>AI</span>
                        </p>
                        <p className="text-[9px] font-semibold mt-1 tracking-[0.12em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
                            One Post, Every Platform
                        </p>
                    </div>
                </Link>
            </div>

            <div className="mx-5 my-2" style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />

            {/* ── Upload Video CTA ── */}
            <div className="px-3 pt-3 pb-1">
                <Link
                    href="/create"
                    className="group flex items-center gap-3 w-full px-3 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                    style={{
                        background: "linear-gradient(135deg, rgba(108,92,231,0.35) 0%, rgba(162,155,254,0.2) 100%)",
                        border: "1px solid rgba(162,155,254,0.3)",
                        boxShadow: "0 4px 16px rgba(108,92,231,0.2)",
                    }}
                >
                    {/* Icon */}
                    <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200 group-hover:scale-110"
                        style={{
                            background: "linear-gradient(135deg, #6C5CE7, #a29bfe)",
                            boxShadow: "0 4px 12px rgba(108,92,231,0.5)",
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white" aria-hidden="true">
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
                        <p className="text-[10px] mt-0.5 truncate" style={{ color: "rgba(162,155,254,0.7)" }}>
                            AI optimizes for all platforms
                        </p>
                    </div>

                    {/* Arrow */}
                    <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 shrink-0 text-white/40 group-hover:text-white/80 transition-colors" aria-hidden="true">
                        <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
                    </svg>
                </Link>
            </div>

            {/* ── Main nav ── */}
            <nav className="flex-1 px-3 py-2 space-y-0.5">
                {mainNav.map(({ href, label, icon: Icon }, idx) => {
                    const active = isActive(href);
                    return (
                        <Link
                            key={`${href}-${idx}`}
                            href={href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-[9px] rounded-xl text-[13px] font-medium transition-all duration-150",
                                active ? "text-white" : "text-white/45 hover:text-white/75 hover:bg-white/5"
                            )}
                            style={active ? {
                                background: "linear-gradient(135deg, #5b21b6 0%, #6C5CE7 100%)",
                                boxShadow: "0 4px 14px rgba(108,92,231,0.4)",
                            } : {}}
                        >
                            <Icon className="h-[17px] w-[17px] shrink-0" aria-hidden="true" />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mx-5 my-2" style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />

            {/* ── User profile section ── */}
            <div className="px-3 py-3">
                {/* Sign out popup */}
                {profileOpen && (
                    <div
                        className="mb-2 rounded-xl overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                            Sign out
                        </button>
                    </div>
                )}

                {/* Profile card */}
                <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-150 hover:bg-white/5 group"
                    aria-expanded={profileOpen}
                    aria-label="User profile menu"
                >
                    {/* Avatar */}
                    <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
                        style={{
                            background: "linear-gradient(135deg, #6C5CE7, #a29bfe)",
                            boxShadow: "0 2px 8px rgba(108,92,231,0.4)",
                        }}
                    >
                        {userInitial}
                    </div>

                    {/* Name & email */}
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-[12px] font-bold text-white/90 truncate leading-none">
                            {userName}
                        </p>
                        {userEmail && (
                            <p className="text-[10px] text-white/35 truncate mt-0.5">
                                {userEmail}
                            </p>
                        )}
                    </div>

                    {/* Chevron */}
                    <ChevronUp
                        className={cn(
                            "h-3.5 w-3.5 shrink-0 text-white/30 transition-transform duration-200 group-hover:text-white/60",
                            profileOpen ? "rotate-0" : "rotate-180"
                        )}
                        aria-hidden="true"
                    />
                </button>
            </div>
        </aside>
    );
}
