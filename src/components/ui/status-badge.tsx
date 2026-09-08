import * as React from "react";
import { cn } from "@/lib/utils";
import type { PublishStatus } from "@/types/post.types";

const statusConfig: Record<
    PublishStatus,
    { label: string; classes: string; dotClass: string }
> = {
    idle: {
        label: "Idle",
        classes: "bg-surface text-foreground-muted border-border",
        dotClass: "bg-muted",
    },
    queued: {
        label: "Queued",
        classes: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
        dotClass: "bg-blue-500",
    },
    uploading: {
        label: "Uploading",
        classes: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
        dotClass: "bg-yellow-500 animate-pulse",
    },
    published: {
        label: "Published",
        classes: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
        dotClass: "bg-green-500",
    },
    failed: {
        label: "Failed",
        classes: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
        dotClass: "bg-red-500",
    },
};

interface StatusBadgeProps {
    status: PublishStatus;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1",
                "rounded-full text-xs font-medium border",
                config.classes,
                className
            )}
        >
            <span
                className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dotClass)}
                aria-hidden="true"
            />
            {config.label}
        </span>
    );
}
