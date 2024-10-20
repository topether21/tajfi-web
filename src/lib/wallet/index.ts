'use client';
import { networks, payments } from 'bitcoinjs-lib';


const NETWORK = networks.bitcoin;

export type WalletKeys = {
    ordinalsPublicKey: string;
    paymentPublicKey: string;
    ordinalsAddress: string;
    paymentAddress: string;
};

const getNostrPubKey = async () => {
    if (window?.nostr?.enable) {
        await window.nostr.enable();
    } else {
        throw new Error(
            "Oops, it looks like you haven't set up your Nostr key yet." +
            'Go to your Alby Account Settings and create or import a Nostr key.'
        );
    }
    return window.nostr.getPublicKey();
};

const getAddressInfo = (pubkey: string) => {
    const pubkeyBuffer = Buffer.from(pubkey, 'hex');
    const addrInfo = payments.p2tr({
        pubkey: pubkeyBuffer,
        network: NETWORK,
    });
    return addrInfo;
};

export const connectWallet = async (provider = '') => {
    const walletName = provider?.split('.')[0] || 'alby';
    const ordinalsPublicKey = await getNostrPubKey();
    // const ordinalsAddress = getAddressInfo(ordinalsPublicKey);
    return {
        walletName,
        ordinalsPublicKey,
        paymentPublicKey: '',
        ordinalsAddress: '',
        paymentAddress: '',
    };
};
