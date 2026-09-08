import { create } from "zustand";
import type { ConnectedAccount, Platform } from "@/types/account.types";

interface AccountsState {
    accounts: ConnectedAccount[];
    setAccounts: (accounts: ConnectedAccount[]) => void;
    addAccount: (account: ConnectedAccount) => void;
    removeAccount: (platform: Platform) => void;
}

export const useAccountsStore = create<AccountsState>((set) => ({
    accounts: [],
    setAccounts: (accounts) => set({ accounts }),
    addAccount: (account) =>
        set((state) => ({
            accounts: [
                ...state.accounts.filter((a) => a.platform !== account.platform),
                account,
            ],
        })),
    removeAccount: (platform) =>
        set((state) => ({
            accounts: state.accounts.filter((a) => a.platform !== platform),
        })),
}));
