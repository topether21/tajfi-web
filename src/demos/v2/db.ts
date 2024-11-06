// db.ts - Helper for localStorage

export interface StoredWallet {
    id: string;
    encryptedKey: string; // Stored as JSON string
    walletName?: string;  // Optional wallet name
}

const WALLETS_KEY = "nostr_wallets";

// Retrieve all stored wallets
export async function getAllStoredWallets(): Promise<StoredWallet[]> {
    const storedWallets = localStorage.getItem(WALLETS_KEY);
    if (storedWallets) {
        return JSON.parse(storedWallets);
    }
    return [];
}

// Store a new encrypted private key
export async function storeEncryptedPrivateKey(id: string, encryptedKey: string, walletName: string): Promise<void> {
    const storedWallet: StoredWallet = { id, encryptedKey, walletName };
    const wallets = await getAllStoredWallets();
    wallets.push(storedWallet);
    localStorage.setItem(WALLETS_KEY, JSON.stringify(wallets));
}

// Retrieve a specific encrypted private key by ID
export async function retrieveEncryptedPrivateKey(id: string): Promise<StoredWallet | null> {
    const wallets = await getAllStoredWallets();
    const wallet = wallets.find(w => w.id === id);
    return wallet || null;
}

// Remove a wallet by ID
export async function removeEncryptedPrivateKey(id: string): Promise<void> {
    const wallets = await getAllStoredWallets();
    const updatedWallets = wallets.filter(w => w.id !== id);
    localStorage.setItem(WALLETS_KEY, JSON.stringify(updatedWallets));
}

// Clear all stored wallets
export async function clearAllWallets(): Promise<void> {
    localStorage.removeItem(WALLETS_KEY);
}