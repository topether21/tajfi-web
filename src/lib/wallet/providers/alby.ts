import type { Transaction, WalletStrategy } from "./shared";

export class AlbyWallet implements WalletStrategy {
    async getKeys() {
        if (window?.nostr?.enable) {
            await window.nostr.enable()
        } else {
            throw new Error(
                "Oops, it looks like you haven't set up your Nostr key yet." +
                'Go to your Account Settings and create or import a Nostr key.',
            )
        }
        return {
            ordinalsPublicKey: await window.nostr.getPublicKey(),
            ordinalsAddress: '', // TODO: add nostr address
        }
    }
    async signSimpleMessage(message: string): Promise<string> {
        if (window.nostr) {
            const signed = await window.nostr.signSchnorr(message)
            return signed
        }
        throw new Error('Signing with Nostr is not available')
    }
    async signTx(transaction: Transaction): Promise<string> {
        // Implementation for Alby
        return ''
    }
}