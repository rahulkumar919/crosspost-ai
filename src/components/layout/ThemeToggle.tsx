"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const [isDark, setIsDark] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        const stored = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const dark = stored === "dark" || (!stored && prefersDark);
        setIsDark(dark);
        document.documentElement.classList.toggle("dark", dark);
        setMounted(true);
    }, []);

    const toggle = () => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
    };

    // Render a placeholder of the same size before mount to avoid layout shift
    if (!mounted) {
        return (
            <div className="h-10 w-10" aria-hidden="true" />
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDark ? (
                <Sun className="h-4 w-4 text-yellow-500" aria-hidden="true" />
            ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
            )}
        </Button>
    );
}
