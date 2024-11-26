import { jwtDecode } from "jwt-decode";
import { auth } from "./api";
import {
	getAuthToken,
	getWalletData,
	removeAuthToken,
	removeWalletData,
	saveAuthToken,
	saveWalletData,
} from "./db";
import { getProviderStrategy } from "./providers/index";
import type { WebAuthnProvider } from "./providers/web-authn/web-authn";
import type { WalletProvider } from "./types";
import { AUTH_MESSAGE } from "@/libs/constants";

export const connectWallet = async (providerName: WalletProvider) => {
	const walletProvider = getProviderStrategy(providerName);
	let tapasPublicKey = "";
	let tapasAddress = "";
	let privateKey = "";
	try {
		const keys = await walletProvider.getKeys();
		tapasPublicKey = keys.tapasPublicKey;
		tapasAddress = keys.tapasAddress;
		privateKey = keys.privateKey || "";
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes("web-authn: No wallet selected")) {
				const keys = await (
					walletProvider as unknown as WebAuthnProvider
				).createKeys({ walletName: "Tajfi" });
				tapasPublicKey = keys.tapasPublicKey;
				tapasAddress = keys.tapasAddress;
				privateKey = keys.privateKey || "";
			}
		}
		throw error;
	}

	const signature =
		(await walletProvider.signSimpleMessage(AUTH_MESSAGE, {
			address: tapasAddress,
			publicKey: tapasPublicKey,
			privateKey,
		})) ?? "";
	const serverAuthResponse = await auth({
		tapasPublicKey,
		signature,
		message: AUTH_MESSAGE,
	});
	if (!serverAuthResponse.token)
		throw new Error("No token received from server");

	const walletData = {
		providerName,
		tapasPublicKey,
		tapasAddress,
	};

	await Promise.all([
		saveAuthToken(serverAuthResponse.token),
		saveWalletData(walletData),
	]);

	return walletData;
};

export const disconnectWallet = async () =>
	Promise.all([removeAuthToken(), removeWalletData()]);

export const isSessionActive = async () => {
	const [walletData, authToken] = await Promise.all([
		getWalletData(),
		getAuthToken(),
	]);
	if (!walletData || !authToken) return null;
	try {
		const decodedToken = jwtDecode(authToken);
		const isSessionActive =
			decodedToken?.exp && decodedToken.exp > Date.now() / 1000;
		if (!isSessionActive) return null;
		return walletData;
	} catch (error) {
		console.error("Error checking session", error);
		return null;
	}
};
