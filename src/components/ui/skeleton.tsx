import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Height in Tailwind class notation, e.g. "h-4", "h-6" */
    height?: string;
    /** Width in Tailwind class notation, e.g. "w-full", "w-24" */
    width?: string;
    rounded?: "sm" | "md" | "lg" | "full";
}

export function Skeleton({
    className,
    height = "h-4",
    width = "w-full",
    rounded = "md",
    ...props
}: SkeletonProps) {
    const radiusClass = {
        sm: "rounded",
        md: "rounded-[var(--radius-md)]",
        lg: "rounded-[var(--radius-lg)]",
        full: "rounded-full",
    }[rounded];

    return (
        <div
            role="status"
            aria-label="Loading…"
            className={cn(
                "animate-pulse bg-border",
                height,
                width,
                radiusClass,
                className
            )}
            {...props}
        />
    );
}

/** Convenience wrapper for a multi-line text block skeleton */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
    return (
        <div className="flex flex-col gap-2" aria-label="Loading content…" role="status">
            {Array.from({ length: lines }, (_, i) => (
                <Skeleton
                    key={i}
                    height="h-4"
                    width={i === lines - 1 ? "w-3/4" : "w-full"}
                />
            ))}
        </div>
    );
}
