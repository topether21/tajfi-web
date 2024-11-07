import type { AddressInfo, Transaction, WalletStrategy } from "../shared";
import { getCurrentWalletId, retrieveEncryptedPrivateKey, setCurrentWalletId, storeEncryptedPrivateKey } from "./db";
import { decryptWithPasskey, encryptWithPasskey } from "./encryption";
import { base64ToUint8Array, derivePublicKeyFromPrivate, encodeNpub, uint8ArrayToBase64 } from "./web-authn-utils";
import { generateChallenge } from "./web-authn-utils";
import { getP2trAddress } from "../bitcoin";
import * as secp from '@noble/secp256k1'
import { APP_NAME } from "@/lib/constants";
import { sha256 } from '@noble/hashes/sha256'
import { schnorr } from '@noble/curves/secp256k1'

interface Wallet {
    id: string
    walletName: string
    publicKey: string
    npub1Key: string
    p2trAddress: string
}

export interface WebAuthnProvider {
    createKeys({ walletName }: { walletName: string }): Promise<{ tapasPublicKey: string, tapasAddress: string }>
}

export class WebAuthnWallet implements WalletStrategy, WebAuthnProvider {
    currentWallet: Wallet | null = null

    private async retrievePrivateKey(): Promise<string> {
        const currentWalletId = getCurrentWalletId()
        if (!currentWalletId) {
            throw new Error("No wallet selected.")
        }
        const wallet = await retrieveEncryptedPrivateKey(currentWalletId)
        if (!wallet || !wallet.encryptedKey) {
            throw new Error("Encrypted private key not found.")
        }

        const credential = await navigator.credentials.get({
            publicKey: {
                challenge: generateChallenge(),
                allowCredentials: [{ id: base64ToUint8Array(wallet.id), type: "public-key" }],
            }
        }) as PublicKeyCredential;

        if (!credential) {
            throw new Error("Failed to retrieve credentials.")
        }

        const decryptedPrivateKey = await decryptWithPasskey(wallet.encryptedKey, credential)
        return decryptedPrivateKey
    }

    async createKeys({ walletName }: { walletName: string }): Promise<{ tapasPublicKey: string, tapasAddress: string }> {
        const privKey = secp.utils.randomPrivateKey()
        const pubKey = secp.getPublicKey(privKey, true)
        const compactPrivateKey = Buffer.from(privKey).toString('hex')
        const compactPublicKey = Buffer.from(pubKey).toString('hex').substring(2)

        try {
            const credential = await navigator.credentials.create({
                publicKey: {
                    challenge: generateChallenge(),
                    rp: { name: APP_NAME },
                    user: {
                        id: crypto.getRandomValues(new Uint8Array(16)),
                        name: walletName,
                        displayName: walletName,
                    },
                    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                    authenticatorSelection: { authenticatorAttachment: "platform" },
                    attestation: "direct",
                }
            }) as PublicKeyCredential;

            if (!credential) throw new Error('web-authn: Failed to create credentials')

            const encryptedPrivateKey = await encryptWithPasskey(compactPrivateKey, credential)
            const keyId = uint8ArrayToBase64(new Uint8Array(credential.rawId))
            await storeEncryptedPrivateKey(keyId, encryptedPrivateKey, walletName)
            setCurrentWalletId(keyId)
            const p2trAddress = (await getP2trAddress(compactPublicKey)).address || ''
            const npub1 = encodeNpub(compactPublicKey)
            this.currentWallet = {
                id: keyId,
                walletName,
                publicKey: compactPublicKey,
                npub1Key: npub1,
                p2trAddress
            }
            setCurrentWalletId(keyId)

            return {
                tapasPublicKey: compactPublicKey,
                tapasAddress: p2trAddress
            }
        } catch (error) {
            console.error('web-authn: Failed to create keys', error)
            throw error
        }
    }
    async getKeys(): Promise<{ tapasPublicKey: string, tapasAddress: string }> {
        const storedCurrentId = getCurrentWalletId()
        if (!storedCurrentId) {
            throw new Error('web-authn: No wallet selected')
        }
        const wallet = await retrieveEncryptedPrivateKey(storedCurrentId)
        if (!wallet) {
            throw new Error('web-authn: Wallet not found')
        }
        const credential = await navigator.credentials.get({
            publicKey: {
                challenge: generateChallenge(),
                allowCredentials: [{ id: base64ToUint8Array(wallet.id), type: "public-key" }],
            }
        }) as PublicKeyCredential;
        if (!credential) {
            throw new Error('web-authn: Failed to retrieve credentials')
        }
        const decryptedPrivateKey = await decryptWithPasskey(wallet.encryptedKey, credential)
        const compactPublicKey = derivePublicKeyFromPrivate(decryptedPrivateKey)
        const p2trAddress = (await getP2trAddress(compactPublicKey)).address || ''
        const npub1 = encodeNpub(compactPublicKey)
        this.currentWallet = {
            id: wallet.id,
            walletName: wallet.walletName,
            publicKey: compactPublicKey,
            npub1Key: npub1,
            p2trAddress
        }
        return {
            tapasPublicKey: compactPublicKey,
            tapasAddress: p2trAddress
        }
    }
    async signSimpleMessage(message: string): Promise<string> {
        const privKey = await this.retrievePrivateKey()
        const hash = sha256(new TextEncoder().encode(message))
        const sig = Buffer.from(await schnorr.sign(hash, privKey)).toString('hex')
        return sig
    }
    async signTx(transaction: Transaction): Promise<string> {
        throw new Error('Not implemented')
    }
    async getP2trAddress(pubkey: string): Promise<AddressInfo> {
        throw new Error('Not implemented')
    }
}