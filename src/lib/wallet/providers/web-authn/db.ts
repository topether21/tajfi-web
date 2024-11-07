// db.ts - Helper for localStorage

import { KEY_CURRENT_WALLET_ID, KEY_WALLETS } from "@/lib/constants";

export interface StoredWallet {
    id: string;
    encryptedKey: string; // Stored as JSON string
    walletName: string;
}



export const getAllStoredWallets = (): StoredWallet[] => {
    const storedWallets = localStorage.getItem(KEY_WALLETS);
    if (storedWallets) {
        return JSON.parse(storedWallets);
    }
    return [];
}

export const storeEncryptedPrivateKey = (id: string, encryptedKey: string, walletName: string): void => {
    const storedWallet: StoredWallet = { id, encryptedKey, walletName };
    const wallets = getAllStoredWallets();
    wallets.push(storedWallet);
    localStorage.setItem(KEY_WALLETS, JSON.stringify(wallets));
}

export const retrieveEncryptedPrivateKey = (id: string): StoredWallet | null => {
    const wallets = getAllStoredWallets();
    const wallet = wallets.find(w => w.id === id);
    return wallet || null;
}

export const removeEncryptedPrivateKey = (id: string): void => {
    const wallets = getAllStoredWallets();
    const updatedWallets = wallets.filter(w => w.id !== id);
    localStorage.setItem(KEY_WALLETS, JSON.stringify(updatedWallets));
}

// Clear all stored wallets
// ONLY FOR TESTING
export const clearAllWallets = (): void => {
    localStorage.removeItem(KEY_WALLETS);
}

export const setCurrentWalletId = (id: string): void => {
    localStorage.setItem(KEY_CURRENT_WALLET_ID, id);
}

export const getCurrentWalletId = (): string | null => {
    return localStorage.getItem(KEY_CURRENT_WALLET_ID) || null;
}
