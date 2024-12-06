import type { WalletProvider } from "../types";
import { createProvider } from "./nostr";
import type { WalletStrategy } from "./shared";
import { WebAuthnWallet } from "./web-authn/web-authn";

export const getProviderStrategy = (
	provider: WalletProvider,
): WalletStrategy => {
	switch (provider) {
		case "Alby":
			return createProvider({ windowKey: "alby", providerName: "Alby" });
		case "Nostr":
			return createProvider({ windowKey: "nostr", providerName: "Nostr" });
		case "OneKey":
			return createProvider({ windowKey: "$onekey", providerName: "OneKey" });
		case "webAuthn":
			return new WebAuthnWallet();
		default:
			throw new Error(`Unknown provider: ${provider}`);
	}
};

const isAlbyEnabled = async () => {
	return typeof window.alby !== "undefined";
};

const isNostrEnabled = async () => {
	return typeof window?.nostr?.enable !== "undefined";
};

// https://developer.onekey.so/guide/web-app-integration-developer
const isOneKeyEnabled = async () => {
	return typeof window?.$onekey !== "undefined";
};

const isWebAuthnEnabled = async () => {
	const navigatorAvailable = typeof navigator !== "undefined";
	const credentialsAvailable = typeof navigator.credentials !== "undefined";
	const createAvailable = typeof navigator.credentials.create !== "undefined";
	const getAvailable = typeof navigator.credentials.get !== "undefined";
	const publicKeyCredentialAvailable = typeof PublicKeyCredential !== "undefined";
	const isUserVerifyingPlatformAuthenticatorAvailable =
		typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !== "undefined";
	const supportsWebAuthn =
		navigatorAvailable &&
		credentialsAvailable &&
		createAvailable &&
		getAvailable &&
		publicKeyCredentialAvailable &&
		isUserVerifyingPlatformAuthenticatorAvailable &&
		(await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());

	console.log("navigator check:", navigatorAvailable);
	console.log("navigator.credentials check:", credentialsAvailable);
	console.log("navigator.credentials.create check:", createAvailable);
	console.log("navigator.credentials.get check:", getAvailable);
	console.log("PublicKeyCredential check:", publicKeyCredentialAvailable);
	console.log("PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable check:", isUserVerifyingPlatformAuthenticatorAvailable);
	console.log("supportsWebAuthn:", supportsWebAuthn);

	return supportsWebAuthn;
};

export const getEnabledProviders = async () => {
	const [albyEnabled, nostrEnabled, oneKeyEnabled, webAuthnEnabled] =
		await Promise.all([
			isAlbyEnabled(),
			isNostrEnabled(),
			isOneKeyEnabled(),
			isWebAuthnEnabled(),
		]);
	const providers: WalletProvider[] = [];
	if (oneKeyEnabled) providers.push("OneKey");
	if (albyEnabled) providers.push("Alby");
	if (nostrEnabled && !albyEnabled && !oneKeyEnabled) providers.push("Nostr");
	if (webAuthnEnabled) providers.push("webAuthn");
	return providers;
};
