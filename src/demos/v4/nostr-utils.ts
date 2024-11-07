// taproot_assets/src/demos/v4/nostrUtils.ts

import * as secp from '@noble/secp256k1'
import { sha256 } from '@noble/hashes/sha256'
import { schnorr } from '@noble/curves/secp256k1'
import { bech32 } from 'bech32'
import {
    storeEncryptedPrivateKey,
    retrieveEncryptedPrivateKey,
} from './db'
import { encryptWithPasskey, decryptWithPasskey } from './encryption'
import { getBitcoinAddress } from '@/lib/wallet/providers/bitcoin'

export interface Wallet {
    id: string
    walletName: string
    publicKey: string
    npub1Key: string
    p2trAddress: string
}

export const generateChallenge = (): Uint8Array => {
    return crypto.getRandomValues(new Uint8Array(32))
}

export const derivePublicKeyFromPrivate = (privateKeyHex: string): string => {
    const privKeyBuffer = Buffer.from(privateKeyHex, 'hex')
    const pubKey = secp.getPublicKey(privKeyBuffer, true)
    return Buffer.from(pubKey).toString('hex').substring(2)
}

export const encodeNpub = (publicKeyHex: string): string => {
    const pubWords = bech32.toWords(Buffer.from(publicKeyHex, 'hex'))
    return bech32.encode('npub', pubWords)
}

export const generateKeys = async (walletName: string) => {
    const privKey = secp.utils.randomPrivateKey()
    const pubKey = secp.getPublicKey(privKey, true)

    const compactPrivateKey = Buffer.from(privKey).toString('hex')
    const compactPublicKey = Buffer.from(pubKey).toString('hex').substring(2)

    const credential = await navigator.credentials.create({
        publicKey: {
            challenge: generateChallenge(),
            rp: { name: "Tajfi", id: window.location.host },
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

    if (credential) {
        const encryptedPrivateKey = await encryptWithPasskey(compactPrivateKey, credential)
        const keyId = uint8ArrayToBase64(new Uint8Array(credential.rawId))
        await storeEncryptedPrivateKey(keyId, encryptedPrivateKey, walletName)
        const p2trAddress = (await getBitcoinAddress(compactPublicKey)).address || ''

        const npub1 = encodeNpub(compactPublicKey)
        return {
            id: keyId,
            walletName,
            publicKey: compactPublicKey,
            npub1Key: npub1,
            p2trAddress
        }
    }
    throw new Error("Failed to create passkey.")
}

export const retrievePrivateKey = async (walletId: string): Promise<string> => {
    const wallet = await retrieveEncryptedPrivateKey(walletId)
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

    return await decryptWithPasskey(wallet.encryptedKey, credential)
}

export const signMessage = async (message: string, privateKey: string, publicKey: string) => {
    if (!message) {
        throw new Error('Please enter a message')
    }

    const hash = sha256(new TextEncoder().encode(message))
    const sig = Buffer.from(await schnorr.sign(hash, privateKey)).toString('hex')

    const isValid = schnorr.verify(sig, hash, Buffer.from(publicKey, 'hex'))
    return { signature: sig, isValid }
}

export const base64ToUint8Array = (base64: string): Uint8Array => {
    const binaryString = atob(base64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes
}

export const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
}