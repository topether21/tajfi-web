'use client';
import * as bitcoin from 'bitcoinjs-lib';
import ecc from '@bitcoinerlab/secp256k1';
import * as tools from 'uint8array-tools';
import { PSBT_HEX, SIGNED_PSBT } from './data';
import { auth } from './api';

bitcoin.initEccLib(ecc);

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
