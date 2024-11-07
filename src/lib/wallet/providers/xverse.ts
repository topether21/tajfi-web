import { RpcErrorCode } from "sats-connect";
import { AddressPurpose } from "sats-connect";
import type { AddressInfo, Transaction, WalletStrategy } from "./shared";
import { request } from "sats-connect";
import { p2tr } from "@scure/btc-signer"
import { NETWORK } from "./bitcoin";
import { hex } from '@scure/base';

// ref: https://docs.xverse.app/sats-connect/bitcoin-methods/signmessage
export class XverseWallet implements WalletStrategy {
    async getKeys() {
        let tapasPublicKey = '';
        let tapasAddress = '';
        try {
            const response = await request("getAddresses", {
                purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
                message: 'Address for receiving Ordinals',
            });
            console.log("getAccounts ~ response:", response);
            if (response.status === "success") {
                const tapasAddressItem = response.result.addresses.find(
                    (address) => address.purpose === AddressPurpose.Ordinals,
                );
                tapasPublicKey = tapasAddressItem?.publicKey ?? '';
                tapasAddress = tapasAddressItem?.address ?? '';
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
        if (!tapasPublicKey) {
            throw new Error('No public key found')
        }
        return {
            tapasPublicKey,
            tapasAddress,
        }
    }
    async signSimpleMessage(message: string, { address }: { address: string }) {
        let signature = ''
        try {
            if (!address) {
                throw new Error('Address is required')
            }
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
    async signTx(transaction: Transaction): Promise<string> {
        throw new Error('Not implemented')
    }
    async getP2trAddress(pubkey: string): Promise<AddressInfo> {
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
}
