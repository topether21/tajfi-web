export type Transaction = any; // TODO: add type for transaction
export type AddressInfo = any; // TODO: add type for address info

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
