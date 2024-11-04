export type Transaction = any; // TODO: add type for transaction

export interface WalletStrategy {
    getKeys(): Promise<{ ordinalsPublicKey: string, ordinalsAddress: string }>;
    signSimpleMessage(message: string, { address }: { address?: string }): Promise<string>;
    signTx(transaction: Transaction, { address }: { address?: string }): Promise<string>;
}

