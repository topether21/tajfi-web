import { getP2trAddress } from "./bitcoin";
import type { AddressInfo, Transaction, WalletStrategy } from "./shared";


const signMessage = async (message: string) => {
	if (typeof window.nostr === "undefined")
		throw new Error("Nostr is not enabled");
	const signed = await window.nostr.signSchnorr(message);
	return signed;
};

export class NostrProvider implements WalletStrategy {

	async getKeys() {
		if (window?.nostr?.enable) {
			await window.nostr.enable();
		} else {
			throw new Error(
				"Oops, it looks like you haven't set up your Nostr key yet.",
			);
		}
		const tapasPublicKey = await window.nostr.getPublicKey();
		const tapasAddress = await this.getP2trAddress(tapasPublicKey);
		return {
			tapasPublicKey,
			tapasAddress: tapasAddress.address,
		};
	}
	async signSimpleMessage(message: string): Promise<string> {
		return signMessage(message);
	}
	async signTx(transaction: Transaction): Promise<string> {
		return signMessage(transaction);
	}
	async getP2trAddress(pubkey: string): Promise<AddressInfo> {
		return getP2trAddress(pubkey);
	}
}
