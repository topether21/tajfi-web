import { getP2trAddress } from "./bitcoin";
import type { AddressInfo, Transaction, WalletStrategy } from "./shared";

// ref: https://developer.onekey.so/guide/web-app-integration-developer
export class OneKeyWallet implements WalletStrategy {
	async getKeys(): Promise<{ tapasPublicKey: string; tapasAddress: string }> {
		const provider = window.$onekey?.nostr || window.nostr;
		if (!provider) throw new Error("Nostr is not enabled");
		await provider.enable();
		const tapasPublicKey = await provider.getPublicKey();
		const tapasAddress = await this.getP2trAddress(tapasPublicKey);
		return {
			tapasPublicKey,
			tapasAddress: tapasAddress.address,
		};
	}
	async signSimpleMessage(message: string): Promise<string> {
		const provider = window.$onekey?.webln || window.webln;
		if (!provider) throw new Error("Webln is not enabled");
		await provider.enable();
		const signature = (await provider.signMessage(message)) as unknown as {
			signature: string;
		};
		return signature.signature;
	}
	async signTx(transaction: Transaction): Promise<string> {
		const provider = window.$onekey?.nostr || window.nostr;
		if (!provider) throw new Error("Nostr is not enabled");
		const signed = await provider.signSchnorr(transaction);
		return signed;
	}
	async getP2trAddress(pubkey: string): Promise<AddressInfo> {
		return getP2trAddress(pubkey);
	}
}
