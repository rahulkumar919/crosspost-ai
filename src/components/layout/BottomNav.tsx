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

const navItems: NavItem[] = [
    {
        href: "/accounts",
        label: "Connection",
        renderIcon: (active) => (
            <svg viewBox="0 0 24 24" fill="none" className="h-[22px] w-[22px]" stroke="currentColor" strokeWidth={active ? "2.4" : "2"} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10.5L12 3l9 7.5v9.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
    },
    {
        href: "/history",
        label: "History",
        renderIcon: (active) => (
            <svg viewBox="0 0 24 24" fill="none" className="h-[22px] w-[22px]" stroke="currentColor" strokeWidth={active ? "2.4" : "2"} strokeLinecap="round" strokeLinejoin="round">
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
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                <path d="M12 12v6" />
                <path d="m15 15-3-3-3 3" />
            </svg>
        ),
    },
    {
        href: "/calendar",
        label: "Calendar",
        renderIcon: (active) => (
            <svg viewBox="0 0 24 24" fill="none" className="h-[22px] w-[22px]" stroke="currentColor" strokeWidth={active ? "2.4" : "2"} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="4" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        ),
    },
    {
        href: "/analytics",
        label: "Analytics",
        renderIcon: (active) => (
            <svg viewBox="0 0 24 24" fill="none" className="h-[22px] w-[22px]" stroke="currentColor" strokeWidth={active ? "2.4" : "2"} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 20V10" />
                <path d="M12 20V4" />
                <path d="M6 20v-6" />
            </svg>
        ),
    },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center"
            style={{
                background: "rgba(255, 255, 255, 0.98)",
                backdropFilter: "blur(20px)",
                borderTop: "1px solid rgba(0, 0, 0, 0.06)",
                boxShadow: "0 -4px 25px rgba(0, 0, 0, 0.05)",
            }}
            aria-label="Mobile navigation"
        >
            <div className="flex items-end justify-around w-full px-2 pt-2 pb-1">
                {navItems.map(({ href, label, renderIcon, isCenter }) => {
                    const active = pathname === href || (href !== "/accounts" && pathname.startsWith(href + "/")) || (href === "/accounts" && (pathname === "/accounts" || pathname === "/"));

                    if (isCenter) {
                        return (
                            <div key={href} className="flex-1 flex justify-center" style={{ marginBottom: "4px" }}>
                                <Link
                                    href={href}
                                    className="flex flex-col items-center gap-0.5 -mt-6 group"
                                    aria-label={label}
                                >
                                    <div
                                        className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform duration-200 group-hover:scale-105 active:scale-95"
                                        style={{
                                            background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
                                            boxShadow: "0 8px 22px rgba(124, 58, 237, 0.45)",
                                        }}
                                    >
                                        {renderIcon(true)}
                                    </div>
                                    <span
                                        className="text-[10px] font-black mt-0.5 tracking-tight"
                                        style={{ color: "#7C3AED" }}
                                    >
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
                            className={cn(
                                "flex flex-1 flex-col items-center justify-center py-2 gap-1 transition-all duration-150",
                                active ? "text-purple-600 font-bold" : "text-gray-400 hover:text-gray-600 font-medium"
                            )}
                            aria-label={label}
                            aria-current={active ? "page" : undefined}
                        >
                            <div className={cn("transition-transform duration-150", active && "scale-110")}>
                                {renderIcon(active)}
                            </div>
                            <span
                                className={cn(
                                    "text-[10px] leading-none transition-colors",
                                    active ? "text-purple-600 font-bold" : "text-gray-400"
                                )}
                            >
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </div>

            {/* iOS Home Indicator Bar */}
            <div className="w-32 h-1 bg-gray-900/80 rounded-full mb-1 mt-0.5" />
        </nav>
    );
}
