'use client';
import * as bitcoin from 'bitcoinjs-lib';
import ecc from '@bitcoinerlab/secp256k1';
import { PSBT_HEX } from './data';

bitcoin.initEccLib(ecc);

declare global {
    interface Window {
        nostr?: {
            enable: () => Promise<void>;
            getPublicKey: () => Promise<string>;
            signSchnorr: (hex: string) => Promise<string>;
        };
    }
}

export type WalletKeys = {
    ordinalsPublicKey: string;
    paymentPublicKey: string;
    ordinalsAddress: string;
    paymentAddress: string;
    token: string;
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
    console.log(`Pubkey: ${pubkey.toString()}`);
    const addrInfo = bitcoin.payments.p2tr({
        pubkey: pubkeyBuffer,
        network: bitcoin.networks.bitcoin,
    });

    return addrInfo;
}


const signInvoice = async (ordinalsPublicKey: string) => {
    const hexPsbt = PSBT_HEX;
    const psbt = bitcoin.Psbt.fromHex(hexPsbt);
    console.log("base64", psbt.toBase64());
    const addressInfo = getAddressInfo(ordinalsPublicKey);
    console.log("addressInfo", addressInfo);

    // Sign the PSBT using Nostr
    const signed = await window.nostr?.signSchnorr(hexPsbt);
    if (!signed) {
        throw new Error('Failed to sign PSBT');
    }
    console.log("signed", signed);

    // Convert the signature to Uint8Array
    const signatureBuffer = Buffer.from(signed, 'hex');
    const signatureUint8Array = new Uint8Array(signatureBuffer);

    // Convert the public key to Uint8Array
    const pubkeyBuffer = Buffer.from(ordinalsPublicKey, 'hex');
    const pubkeyUint8Array = new Uint8Array(pubkeyBuffer);

    console.log({ signatureUint8Array, pubkeyUint8Array })

    psbt.updateInput(0, {
        finalScriptSig: signatureUint8Array,
    });

    // Finalize the input
    psbt.finalizeAllInputs();

    // Get the updated PSBT
    const updatedPsbtHex = psbt.toHex();
    console.log("Updated PSBT Hex:", updatedPsbtHex);
};


export const connectWallet = async (provider = '') => {
    const walletName = provider?.split('.')[0] || 'alby';
    const ordinalsPublicKey = await getNostrPubKey();
    // const serverAuthResponse = await auth(ordinalsPublicKey);
    // console.log("serverAuthResponse", serverAuthResponse);
    await signInvoice(ordinalsPublicKey);
    return {
        walletName,
        ordinalsPublicKey,
        paymentPublicKey: '',
        ordinalsAddress: '',
        paymentAddress: '',
        token: '',
    };
};
