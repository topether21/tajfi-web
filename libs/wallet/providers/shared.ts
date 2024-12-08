// biome-ignore lint/suspicious/noExplicitAny: TODO: add type for transaction
export type Transaction = any;
// biome-ignore lint/suspicious/noExplicitAny: TODO: add type for address info
export type AddressInfo = any;

export interface WalletStrategy {
	getKeys(domain?: string): Promise<{
		tapasPublicKey: string;
		tapasAddress: string;
		privateKey?: string;
	}>;
	signSimpleMessage(
		message: string,
		options: { publicKey?: string; address?: string; privateKey?: string },
	): Promise<string>;
	signTx(
		transaction: Transaction,
		{ address }: { address?: string },
	): Promise<string>;
	getP2trAddress(pubkey: string): Promise<AddressInfo>;
}
