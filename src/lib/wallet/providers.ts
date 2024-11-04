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



import {
    request,
    RpcErrorCode,
    AddressPurpose,
} from "sats-connect";





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
    
}
