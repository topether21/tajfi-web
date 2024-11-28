import type { Transaction } from "./providers/shared";

declare global {
	interface Window {
		nostr?: {
			enable: () => Promise<void>;
			getPublicKey: () => Promise<string>;
			signSchnorr: (hex: string) => Promise<string>;
		};
		// TODO: WIP: unisat
		unisat?: {
			signMessage: (message: string, type: string) => Promise<string>;
			requestAccounts: () => Promise<string[]>;
			getPublicKey: () => Promise<string>;
		};
		// TODO: WIP: ethereum
		ethereum?: {
			// TODO: specify the type
			// biome-ignore lint/suspicious/noExplicitAny: it is ok for now
			request: (args: any) => Promise<any>;
			selectedAddress: string;
		};
		webln?: {
			isEnabled: () => Promise<boolean>;
			enable: () => Promise<void>;
			signMessage: (message: string) => Promise<string>;
		};
		$onekey?: {
			nostr?: {
				enable: () => Promise<void>;
				getPublicKey: () => Promise<string>;
				signSchnorr: (transaction: Transaction) => Promise<string>;
			};
			webln?: {
				enable: () => Promise<void>;
				signMessage: (message: string) => Promise<string>;
			};
		};
		alby?: {
			nostr?: {
				signSchnorr: (message: string) => Promise<string>;
				enable: () => Promise<void>;
				signMessage: (message: string) => Promise<string>;
				getPublicKey: () => Promise<string>;
			};
		};
	}
}

export type WalletKeys = {
	tapasPublicKey: string;
	tapasAddress: string;
	providerName: WalletProvider;
};

export type WalletProvider = "Alby" | "Nostr" | "OneKey" | "webAuthn" | "none";
