import { bitcoin, NETWORK, toXOnly } from "./bitcoin";
import type { AddressInfo, Transaction, WalletStrategy } from "./shared";

// ref: https://docs.unisat.io/dev/unisat-developer-center/bitcoin/unisat-wallet
export class UnisatWallet implements WalletStrategy {
    async getKeys(): Promise<{ ordinalsPublicKey: string, ordinalsAddress: string }> {
        if (!window.unisat) {
            throw new Error('Unisat is not available')
        }
        const accounts = await window.unisat.requestAccounts();
        console.log('connect success', accounts);
        const pubkey = await window.unisat.getPublicKey();
        return {
            ordinalsPublicKey: pubkey,
            ordinalsAddress: accounts[0]
        };
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
    async getAddressInfo(pubkey: string): Promise<AddressInfo> {
        const pubkeyBuffer = Buffer.from(pubkey, 'hex');
        const addrInfo = bitcoin.payments.p2tr({
            internalPubkey: toXOnly(pubkeyBuffer),
            network: NETWORK,
        });
        return addrInfo;
    }
}
