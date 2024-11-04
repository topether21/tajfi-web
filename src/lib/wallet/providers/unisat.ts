import type { Transaction, WalletStrategy } from "./shared";

export class UnisatWallet implements WalletStrategy {
    async getKeys(): Promise<{ ordinalsPublicKey: string, ordinalsAddress: string }> {
        throw new Error('Not implemented')
    }
    async signSimpleMessage(message: string, { address }: { address: string }): Promise<string> {
        if (window.unisat) {
            return window.unisat.signMessage(message, "bip322-simple");
        }
        throw new Error('Unisat is not available')
    }
    async signTx(transaction: Transaction): Promise<string> {
        throw new Error('Not implemented')
    }
}