'use client';
import * as bitcoin from 'bitcoinjs-lib';
import ecc from '@bitcoinerlab/secp256k1';
import * as tools from 'uint8array-tools';
import { PSBT_HEX, SIGNED_PSBT } from './data';

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

// https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/src/cjs/psbt/bip371.cjs#L105
function serializeTaprootSignature(sig: Uint8Array, sighashType?: number) {
    const sighashTypeByte = sighashType
        ? Uint8Array.from([sighashType])
        : Uint8Array.from([]);
    return tools.concat([sig, sighashTypeByte]);
}

const signInvoiceV2 = async (ordinalsPublicKey: string) => {
    const hexPsbt = PSBT_HEX;
    const psbt = bitcoin.Psbt.fromHex(hexPsbt);
    console.log("original base64", psbt.toBase64());
    const psbtSigned = bitcoin.Psbt.fromHex(SIGNED_PSBT);
    console.log("signed base64", psbtSigned.toBase64());
    const addressInfo = getAddressInfo(ordinalsPublicKey);
    console.log("addressInfo", addressInfo);

    for (const input of psbt.data.inputs) {
        console.log("input", input);
        // debugger;
    };

    // Uncaught (in promise) Error: Invalid arguments for Psbt.updateInput. Cannot use both taproot and non-taproot fields.
    // @jad
    psbt.updateInput(0, {
        tapInternalKey: Buffer.from(ordinalsPublicKey, 'hex'), // Use the internal key for Taproot
        witnessUtxo: {
            script: addressInfo.output,
            value: 56n,
        },
    });

    const sigHash = psbt.__CACHE.__TX.hashForWitnessV1(
        0,
        [addressInfo.output],
        [56n],
        bitcoin.Transaction.SIGHASH_DEFAULT
    );
    console.log("sigHash", sigHash);
    const sigHashHex = Buffer.from(sigHash).toString('hex');
    console.log("sigHashHex", sigHashHex);
    const signed = await window.nostr?.signSchnorr(sigHashHex);
    console.log("signed", signed);
    psbt.updateInput(0, {
        tapKeySig: Buffer.from(signed, 'hex'),
    });
    psbt.finalizeAllInputs();
    const updatedPsbtHex = psbt.toHex();
    console.log("Updated PSBT Hex:", updatedPsbtHex);
};


const signInvoiceV1 = async (ordinalsPublicKey: string) => {
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
        finalScriptSig: Buffer.from(signatureUint8Array),
    });

    // Finalize the input
    psbt.finalizeAllInputs();

    // Get the updated PSBT
    const updatedPsbtHex = psbt.toHex();
    console.log("Updated PSBT Hex:", updatedPsbtHex);
};

const signInvoiceV3 = async (ordinalsPublicKey) => {
    const hexPsbt = PSBT_HEX;
    const psbt = bitcoin.Psbt.fromHex(hexPsbt); // Load the PSBT from hex
    console.log("Original PSBT (Base64):", psbt.toBase64());

    const addressInfo = getAddressInfo(ordinalsPublicKey); // Ensure correct address info
    console.log("Address Info:", addressInfo);

    // Validate the output script in the address information
    if (!addressInfo.output) {
        throw new Error('Invalid address information: output script is undefined.');
    }

    //console.log("Output Script:", addressInfo.output.toString('hex'));

    //console.log("PSBT Inputs:", psbt.data.inputs);
    //console.log("PSBT", psbt);

    //console.log("Updated PSBT (Base64):", psbt.toBase64());
    // Manually specify the output script and value
    const outputScriptHex = '5120b13d978b232b64d366daa79ea56acfd29aa18b3ecbfd9ee0d1dd897f40ae5d62';
    const outputScriptBuffer = Buffer.from(outputScriptHex, 'hex');
    const utxoValue = BigInt(56); // Value in satoshis

    const inputIndex = 0; // The input index you are working with

    // Define non-Taproot fields to remove
    const nonTaprootFields = [
        'nonWitnessUtxo',
        'redeemScript',
        'witnessScript',
        'bip32Derivation',
    ];

    // Safely remove non-Taproot fields
    nonTaprootFields.forEach((field) => {
        if (psbt.data.inputs[inputIndex][field]) {
            delete psbt.data.inputs[inputIndex][field];
        }
    });

    // Update the input with witnessUtxo
    console.log("Updated Input with Witness UTXO:", psbt.data.inputs[0]);
    console.log("Full psbt", psbt);

    // Calculate the SigHash for key path spend (BIP-0086)
    const sigHash = psbt.__CACHE.__TX.hashForWitnessV1(
        0, // Input index
        [outputScriptBuffer], // Output script
        [BigInt(56)], // Value of the UTXO in satoshis
        bitcoin.Transaction.SIGHASH_DEFAULT // Default SigHash
    );

    console.log("SigHash (Hex):", Buffer.from(sigHash).toString('hex'));

    // Use Nostr to sign the SigHash with Schnorr
    const sigHashHex = Buffer.from(sigHash).toString('hex');
    const signed = await window.nostr?.signSchnorr(sigHashHex);
    if (!signed) {
        throw new Error('Failed to sign PSBT');
    }
    console.log("Signed:", signed);

    // Add the Schnorr signature as a tapKeySig
    psbt.updateInput(0, {
        tapKeySig: Buffer.from(signed, 'hex'), // Taproot key signature
    });

    psbt.updateInput(0, {
        witnessUtxo: {
            script: outputScriptBuffer,
            value: utxoValue,
        },
    });

    console.log("Updated PSBT (Base64):", psbt.toBase64());
    console.log("Final PSBT:", psbt);

    // Finalize the PSBT input
    psbt.finalizeAllInputs();

    // Get the final PSBT in hex
    const updatedPsbtHex = psbt.toHex();
    console.log("Updated PSBT Hex:", updatedPsbtHex);

    return updatedPsbtHex; // Return the final PSBT for further processing
};




export const connectWallet = async (provider = '') => {
    const walletName = provider?.split('.')[0] || 'alby';
    const ordinalsPublicKey = await getNostrPubKey();
    // const serverAuthResponse = await auth(ordinalsPublicKey);
    // console.log("serverAuthResponse", serverAuthResponse);
    await signInvoiceV3(ordinalsPublicKey);
    return {
        walletName,
        ordinalsPublicKey,
        paymentPublicKey: '',
        ordinalsAddress: '',
        paymentAddress: '',
        token: '',
    };
};
