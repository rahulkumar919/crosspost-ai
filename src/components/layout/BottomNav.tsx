"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
    href: string;
    label: string;
    renderIcon: (active: boolean) => React.ReactNode;
    isCenter?: boolean;
}

const NAV_ACTIVE = "#6366F1";
const NAV_MUTED = "var(--foreground-muted)";

const navItems: NavItem[] = [
    {
        href: "/accounts",
        label: "Accounts",
        renderIcon: (active) => (
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor"
                strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
    },
    {
        href: "/history",
        label: "History",
        renderIcon: (active) => (
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor"
                strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 7 12 12 15 15" />
            </svg>
        ),
    },
    {
        href: "/create",
        label: "Upload",
        isCenter: true,
        renderIcon: () => (
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" stroke="currentColor"
                strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
        ),
    },
    {
        href: "/calendar",
        label: "Calendar",
        renderIcon: (active) => (
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor"
                strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="3" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        ),
    },
    {
        href: "/automations",
        label: "Automate",
        renderIcon: (active) => (
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor"
                strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
    },
];

export function BottomNav() {
    const pathname = usePathname();

    const isActive = (href: string) =>
        pathname === href
        || (href !== "/accounts" && pathname.startsWith(href + "/"))
        || (href === "/accounts" && (pathname === "/accounts" || pathname === "/"));

    return (
        <nav
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
            style={{
                background: "rgba(255,255,255,0.97)",
                borderTop: "1px solid #E5E0FF",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 -4px 20px rgba(99,91,207,0.1), 0 -1px 0 #E5E0FF",
            }}
            aria-label="Mobile navigation"
        >
            <div className="flex items-end justify-around w-full px-1 pt-1.5 pb-1">
                {navItems.map(({ href, label, renderIcon, isCenter }) => {
                    const active = isActive(href);

                    if (isCenter) {
                        return (
                            <div key={href} className="flex-1 flex justify-center">
                                <Link href={href} className="flex flex-col items-center -mt-5 gap-1" aria-label={label}>
                                    <div
                                        className="flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-150 active:scale-95 neu-btn-primary"
                                        style={{ borderRadius: "50%" }}
                                    >
                                        {renderIcon(true)}
                                    </div>
                                    <span className="text-[10px] font-medium" style={{ color: NAV_ACTIVE }}>
                                        {label}
                                    </span>
                                </Link>
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={href}
                            href={href}
                            className="flex flex-1 flex-col items-center justify-center py-1.5 gap-0.5 transition-all duration-150"
                            style={{ color: active ? NAV_ACTIVE : NAV_MUTED }}
                            aria-label={label}
                            aria-current={active ? "page" : undefined}
                        >
                            <div className={cn("transition-transform duration-150", active && "scale-105")}>
                                {renderIcon(active)}
                            </div>
                            <span className="text-[10px] leading-none" style={{ fontWeight: active ? 600 : 400 }}>
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </div>
            {/* iOS safe area */}
            <div className="h-[env(safe-area-inset-bottom,4px)]" />
        </nav>
    );
}
