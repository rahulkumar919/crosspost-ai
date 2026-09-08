"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Layers, Settings, Plus, LogOut, ChevronDown, User, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
    { href: "/accounts", label: "Accounts", icon: Settings },
];

export function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const userInitial = session?.user?.name?.[0]?.toUpperCase()
        ?? session?.user?.email?.[0]?.toUpperCase()
        ?? "U";

    return (
        <header
            className={cn(
                "sticky top-0 z-40 w-full",
                "border-b border-border/60",
                "glass",
                "transition-all duration-200"
            )}
        >
            {/* Subtle top gradient line */}
            <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: "var(--gradient-primary)" }}
            />

            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
                {/* Logo */}
                <Link
                    href="/accounts"
                    className={cn(
                        "flex items-center gap-3 rounded-[var(--radius-md)] py-1",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    )}
                    aria-label="CrossPost AI — Home"
                >
                    {/* Gradient logo mark */}
                    <div
                        className="relative flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] shadow-md"
                        style={{
                            background: "var(--gradient-primary)",
                            boxShadow: "var(--glow-primary-sm)",
                        }}
                    >
                        <Layers className="h-4 w-4 text-white" aria-hidden="true" />
                        {/* Inner glow */}
                        <div className="absolute inset-0 rounded-[var(--radius-md)] bg-white/10" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-black text-sm tracking-tight text-foreground">
                            CrossPost{" "}
                            <span className="gradient-text">AI</span>
                        </span>
                        <span className="text-[10px] font-medium text-foreground-muted/70 tracking-widest uppercase">
                            Multi-platform
                        </span>
                    </div>
                </Link>

                {/* Center nav links */}
                <nav aria-label="Main navigation" className="hidden sm:flex items-center gap-1">
                    {navItems.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <Link key={href} href={href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    size="sm"
                                    className={cn(
                                        "gap-1.5 text-xs font-semibold tracking-wide h-9",
                                        isActive
                                            ? "bg-surface-elevated text-foreground shadow-sm"
                                            : "text-foreground-muted hover:text-foreground"
                                    )}
                                    tabIndex={-1}
                                >
                                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                                    {label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-2.5">
                    {/* New Post CTA — gradient button */}
                    <Link href="/create">
                        <button
                            tabIndex={-1}
                            className={cn(
                                "hidden xs:inline-flex items-center gap-2 px-4 h-9 rounded-[var(--radius-md)]",
                                "text-xs font-bold text-white tracking-wide",
                                "transition-all duration-200 active:scale-[0.97]",
                                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            )}
                            style={{
                                background: "var(--gradient-primary)",
                                boxShadow: "var(--shadow-primary)",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.boxShadow = "var(--glow-primary)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-primary)";
                            }}
                        >
                            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                            <span className="hidden sm:inline">New Post</span>
                            <span className="sm:hidden">New</span>
                        </button>
                    </Link>

                    <ThemeToggle />

                    {/* User menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-expanded={menuOpen}
                            aria-haspopup="true"
                            aria-label="User menu"
                            className={cn(
                                "flex items-center gap-2 rounded-[var(--radius-md)] px-2 py-1.5",
                                "hover:bg-surface-elevated transition-colors duration-150",
                                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            )}
                        >
                            {/* Avatar */}
                            {session?.user?.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={session.user.image}
                                    alt={session.user.name ?? "User avatar"}
                                    className="h-8 w-8 rounded-full object-cover"
                                    style={{
                                        boxShadow: "0 0 0 2px var(--color-primary), 0 0 0 4px var(--border-color)",
                                    }}
                                />
                            ) : (
                                <div
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-black"
                                    style={{
                                        background: "var(--gradient-primary)",
                                        boxShadow: "0 0 0 2px var(--color-primary), 0 0 0 4px var(--border-color)",
                                    }}
                                >
                                    {userInitial}
                                </div>
                            )}
                            <ChevronDown
                                className={cn(
                                    "h-3.5 w-3.5 text-foreground-muted transition-transform duration-200",
                                    menuOpen && "rotate-180"
                                )}
                                aria-hidden="true"
                            />
                        </button>

                        {/* Dropdown */}
                        {menuOpen && (
                            <div
                                className={cn(
                                    "absolute right-0 top-full mt-2 w-60 animate-scale-in",
                                    "rounded-[var(--radius-lg)] border border-border",
                                    "glass shadow-lg",
                                    "py-1.5 z-50 overflow-hidden"
                                )}
                                role="menu"
                                aria-label="User options"
                            >
                                {/* Gradient top accent */}
                                <div
                                    className="h-[2px] mb-1.5"
                                    style={{ background: "var(--gradient-primary)" }}
                                />

                                {/* User info */}
                                {session?.user && (
                                    <div className="px-4 pb-3 border-b border-border/60">
                                        <div className="flex items-center gap-3">
                                            {session?.user?.image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={session.user.image}
                                                    alt=""
                                                    className="h-9 w-9 rounded-full object-cover"
                                                    style={{ boxShadow: "0 0 0 2px var(--color-primary)" }}
                                                />
                                            ) : (
                                                <div
                                                    className="flex h-9 w-9 items-center justify-center rounded-full text-white text-sm font-black shrink-0"
                                                    style={{ background: "var(--gradient-primary)" }}
                                                >
                                                    {userInitial}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-foreground truncate">
                                                    {session.user.name ?? "User"}
                                                </p>
                                                <p className="text-xs text-foreground-muted truncate mt-0.5">
                                                    {session.user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Mobile nav items */}
                                <div className="sm:hidden border-b border-border/60 py-1">
                                    {navItems.map(({ href, label, icon: Icon }) => (
                                        <Link
                                            key={href}
                                            href={href}
                                            role="menuitem"
                                            onClick={() => setMenuOpen(false)}
                                            className={cn(
                                                "flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground",
                                                "hover:bg-surface-elevated transition-colors"
                                            )}
                                        >
                                            <Icon className="h-4 w-4 text-foreground-muted" aria-hidden="true" />
                                            {label}
                                        </Link>
                                    ))}
                                </div>

                                <div className="py-1 mt-0.5">
                                    <button
                                        type="button"
                                        role="menuitem"
                                        className={cn(
                                            "flex w-full items-center gap-2.5 px-4 py-2.5 text-sm",
                                            "text-foreground-muted hover:text-foreground hover:bg-surface-elevated",
                                            "transition-colors cursor-pointer"
                                        )}
                                        onClick={() => {
                                            setMenuOpen(false);
                                        }}
                                    >
                                        <User className="h-4 w-4" aria-hidden="true" />
                                        Profile settings
                                    </button>
                                    <button
                                        type="button"
                                        role="menuitem"
                                        className={cn(
                                            "flex w-full items-center gap-2.5 px-4 py-2.5 text-sm",
                                            "text-error hover:bg-red-50 dark:hover:bg-red-950/30",
                                            "transition-colors cursor-pointer"
                                        )}
                                        onClick={() => {
                                            setMenuOpen(false);
                                            signOut({ callbackUrl: "/login" });
                                        }}
                                    >
                                        <LogOut className="h-4 w-4" aria-hidden="true" />
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
