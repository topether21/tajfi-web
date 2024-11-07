export type Transaction = any; // TODO: add type for transaction
export type AddressInfo = any; // TODO: add type for address info

export interface WalletStrategy {
    getKeys(domain?: string): Promise<{ tapasPublicKey: string, tapasAddress: string }>;
    signSimpleMessage(message: string, { publicKey, address }: { publicKey?: string, address?: string }): Promise<string>;
    signTx(transaction: Transaction, { address }: { address?: string }): Promise<string>;
    getP2trAddress(pubkey: string): Promise<AddressInfo>;
}

