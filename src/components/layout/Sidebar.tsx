"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    Link2, BookOpen, Clock, CalendarDays,
    LogOut, ChevronDown, MessageCircle, Zap,
    Settings, HelpCircle, Sparkles,
    Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InstallButton } from "@/components/pwa/InstallButton";
import { ThemeToggle } from "./ThemeToggle";
import { useDraftPostStore } from "@/store/useDraftPostStore";

// ─── Nav config ──────────────────────────────────────────────────────────────

const mainNav = [
    { href: "/accounts", label: "Connected Accounts", icon: Link2 },
    { href: "/history", label: "Post History", icon: Clock },
    { href: "/automations", label: "Automations", icon: Zap },
    { href: "/calendar", label: "Content Calendar", icon: CalendarDays },
];

const communityNav = [
    { href: "/inbox", label: "Inbox & DMs", icon: MessageCircle },
    { href: "/knowledge", label: "Knowledge Base", icon: BookOpen },
    { href: "/ai-tools", label: "AI Tools", icon: Sparkles },
];

const bottomNav = [
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/help", label: "Help", icon: HelpCircle },
];

// ─── NavItem ─────────────────────────────────────────────────────────────────

function NavItem({
    href,
    label,
    icon: Icon,
    active,
}: {
    href: string;
    label: string;
    icon: React.ElementType;
    active: boolean;
}) {
    return (
        <Link
            href={href}
            className={cn(
                "group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 outline-none",
                active
                    ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-fg)] font-semibold"
                    : "text-[var(--foreground-muted)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--foreground-color)]"
            )}
        >
            <Icon
                className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    active
                        ? "text-[var(--sidebar-active-fg)]"
                        : "text-[var(--muted)] group-hover:text-[var(--foreground-color)]"
                )}
            />
            <span className="truncate">{label}</span>
            {active && (
                <div
                    className="ml-auto h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ background: "var(--sidebar-active-fg)" }}
                />
            )}
        </Link>
    );
}

// ─── SectionLabel ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--foreground-muted)" }}>
            {children}
        </p>
    );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

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
    const userImage = session?.user?.image;
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <aside
            className={cn(
                "hidden lg:flex flex-col w-[232px] shrink-0 min-h-screen sticky top-0 sidebar-scroll overflow-y-auto",
                "border-r transition-colors duration-200 neu-card"
            )}
            style={{
                background: "var(--sidebar-bg)",
                borderRightColor: "var(--sidebar-border)",
                borderRadius: 0,
            }}
        >
            {/* ── Logo ── */}
            <div className="flex items-center gap-2.5 px-4 h-14 shrink-0 border-b" style={{ borderColor: "var(--sidebar-border)" }}>
                <div className="relative h-7 w-7 rounded-lg overflow-hidden shrink-0 shadow-sm">
                    <Image src="/logo.png" alt="CrossPost AI" fill sizes="28px" className="object-cover" priority />
                </div>
                <div className="min-w-0">
                    <p className="text-[14px] font-bold tracking-tight leading-none" style={{ color: "var(--foreground-color)" }}>
                        CrossPost <span style={{ color: "#6366F1" }}>AI</span>
                    </p>
                    <p className="text-[10px] mt-0.5 leading-none" style={{ color: "var(--foreground-muted)" }}>
                        One Post, Every Platform
                    </p>
                </div>
            </div>

            {/* ── Upload CTA ── */}
            <div className="px-3 pt-3 pb-2">
                <button
                    type="button"
                    onClick={() => { resetDraft(); router.push("/create"); }}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all duration-150 active:scale-[0.98] neu-btn-primary"
                >
                    <Upload className="h-4 w-4 shrink-0" />
                    <span>Upload Video</span>
                </button>
            </div>

            {/* ── Main nav ── */}
            <nav className="flex-1 px-2 py-1 space-y-0.5">
                {mainNav.map(({ href, label, icon }) => (
                    <NavItem key={href} href={href} label={label} icon={icon} active={isActive(href)} />
                ))}

                <div className="pt-3 pb-1">
                    <SectionLabel>Community &amp; AI</SectionLabel>
                </div>

                {communityNav.map(({ href, label, icon }) => (
                    <NavItem key={href} href={href} label={label} icon={icon} active={isActive(href)} />
                ))}
            </nav>

            {/* ── Bottom section ── */}
            <div className="px-2 py-2 border-t space-y-0.5" style={{ borderColor: "var(--sidebar-border)" }}>
                <InstallButton variant="sidebar" />

                {bottomNav.map(({ href, label, icon }) => (
                    <NavItem key={href} href={href} label={label} icon={icon} active={isActive(href)} />
                ))}

                <div className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: "var(--surface-elevated)" }}>
                    <span className="text-[12px] font-medium" style={{ color: "var(--foreground-muted)" }}>Appearance</span>
                    <ThemeToggle />
                </div>
            </div>

            {/* ── User profile ── */}
            <div className="px-2 pb-3 border-t" style={{ borderColor: "var(--sidebar-border)" }}>
                {/* Sign out dropdown */}
                {profileOpen && (
                    <div
                        className="mx-1 mb-1 mt-2 rounded-lg overflow-hidden border animate-scale-in"
                        style={{ background: "var(--surface)", borderColor: "var(--border-color)", boxShadow: "var(--shadow-md)" }}
                    >
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="h-4 w-4 shrink-0" />
                            Sign out
                        </button>
                    </div>
                )}

                <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg transition-all duration-150 hover:bg-[var(--sidebar-hover-bg)] mt-2"
                    aria-expanded={profileOpen}
                    aria-label="User profile menu"
                >
                    {userImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={userImage}
                            alt={userName}
                            className="h-7 w-7 shrink-0 rounded-full object-cover ring-2 ring-[var(--border-color)]"
                        />
                    ) : (
                        <div
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                            style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
                        >
                            {userInitial}
                        </div>
                    )}
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-[13px] font-semibold truncate leading-none" style={{ color: "var(--foreground-color)" }}>
                            {userName}
                        </p>
                        {userEmail && (
                            <p className="text-[11px] truncate mt-0.5 leading-none" style={{ color: "var(--foreground-muted)" }}>
                                {userEmail}
                            </p>
                        )}
                    </div>
                    <ChevronDown
                        className={cn(
                            "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                            profileOpen && "rotate-180"
                        )}
                        style={{ color: "var(--foreground-muted)" }}
                    />
                </button>
            </div>
        </aside>
    );
}
