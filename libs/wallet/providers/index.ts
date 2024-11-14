import type { WalletProvider } from "../types";
import { AlbyWallet } from "./alby";
import { OneKeyWallet } from "./onekey";
import type { WalletStrategy } from "./shared";
import { WebAuthnWallet } from "./web-authn/web-authn";

export const getProviderStrategy = (
	provider: WalletProvider,
): WalletStrategy => {
	switch (provider) {
		case "alby":
			return new AlbyWallet();
		case "oneKey":
			return new OneKeyWallet();
		case "webAuthn":
			return new WebAuthnWallet();
		default:
			throw new Error(`Unknown provider: ${provider}`);
	}
};

const isAlbyEnabled = async () => {
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
	const [albyEnabled, oneKeyEnabled, webAuthnEnabled] = await Promise.all([
		isAlbyEnabled(),
		isOneKeyEnabled(),
		isWebAuthnEnabled(),
	]);
	const providers: WalletProvider[] = [];
	if (oneKeyEnabled && albyEnabled) {
		providers.push("oneKey");
	} else if (oneKeyEnabled) {
		providers.push("oneKey");
	} else if (albyEnabled) {
		providers.push("alby");
	}
	if (webAuthnEnabled) providers.push("webAuthn");
	return providers;
};
