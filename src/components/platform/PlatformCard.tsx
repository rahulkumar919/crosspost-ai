"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn, platformLabel } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { YoutubeIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/platform-icons";
import type { Platform } from "@/types/account.types";
import type { ConnectedAccount } from "@/types/account.types";

const platformConfig: Record<
    Platform,
    {
        Icon: React.ComponentType<{ className?: string }>;
        color: string;
        bgColor: string;
        ringColor: string;
        gradientFrom: string;
        label: string;
        handle: string;
    }
> = {
    youtube: {
        Icon: YoutubeIcon,
        color: "text-youtube",
        bgColor: "bg-red-50 dark:bg-red-950/50",
        ringColor: "ring-red-100 dark:ring-red-900",
        gradientFrom: "from-red-500/5",
        label: "YouTube",
        handle: "Video platform",
    },
    instagram: {
        Icon: InstagramIcon,
        color: "text-instagram",
        bgColor: "bg-pink-50 dark:bg-pink-950/50",
        ringColor: "ring-pink-100 dark:ring-pink-900",
        gradientFrom: "from-pink-500/5",
        label: "Instagram",
        handle: "Photo & Reels platform",
    },
    linkedin: {
        Icon: LinkedinIcon,
        color: "text-linkedin",
        bgColor: "bg-blue-50 dark:bg-blue-950/50",
        ringColor: "ring-blue-100 dark:ring-blue-900",
        gradientFrom: "from-blue-500/5",
        label: "LinkedIn",
        handle: "Professional network",
    },
};

interface PlatformCardProps {
    platform: Platform;
    account?: ConnectedAccount;
    onConnect: (platform: Platform) => void;
    onDisconnect: (platform: Platform) => void;
    isLoading?: boolean;
}

export function PlatformCard({
    platform,
    account,
    onConnect,
    onDisconnect,
    isLoading = false,
}: PlatformCardProps) {
    const config = platformConfig[platform];
    const isConnected = !!account;

    return (
        <Card
            className={cn(
                "w-full overflow-hidden transition-all duration-200",
                isConnected
                    ? "border-border shadow-sm hover:shadow-md"
                    : "hover:border-border/80 hover:shadow-sm"
            )}
        >
            <CardContent className="p-0">
                <div className="flex items-center gap-4 px-5 py-4">
                    {/* Platform icon */}
                    <div
                        className={cn(
                            "flex h-12 w-12 shrink-0 items-center justify-center",
                            "rounded-[var(--radius-lg)] ring-4",
                            config.bgColor,
                            config.ringColor
                        )}
                        aria-hidden="true"
                    >
                        <config.Icon className={cn("h-5 w-5", config.color)} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">
                                {platformLabel(platform)}
                            </span>
                            {isConnected && (
                                <span className={cn(
                                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5",
                                    "bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800",
                                    "text-[10px] font-medium text-success"
                                )}>
                                    <CheckCircle2 className="h-2.5 w-2.5" aria-hidden="true" />
                                    Connected
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-foreground-muted mt-0.5 truncate">
                            {isConnected
                                ? account?.handle ?? "Connected"
                                : config.handle}
                        </p>
                        {isConnected && account?.connectedAt && (
                            <p className="text-[10px] text-foreground-muted/60 mt-0.5">
                                Connected {new Date(account.connectedAt).toLocaleDateString("en-US", {
                                    month: "short", day: "numeric", year: "numeric"
                                })}
                            </p>
                        )}
                    </div>

                    {/* Action */}
                    {isConnected ? (
                        <Button
                            variant="outline"
                            size="sm"
                            isLoading={isLoading}
                            loadingText="Disconnecting…"
                            onClick={() => onDisconnect(platform)}
                            aria-label={`Disconnect ${platformLabel(platform)}`}
                            className="text-xs shrink-0"
                        >
                            Disconnect
                        </Button>
                    ) : (
                        <Button
                            variant="default"
                            size="sm"
                            isLoading={isLoading}
                            loadingText="Connecting…"
                            onClick={() => onConnect(platform)}
                            aria-label={`Connect ${platformLabel(platform)}`}
                            className="text-xs shrink-0 shadow-sm shadow-primary/20"
                        >
                            Connect
                        </Button>
                    )}
                </div>

                {/* Connected accent bar */}
                {isConnected && (
                    <div className={cn("h-0.5 w-full bg-gradient-to-r", config.gradientFrom, "to-transparent")} />
                )}
            </CardContent>
        </Card>
    );
}
