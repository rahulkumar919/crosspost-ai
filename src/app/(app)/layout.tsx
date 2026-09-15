import * as React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileHeader } from "@/components/layout/MobileHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-dvh">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex flex-col flex-1 min-w-0 min-h-dvh">
                {/* Mobile-only top header */}
                <MobileHeader />

                {/* Page content */}
                <main className="flex flex-col flex-1 pb-20 lg:pb-0 min-w-0">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Nav */}
            <BottomNav />
        </div>
    );
}
