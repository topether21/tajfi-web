// db.ts - Helper for localStorage
import { KEY_CURRENT_WALLET_ID, KEY_WALLETS } from "@/libs/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";


export interface StoredWallet {
	id: string;
	encryptedKey: string; // Stored as JSON string
	walletName: string;
}

export const getAllStoredWallets = async (): Promise<StoredWallet[]> => {
	const storedWallets = await AsyncStorage.getItem(KEY_WALLETS);
	if (storedWallets) {
		return JSON.parse(storedWallets);
	}
	return [];
};

export const storeEncryptedPrivateKey = async (
	id: string,
	encryptedKey: string,
	walletName: string,
): Promise<void> => {
	const storedWallet: StoredWallet = { id, encryptedKey, walletName };
	const wallets = await getAllStoredWallets();
	wallets.push(storedWallet);
	await AsyncStorage.setItem(KEY_WALLETS, JSON.stringify(wallets));
};

export const retrieveEncryptedPrivateKey = async (
	id: string,
): Promise<StoredWallet | null> => {
	const wallets = await getAllStoredWallets();
	const wallet = wallets.find((w) => w.id === id);
	return wallet || null;
};

export const removeEncryptedPrivateKey = async (id: string): Promise<void> => {
	const wallets = await getAllStoredWallets();
	const updatedWallets = wallets.filter((w) => w.id !== id);
	await AsyncStorage.setItem(KEY_WALLETS, JSON.stringify(updatedWallets));
};

// Clear all stored wallets
// ONLY FOR TESTING
export const clearAllWallets = async (): Promise<void> => {
	await AsyncStorage.removeItem(KEY_WALLETS);
};

export const setCurrentWalletId = async (id: string): Promise<void> => {
	await AsyncStorage.setItem(KEY_CURRENT_WALLET_ID, id);
};

export const getCurrentWalletId = async (): Promise<string | null> => {
	return (await AsyncStorage.getItem(KEY_CURRENT_WALLET_ID)) || null;
};
