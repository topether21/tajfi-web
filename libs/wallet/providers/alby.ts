import { getP2trAddress } from "./bitcoin";
import type { AddressInfo, Transaction, WalletStrategy } from "./shared";

export class AlbyWallet implements WalletStrategy {
	async getKeys() {
		if (window?.nostr?.enable) {
			await window.nostr.enable();
		} else {
			throw new Error(
				"Oops, it looks like you haven't set up your Nostr key yet." +
					"Go to your Account Settings and create or import a Nostr key.",
			);
		}
		const tapasPublicKey = await window.nostr.getPublicKey();
		const tapasAddress = await this.getP2trAddress(tapasPublicKey);
		return {
			tapasPublicKey,
			tapasAddress: tapasAddress.address,
		};
	}
	// https://www.webln.guide/building-lightning-apps/webln-reference/webln.signmessage
	async signSimpleMessage(message: string): Promise<string> {
		if (typeof window.nostr === "undefined")
			throw new Error("Nostr is not enabled");
		const signed = await window.nostr.signSchnorr(message);
		return signed;
	}
	async signTx(transaction: Transaction): Promise<string> {
		if (typeof window.nostr === "undefined")
			throw new Error("Nostr is not enabled");
		const signed = await window.nostr.signSchnorr(transaction);
		return signed;
	}
	async getP2trAddress(pubkey: string): Promise<AddressInfo> {
		return getP2trAddress(pubkey);
	}
}
