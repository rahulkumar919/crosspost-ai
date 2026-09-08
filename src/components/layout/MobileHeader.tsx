"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileHeader() {
    const { data: session } = useSession();

    return (
        <header
            className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3"
            style={{
                background: "#0D0A2E",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            {/* Logo */}
            <Link href="/accounts" className="flex items-center gap-2.5">
                <div
                    className="relative h-9 w-9 rounded-xl overflow-hidden shrink-0"
                    style={{
                        boxShadow: "0 0 16px rgba(108,92,231,0.6)",
                    }}
                >
                    <Image
                        src="/logo.png"
                        alt="CrossPost AI"
                        fill
                        sizes="36px"
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="leading-none">
                    <p className="text-white font-black text-sm">
                        CrossPost <span style={{ color: "#a29bfe" }}>AI</span>
                    </p>
                    <p className="text-[9px] font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                        One Post, Every Platform
                    </p>
                </div>
            </Link>

            {/* Right actions */}
            <div className="flex items-center gap-2">
                {/* Notification bell */}
                <button
                    className="relative flex h-8 w-8 items-center justify-center rounded-xl transition-colors hover:bg-white/10"
                    aria-label="Notifications"
                >
                    <Bell className="h-4 w-4 text-white/70" aria-hidden="true" />
                    {/* Unread dot */}
                    <span
                        className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-purple-400"
                        aria-hidden="true"
                    />
                </button>

                {session ? (
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white/80 hover:bg-white/10 transition-colors border"
                        style={{ borderColor: "rgba(255,255,255,0.15)" }}
                    >
                        <User className="h-3.5 w-3.5" aria-hidden="true" />
                        {session.user?.name?.split(" ")[0] ?? "Account"}
                    </button>
                ) : (
                    <Link
                        href="/login"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white border transition-all hover:bg-white/10"
                        style={{ borderColor: "rgba(255,255,255,0.25)" }}
                    >
                        <User className="h-3.5 w-3.5" aria-hidden="true" />
                        Login / Sign Up
                    </Link>
                )}
            </div>
        </header>
    );
}
