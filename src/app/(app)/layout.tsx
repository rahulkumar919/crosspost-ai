import * as React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileHeader } from "@/components/layout/MobileHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-dvh">
            {/* Desktop sidebar */}
            <Sidebar />

            {/* Main content */}
            <div className="flex flex-col flex-1 min-w-0 min-h-dvh">
                {/* Mobile header — 56px (h-14) */}
                <MobileHeader />

                {/*
                 * Page content.
                 * pb-20  → clears mobile BottomNav (~80px) on small screens.
                 * lg:pb-0 → no extra padding on desktop (BottomNav is hidden).
                 */}
                <main className="flex flex-col flex-1 pb-20 lg:pb-0 min-w-0">
                    {children}
                </main>
            </div>

            {/* Mobile bottom nav */}
            <BottomNav />
        </div>
    );
}
