import { getP2trAddress } from "./bitcoin";
import type { AddressInfo, Transaction, WalletStrategy } from "./shared";

export interface NostrProvider {
	nostr: {
		enable: () => Promise<void>;
		signSchnorr: (message: string) => Promise<string | null>;
		getPublicKey: () => Promise<string>;
	};
}

type ProviderWindowKey = "alby" | "$onekey" | "nostr";

interface ProviderConfig {
	windowKey: ProviderWindowKey;
	providerName: string;
}

export const createProvider = ({
	windowKey,
	providerName,
}: ProviderConfig): WalletStrategy => {
	const getProvider = (): NostrProvider => {
		const provider = window[windowKey] as unknown as NostrProvider;
		if (!provider?.nostr)
			throw new Error(`Nostr is not enabled in ${providerName}`);
		return provider;
	};

	const signMessage = async (message: string): Promise<string> => {
		const provider = getProvider();
		const signed = await provider.nostr.signSchnorr(message);
		return signed || "";
	};

	return {
		async getKeys() {
			const provider = getProvider();
			await provider.nostr.enable();
			const tapasPublicKey = (await provider.nostr.getPublicKey()) || "";
			const tapasAddress =
				(await getP2trAddress(tapasPublicKey))?.address || "";
			return {
				tapasPublicKey,
				tapasAddress,
			};
		},
		async signSimpleMessage(message: string): Promise<string> {
			return signMessage(message);
		},
		async signTx(transaction: Transaction): Promise<string> {
			return signMessage(transaction);
		},
		async getP2trAddress(pubkey: string): Promise<AddressInfo> {
			return getP2trAddress(pubkey);
		},
	};
};

/*
Example providers
export const AlbyProvider = createProvider({
	windowKey: "alby",
	providerName: "Alby",
});
export const OneKeyProvider = createProvider({
	windowKey: "$onekey",
	providerName: "OneKey",
});
export const NostrProvider = createProvider({
	windowKey: "nostr",
	providerName: "Nostr",
});
*/
