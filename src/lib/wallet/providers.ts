import type { WalletProvider } from "./types"
import * as bitcoin from "bitcoinjs-lib"
import { p2tr } from "@scure/btc-signer"
import { hex } from '@scure/base';
import { hexToBytes, utf8ToBytes } from "@stacks/common";
import { sha256 } from "@noble/hashes/sha256";
import * as tools from 'uint8array-tools';
import { encode } from "varuint-bitcoin";
import { base64 } from "@scure/base";

import ecc from '@bitcoinerlab/secp256k1';

bitcoin.initEccLib(ecc);

const bip322MessageTag = "BIP0322-signed-message";

/**
 * Serializes a taproot signature.
 * @param sig The signature to serialize.
 * @param sighashType The sighash type. Optional.
 * @returns The serialized taproot signature.
 * ref: https://github.com/search?q=repo%3Abitcoinjs%2Fbitcoinjs-lib%20serializeTaprootSignature&type=code
 */
export const serializeTaprootSignature = (sig: Uint8Array, sighashType?: number): Uint8Array => {
    const sighashTypeByte = sighashType
        ? Uint8Array.from([sighashType])
        : Uint8Array.from([]);
    return tools.concat([sig, sighashTypeByte]);
}

// See tagged hashes section of BIP-340
// https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki#design
const messageTagHash = Uint8Array.from([
    ...sha256(utf8ToBytes(bip322MessageTag)),
    ...sha256(utf8ToBytes(bip322MessageTag)),
]);

function hashBip322Message(message: string) {
    return sha256(
        Uint8Array.from([
            ...messageTagHash,
            ...(typeof message === "string"
                ? utf8ToBytes(message)
                : message),
        ]),
    );
}

import {
    request,
    RpcErrorCode,
    AddressPurpose,
} from "sats-connect";

const NETWORK = bitcoin.networks.bitcoin

const toXOnly = <T extends Buffer | string>(key: T) => {
    if (Buffer.isBuffer(key)) {
        return key.length === 33 ? key.subarray(1, 33) : key;
    }
    if (typeof key === 'string') {
        return (key.length === 33 ? key.slice(1, 33) : key)
    }
    throw new Error('Key must be a Buffer or a string');
};

const getAddressInfo = async (pubkey: string, provider: WalletProvider) => {

    const pubkeyBuffer = Buffer.from(pubkey, 'hex');

    console.log(`Pubkey: ${pubkey.toString()}`);

    switch (provider) {
        case 'unisat': {
            const addrInfo = bitcoin.payments.p2tr({
                internalPubkey: toXOnly(pubkeyBuffer),
                network: NETWORK,
            });
            return addrInfo;
        }
        case 'xverse': {
            const p2trAddress = p2tr(pubkey, undefined, NETWORK);
            const result = {
                ...p2trAddress,
                tapInternalKey: Buffer.from(p2trAddress.tapInternalKey),
                output: hex.encode(p2trAddress.script),
                script: Buffer.from(p2trAddress.script),
                pubkey: Buffer.from(pubkey, 'hex'),
            };
            return result;
        }
        default: {
            const addrInfo = bitcoin.payments.p2tr({
                pubkey: pubkeyBuffer,
                network: NETWORK,
            });
            return addrInfo;
        }


    }
}

