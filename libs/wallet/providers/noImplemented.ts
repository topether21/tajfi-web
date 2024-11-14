import type { AddressInfo, Transaction, WalletStrategy } from "./shared";

export class NoImplementedWallet implements WalletStrategy {
	async getKeys(): Promise<{ tapasPublicKey: string; tapasAddress: string }> {
		throw new Error("Not implemented");
	}
	async signSimpleMessage(
		message: string,
		{ address }: { address: string },
	): Promise<string> {
		throw new Error("Not implemented");
	}
	async signTx(transaction: Transaction): Promise<string> {
		throw new Error("Not implemented");
	}
	async getP2trAddress(pubkey: string): Promise<AddressInfo> {
		throw new Error("Not implemented");
	}
}
