import { RpcErrorCode } from "sats-connect";
import { AddressPurpose } from "sats-connect";
import type { Transaction, WalletStrategy } from "./shared";
import { request } from "sats-connect";

export class XverseWallet implements WalletStrategy {
    async getKeys() {
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
}