import { bip32 } from "./bitcoin";
import { bitcoin, NETWORK, toXOnly } from "./bitcoin";
import type { AddressInfo, Transaction, WalletStrategy } from "./shared";
import { ethers } from 'ethers';

export const METAMASK_PROVIDERS = ['nosft.xyz', 'ordswap.io', 'generative.xyz'];
export const DEFAULT_DERIV_PATH = "m/86'/0'/0'/0/0";

const getTaprootMessage = (domain: string) =>
    `Sign this message to generate your Bitcoin Taproot key. This key will be used for your ${domain} transactions.`;


export class MetamaskWallet implements WalletStrategy {
    async getKeys(domain: string): Promise<{ tapasPublicKey: string, tapasAddress: string }> {
        const { ethereum } = window;
        if (!ethereum || !window.ethereum) {
            throw new Error('Metamask is not available')
        }
        let ethAddress = ethereum.selectedAddress;
        if (!ethAddress) {
            await ethereum.request({ method: 'eth_requestAccounts' });
            ethAddress = ethereum.selectedAddress;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);

        const toSign = `0x${Buffer.from(getTaprootMessage(domain)).toString('hex')}`;
        const signature = await provider.send('personal_sign', [toSign, ethAddress]);
        const seed = ethers.getBytes(ethers.keccak256(ethers.getBytes(signature)));
        const root = bip32.fromSeed(Buffer.from(seed));
        const taprootChild = root.derivePath(DEFAULT_DERIV_PATH);
        const taprootAddress = bitcoin.payments.p2tr({
            internalPubkey: toXOnly(taprootChild.publicKey),
            network: NETWORK,
        });
        return {
            tapasPublicKey: Buffer.from(taprootAddress?.pubkey || '').toString('hex'),
            tapasAddress: taprootAddress?.address || '',
        };
    }
    async signSimpleMessage(message: string, { address }: { address: string }): Promise<string> {
        throw new Error('Not implemented')
    }
    async signTx(transaction: Transaction): Promise<string> {
        throw new Error('Not implemented')
    }
    async getP2trAddress(pubkey: string): Promise<AddressInfo> {
        throw new Error('Not implemented')
    }
}
