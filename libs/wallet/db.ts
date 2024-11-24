import AsyncStorage from "@react-native-async-storage/async-storage";
import type { WalletKeys } from "./types";
import { KEY_AUTH_TOKEN, KEY_WALLET_DATA } from "@/libs/constants";
export const saveAuthToken = async (token: string) =>
	AsyncStorage.setItem(KEY_AUTH_TOKEN, token);
export const getAuthToken = async () => AsyncStorage.getItem(KEY_AUTH_TOKEN);
export const removeAuthToken = async () =>
	AsyncStorage.removeItem(KEY_AUTH_TOKEN);

export const saveWalletData = async (walletData: WalletKeys) =>
	AsyncStorage.setItem(KEY_WALLET_DATA, JSON.stringify(walletData));
export const getWalletData = async () => {
	const walletData = await AsyncStorage.getItem(KEY_WALLET_DATA);
	return walletData ? (JSON.parse(walletData) as WalletKeys) : null;
};
export const removeWalletData = async () =>
	AsyncStorage.removeItem(KEY_WALLET_DATA);
