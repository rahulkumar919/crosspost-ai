export type Platform = "youtube" | "instagram" | "linkedin";

export interface ConnectedAccount {
    id: string;
    platform: Platform;
    handle: string;
    avatarUrl?: string;
    connectedAt: string;
    isActive: boolean;
}

export interface AccountConnectionStatus {
    platform: Platform;
    isConnected: boolean;
    account?: ConnectedAccount;
}
