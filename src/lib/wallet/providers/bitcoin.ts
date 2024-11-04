import * as bitcoin from "bitcoinjs-lib"
import ecc from '@bitcoinerlab/secp256k1';
import { utf8ToBytes } from "@stacks/common";
import { sha256 } from "@noble/hashes/sha256";
import * as tools from 'uint8array-tools';
import { BIP32Factory } from 'bip32';

const bip32 = BIP32Factory(ecc);
const bip322MessageTag = "BIP0322-signed-message";

bitcoin.initEccLib(ecc);
const NETWORK = bitcoin.networks.bitcoin;
export { bitcoin, bip32, NETWORK };

export const toXOnly = (pubKey: Uint8Array) =>
    pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);

export const toXOnlyStr = (pubKey: string) =>
    pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);

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

export const hashBip322Message = (message: string) =>
    sha256(
        Uint8Array.from([
            ...messageTagHash,
            ...(typeof message === "string"
                ? utf8ToBytes(message)
                : message),
        ]),
    );
