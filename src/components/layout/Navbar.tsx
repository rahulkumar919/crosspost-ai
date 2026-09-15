"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    Layers, Settings, Plus, LogOut, X,
    LayoutDashboard, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

// ─── Nav items ────────────────────────────────────────────────────────────────
const navItems = [
    { href: "/accounts", label: "Accounts", icon: Settings },
    { href: "/create", label: "Create", icon: Sparkles },
];

// ─── Avatar component ─────────────────────────────────────────────────────────
function Avatar({
    src,
    name,
    email,
    size = "md",
}: {
    src?: string | null;
    name?: string | null;
    email?: string | null;
    size?: "sm" | "md" | "lg";
}) {
    const initial = name?.[0]?.toUpperCase() ?? email?.[0]?.toUpperCase() ?? "U";
    const dim = size === "sm" ? "h-7 w-7 text-xs" : size === "lg" ? "h-12 w-12 text-base" : "h-9 w-9 text-sm";

    if (src) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={src}
                alt={name ?? "User"}
                className={cn(dim, "rounded-full object-cover ring-2 ring-primary/30")}
            />
        );
    }
    return (
        <div
            className={cn(
                dim,
                "rounded-full flex items-center justify-center text-white font-bold shrink-0",
                "ring-2 ring-primary/30"
            )}
            style={{ background: "linear-gradient(135deg, #5b4fe9, #8b5cf6)" }}
        >
            {initial}
        </div>
    );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [sheetOpen, setSheetOpen] = React.useState(false);
    const sheetRef = React.useRef<HTMLDivElement>(null);

    // Close sheet on outside click
    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
                setSheetOpen(false);
            }
        };
        if (sheetOpen) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [sheetOpen]);

    // Prevent body scroll when sheet is open
    React.useEffect(() => {
        document.body.style.overflow = sheetOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [sheetOpen]);

    return (
        <>
            {/* ── Top header ── */}
            <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">

                    {/* Logo */}
                    <Link
                        href="/accounts"
                        className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-md"
                        aria-label="CrossPost AI home"
                    >
                        {/* Logo mark */}
                        <div className="relative flex h-8 w-8 items-center justify-center rounded-xl overflow-hidden shadow-md shadow-primary/30"
                            style={{ background: "linear-gradient(135deg, #5b4fe9 0%, #8b5cf6 100%)" }}>
                            <Layers className="h-4 w-4 text-white relative z-10" />
                            <div className="absolute inset-0 bg-white/10" />
                        </div>

                        {/* Wordmark */}
                        <div className="flex flex-col leading-none">
                            <span className="text-sm font-black tracking-tight text-foreground">
                                CrossPost
                                <span className="ml-1"
                                    style={{ background: "linear-gradient(90deg,#5b4fe9,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                    AI
                                </span>
                            </span>
                            <span className="text-[9px] font-semibold tracking-widest text-foreground-muted/60 uppercase">
                                Multi-platform
                            </span>
                        </div>
                    </Link>

                    {/* Desktop center nav */}
                    <nav aria-label="Main navigation" className="hidden sm:flex items-center gap-1">
                        {navItems.map(({ href, label, icon: Icon }) => {
                            const active = pathname === href || (href === "/create" && pathname.startsWith("/create"));
                            return (
                                <Link key={href} href={href}>
                                    <span className={cn(
                                        "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg",
                                        "text-xs font-semibold transition-all duration-150 cursor-pointer",
                                        active
                                            ? "bg-primary/10 text-primary"
                                            : "text-foreground-muted hover:text-foreground hover:bg-surface"
                                    )}>
                                        <Icon className="h-3.5 w-3.5" />
                                        {label}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right controls */}
                    <div className="flex items-center gap-2">
                        {/* Desktop New Post */}
                        <Link href="/create" className="hidden sm:block">
                            <span className={cn(
                                "inline-flex items-center gap-1.5 px-3.5 h-8 rounded-lg",
                                "text-xs font-bold text-white cursor-pointer",
                                "transition-all duration-150 active:scale-95",
                                "shadow-md shadow-primary/30"
                            )}
                                style={{ background: "linear-gradient(135deg, #5b4fe9, #8b5cf6)" }}>
                                <Plus className="h-3.5 w-3.5" />
                                <span>New Post</span>
                            </span>
                        </Link>

                        {/* Theme toggle */}
                        <ThemeToggle />

                        {/* Avatar button — opens bottom sheet on mobile, dropdown on desktop */}
                        <button
                            type="button"
                            onClick={() => setSheetOpen((v) => !v)}
                            aria-label="Open user menu"
                            aria-expanded={sheetOpen}
                            className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            <Avatar
                                src={session?.user?.image}
                                name={session?.user?.name}
                                email={session?.user?.email}
                                size="sm"
                            />
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Mobile bottom nav bar ── */}
            <nav
                className="fixed bottom-0 left-0 right-0 z-30 sm:hidden border-t border-border/60 bg-background/95 backdrop-blur-md"
                aria-label="Mobile navigation"
            >
                <div className="flex items-center justify-around h-14 px-2">
                    <Link href="/accounts">
                        <span className={cn(
                            "flex flex-col items-center gap-1 px-5 py-1 rounded-xl transition-colors",
                            pathname === "/accounts" ? "text-primary" : "text-foreground-muted"
                        )}>
                            <LayoutDashboard className="h-5 w-5" />
                            <span className="text-[10px] font-semibold">Accounts</span>
                        </span>
                    </Link>

                    {/* FAB — New Post */}
                    <Link href="/create">
                        <span className={cn(
                            "flex items-center justify-center h-12 w-12 rounded-2xl",
                            "shadow-lg shadow-primary/40 -mt-5",
                            "transition-transform active:scale-95"
                        )}
                            style={{ background: "linear-gradient(135deg, #5b4fe9, #8b5cf6)" }}>
                            <Plus className="h-6 w-6 text-white" />
                        </span>
                    </Link>

                    <Link href="/create">
                        <span className={cn(
                            "flex flex-col items-center gap-1 px-5 py-1 rounded-xl transition-colors",
                            pathname.startsWith("/create") ? "text-primary" : "text-foreground-muted"
                        )}>
                            <Sparkles className="h-5 w-5" />
                            <span className="text-[10px] font-semibold">Create</span>
                        </span>
                    </Link>
                </div>

                {/* iPhone home indicator spacing */}
                <div className="h-safe-area-inset-bottom" />
            </nav>

            {/* ── User sheet — slides up from bottom on mobile, dropdown on desktop ── */}
            {sheetOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:hidden animate-fade-in"
                        onClick={() => setSheetOpen(false)}
                    />

                    {/* Sheet */}
                    <div
                        ref={sheetRef}
                        className={cn(
                            // Mobile: full-width bottom sheet
                            "fixed bottom-0 left-0 right-0 z-50 sm:hidden",
                            "rounded-t-[20px] border-t border-border bg-background shadow-2xl",
                            "animate-fade-in-up pb-8",
                            // Desktop: dropdown
                            "sm:absolute sm:bottom-auto sm:top-auto sm:left-auto sm:right-4 sm:top-14",
                            "sm:w-64 sm:rounded-[14px] sm:border sm:shadow-lg sm:animate-scale-in"
                        )}
                    >
                        {/* Handle bar (mobile only) */}
                        <div className="flex justify-center pt-3 pb-1 sm:hidden">
                            <div className="h-1 w-10 rounded-full bg-border" />
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-5 pt-2 pb-4 sm:pt-4">
                            <p className="text-xs font-semibold text-foreground-muted uppercase tracking-widest">
                                Account
                            </p>
                            <button
                                type="button"
                                onClick={() => setSheetOpen(false)}
                                className="rounded-full p-1.5 hover:bg-surface text-foreground-muted transition-colors sm:hidden"
                                aria-label="Close menu"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* User card */}
                        {session?.user && (
                            <div className="mx-4 mb-4 flex items-center gap-3 rounded-[12px] bg-surface p-3">
                                <Avatar
                                    src={session.user.image}
                                    name={session.user.name}
                                    email={session.user.email}
                                    size="lg"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-foreground truncate">
                                        {session.user.name ?? "User"}
                                    </p>
                                    <p className="text-xs text-foreground-muted truncate mt-0.5">
                                        {session.user.email}
                                    </p>
                                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-950/40 px-2 py-0.5 text-[10px] font-semibold text-green-600 dark:text-green-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                        Active
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Theme toggle row */}
                        <div className="mx-4 mb-3 flex items-center justify-between rounded-[12px] bg-surface px-4 py-3">
                            <span className="text-sm font-medium text-foreground">Appearance</span>
                            <ThemeToggle />
                        </div>

                        {/* Nav links (mobile only) */}
                        <div className="sm:hidden mx-4 mb-3 overflow-hidden rounded-[12px] bg-surface">
                            {navItems.map(({ href, label, icon: Icon }, idx) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setSheetOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 text-sm font-medium",
                                        "hover:bg-surface-elevated transition-colors",
                                        idx > 0 && "border-t border-border/50",
                                        pathname === href ? "text-primary" : "text-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    {label}
                                    {pathname === href && (
                                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Sign out */}
                        <div className="mx-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setSheetOpen(false);
                                    signOut({ callbackUrl: "/login" });
                                }}
                                className={cn(
                                    "flex w-full items-center gap-3 rounded-[12px] px-4 py-3.5",
                                    "bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50",
                                    "text-sm font-semibold text-error",
                                    "hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors",
                                    "active:scale-[0.98]"
                                )}
                            >
                                <LogOut className="h-4 w-4 shrink-0" />
                                Sign out
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