export const signBip322MessageSimple = async (message: string, { provider, publicKey }: { provider: WalletProvider, publicKey: string }) => {
    if (provider === "unisat") {
        if (window.unisat) {
            return window.unisat.signMessage(message, "bip322-simple");
        }
        throw new Error('Unisat is not available')
    }

    const nostrScript = await getAddressInfo(toXOnly(publicKey), provider);
    const { output: scriptPubkey, pubkey } = nostrScript;

    // Generate a tagged hash of message to sign
    const prevoutHash = hexToBytes(
        "0000000000000000000000000000000000000000000000000000000000000000",
    );
    const prevoutIndex = 0xffffffff;
    const sequence = 0;
    const hash = hashBip322Message(message);

    // Create the virtual to_spend transaction
    const commands = [0, Buffer.from(hash)];
    const scriptSig = bitcoin.script.compile(commands);
    const virtualToSpend = new bitcoin.Transaction();
    virtualToSpend.version = 0;
    virtualToSpend.locktime = 0;
    virtualToSpend.addInput(
        Buffer.from(prevoutHash),
        prevoutIndex,
        sequence,
        scriptSig,
    );
    virtualToSpend.addOutput(Buffer.from(scriptPubkey), BigInt(0));

    // Create the virtual to_sign transaction
    const virtualToSign = new bitcoin.Psbt();
    virtualToSign.setLocktime(0);
    virtualToSign.setVersion(0);
    const prevTxHash = virtualToSpend.getHash(); // or id?
    const prevOutIndex = 0;
    const toSignScriptSig = bitcoin.script.compile([106]);

    virtualToSign.addInput({
        hash: prevTxHash,
        index: prevOutIndex,
        sequence: 0,
        witnessUtxo: { script: Buffer.from(scriptPubkey, "hex"), value: BigInt(0) },
        tapInternalKey: toXOnly(pubkey),
    });
    virtualToSign.addOutput({ script: toSignScriptSig, value: BigInt(0) });

    const sigHash = virtualToSign.__CACHE.__TX.hashForWitnessV1(
        0,
        [virtualToSign.data.inputs[0].witnessUtxo.script],
        [virtualToSign.data.inputs[0].witnessUtxo.value],
        bitcoin.Transaction.SIGHASH_DEFAULT,
    );

    const sigHashHex = Buffer.from(sigHash).toString('hex');

    debugger
    const sign = await signMessageAlby(sigHashHex);
    debugger

    virtualToSign.updateInput(0, {
        tapKeySig: serializeTaprootSignature(Buffer.from(sign, "hex")),
    });
    virtualToSign.finalizeAllInputs();

    const toSignTx = virtualToSign.extractTransaction();

    function encodeVarString(b) {
        return Buffer.concat([encode(b.byteLength), b]);
    }

    const len = encode(toSignTx.ins[0].witness.length);
    const result = Buffer.concat([
        len,
        ...toSignTx.ins[0].witness.map((w) => encodeVarString(w)),
    ]);

    const signature = base64.encode(result)
    return signature;
}

const signMessageXverse = async (address: string, message: string) => {
    let signature = ''
    try {
        const response = await request("signMessage", {
            address,
            message,
        });
        if (response.status === "success") {
            signature = response.result.signature
        }
    } catch (err) {
        throw new Error((err as Error).message);
    }
    if (!signature) {
        throw new Error('Failed to sign message')
    }
    return signature
}

const signMessageAlby = async (message: string) => {
    if (window.nostr) {
        const signed = await window.nostr.signSchnorr(message)
        return signed
    }
    throw new Error('Signing with Nostr is not available')
}

export const signMessage = async (message: string, { address, provider }: { address?: string, provider: WalletProvider }) => {
    switch (provider) {
        case 'alby': {
            const signed = await signMessageAlby(message)
            return signed
        }
        case 'xverse': {
            if (!address) {
                throw new Error('Address is required')
            }
            const signed = await signMessageXverse(address, message)
            return signed
        }
        default:
            throw new Error(`Unsupported provider: ${provider}`)
    }
}

const getNostrKeys = async () => {
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

const getXverseKeys = async () => {
    let ordinalsPublicKey = '';
    let ordinalsAddress = '';
    try {
        const response = await request("getAddresses", {
            purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
            message: 'Address for receiving Ordinals',
        });
        console.log("getAccounts ~ response:", response);
        if (response.status === "success") {
            const ordinalsAddressItem = response.result.addresses.find(
                (address) => address.purpose === AddressPurpose.Ordinals,
            );
            ordinalsPublicKey = ordinalsAddressItem?.publicKey ?? '';
            ordinalsAddress = ordinalsAddressItem?.address ?? '';
        } else {
            if (response.error.code === RpcErrorCode.USER_REJECTION) {
                // TODO: handle user cancellation error
            } else {
                // TODO: handle error
            }
        }
    } catch (err) {
        throw new Error((err as Error).message);
    }
    if (!ordinalsPublicKey) {
        throw new Error('No public key found')
    }
    return {
        ordinalsPublicKey,
        ordinalsAddress,
    }
}



export const getWalletKeys = async (provider: WalletProvider) => {
    switch (provider) {
        case 'alby':
            return getNostrKeys()
        case 'xverse':
            return getXverseKeys()
        default:
            throw new Error(`Unsupported provider: ${provider}`)
    }
}