import type { WalletProvider } from "../types";
import { AlbyProvider } from "./alby";
import { createProvider, NostrProvider } from "./nostr";
import type { WalletStrategy } from "./shared";
import { WebAuthnWallet } from "./web-authn/web-authn";

export const getProviderStrategy = (
	provider: WalletProvider,
): WalletStrategy => {
	switch (provider) {
		case "alby":
			return createProvider({ windowKey: "alby", providerName: "Alby" });
		case "nostr":
			return createProvider({ windowKey: "nostr", providerName: "Nostr" });
		case "oneKey":
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
	const supportsWebAuthn =
		typeof navigator !== "undefined" &&
		typeof navigator.credentials !== "undefined" &&
		typeof navigator.credentials.create !== "undefined" &&
		typeof navigator.credentials.get !== "undefined" &&
		typeof PublicKeyCredential !== "undefined" &&
		typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !==
		"undefined" &&
		(await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
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
	if (oneKeyEnabled) providers.push("oneKey");
	if (albyEnabled) providers.push("alby");
	if (nostrEnabled && !albyEnabled && !oneKeyEnabled) providers.push("nostr");
	if (webAuthnEnabled) providers.push("webAuthn");
	return providers;
};
