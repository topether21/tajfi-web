import type { AddressInfo, Transaction, WalletStrategy } from "./shared";

export class OneKeyWallet implements WalletStrategy {
    async getKeys(): Promise<{ ordinalsPublicKey: string, ordinalsAddress: string }> {
        throw new Error('Not implemented')
    }
    async signSimpleMessage(message: string, { address }: { address: string }): Promise<string> {
        throw new Error('Not implemented')
    }
    async signTx(transaction: Transaction): Promise<string> {
        throw new Error('Not implemented')
    }
    async getAddressInfo(pubkey: string): Promise<AddressInfo> {
        throw new Error('Not implemented')
    }
}