'use client'

import { useState, useEffect } from 'react'
import * as secp from '@noble/secp256k1'
import { sha256 } from '@noble/hashes/sha256'
import { schnorr } from '@noble/curves/secp256k1'
import { bech32 } from 'bech32'
import {
    storeEncryptedPrivateKey,
    retrieveEncryptedPrivateKey,
    getAllStoredWallets,
    removeEncryptedPrivateKey,
    clearAllWallets,
    type StoredWallet
} from './db'
import { encryptWithPasskey, decryptWithPasskey } from './encryption'
import { getBitcoinAddress } from '@/lib/wallet/providers/bitcoin'

export const nostrRelay = "wss://relay.damus.io"

export interface Wallet {
    id: string
    walletName: string
    publicKey: string
    npub1Key: string
    p2trAddress: string
}

export const useNostr = () => {
    const [wallets, setWallets] = useState<StoredWallet[]>([])
    const [currentWalletId, setCurrentWalletId] = useState<string | null>(null)
    const [currentWallet, setCurrentWallet] = useState<Wallet | null>(null)
    const [message, setMessage] = useState('')
    const [signature, setSignature] = useState('')
    const [status, setStatus] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [isSigning, setIsSigning] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [nsec, setNsec] = useState('')
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        const initialize = async () => {
            const storedWallets = await getAllStoredWallets()
            setWallets(storedWallets)
            const storedCurrentId = localStorage.getItem("nostr_current_wallet_id")
            if (storedCurrentId) {
                setCurrentWalletId(storedCurrentId)
                const wallet = await retrieveEncryptedPrivateKey(storedCurrentId)
                if (wallet) {
                    const credential = await navigator.credentials.get({
                        publicKey: {
                            challenge: generateChallenge(),
                            allowCredentials: [{ id: base64ToUint8Array(wallet.id), type: "public-key" }],
                        }
                    }) as PublicKeyCredential;

                    if (credential) {
                        const decryptedPrivateKey = await decryptWithPasskey(wallet.encryptedKey, credential)
                        const compactPublicKey = derivePublicKeyFromPrivate(decryptedPrivateKey)
                        const npub1 = encodeNpub(compactPublicKey)
                        const p2trAddress = (await getBitcoinAddress(compactPublicKey)).address || ''
                        setCurrentWallet({
                            id: wallet.id,
                            walletName: wallet.walletName || '',
                            publicKey: compactPublicKey,
                            npub1Key: npub1,
                            p2trAddress
                        })
                        setStatus(`Wallet "${wallet.walletName}" loaded successfully.`)
                    } else {
                        setStatus("Failed to retrieve credentials. Please log in again.")
                        logout()
                    }
                }
            }
            setIsInitialized(true)
        }
        initialize()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const generateChallenge = (): Uint8Array => {
        return crypto.getRandomValues(new Uint8Array(32))
    }

    const derivePublicKeyFromPrivate = (privateKeyHex: string): string => {
        const privKeyBuffer = Buffer.from(privateKeyHex, 'hex')
        const pubKey = secp.getPublicKey(privKeyBuffer, true)
        return Buffer.from(pubKey).toString('hex').substring(2)
    }

    const encodeNpub = (publicKeyHex: string): string => {
        const pubWords = bech32.toWords(Buffer.from(publicKeyHex, 'hex'))
        return bech32.encode('npub', pubWords)
    }

    const generateKeys = async (walletName: string) => {
        setIsGenerating(true)
        const privKey = secp.utils.randomPrivateKey()
        const pubKey = secp.getPublicKey(privKey, true)

        const compactPrivateKey = Buffer.from(privKey).toString('hex')
        const compactPublicKey = Buffer.from(pubKey).toString('hex').substring(2)

        try {
            const credential = await navigator.credentials.create({
                publicKey: {
                    challenge: generateChallenge(),
                    rp: { name: "Tajfi" },
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
                setWallets(await getAllStoredWallets())
                setCurrentWalletId(keyId)
                localStorage.setItem("nostr_current_wallet_id", keyId)
                const p2trAddress = (await getBitcoinAddress(compactPublicKey)).address || ''

                const npub1 = encodeNpub(compactPublicKey)
                const newWallet: Wallet = {
                    id: keyId,
                    walletName,
                    publicKey: compactPublicKey,
                    npub1Key: npub1,
                    p2trAddress
                }
                setCurrentWallet(newWallet)
                setStatus(`Wallet "${walletName}" generated and selected.`)
            }
        } catch (error) {
            setStatus("Failed to create passkey.")
            console.error("Passkey creation error:", error)
        } finally {
            setIsGenerating(false)
        }
    }

    const retrievePrivateKey = async (): Promise<string> => {
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

    const signMessage = async () => {
        if (!message) {
            setStatus('Please enter a message')
            return
        }
        if (!currentWallet) {
            setStatus('No wallet selected.')
            return
        }

        setIsSigning(true)
        setStatus('Signing message...')

        try {
            const privKey = await retrievePrivateKey()
            const hash = sha256(new TextEncoder().encode(message))
            const sig = Buffer.from(await schnorr.sign(hash, privKey)).toString('hex')
            setSignature(sig)

            const isValid = schnorr.verify(sig, hash, Buffer.from(currentWallet.publicKey, 'hex'))
            setStatus(`Signature valid: ${isValid}`)
        } catch (error) {
            setStatus('Failed to sign message.')
            console.error("Signing error:", error)
        } finally {
            setIsSigning(false)
        }
    }

    const getSignedEvent = async (event: { pubkey: string, created_at: number, kind: number, tags: string[], content: string }) => {
        if (!currentWallet) {
            throw new Error("No wallet selected.")
        }
        const privKey = await retrievePrivateKey()
        const eventData = JSON.stringify([0, event.pubkey, event.created_at, event.kind, event.tags, event.content])
        const id = Buffer.from(sha256(new TextEncoder().encode(eventData))).toString('hex')
        const sig = Buffer.from(await schnorr.sign(id, privKey)).toString('hex')
        return { ...event, id, sig }
    }

    const sendMessage = async () => {
        if (!message) {
            setStatus('Please enter a message')
            return
        }
        if (!currentWallet) {
            setStatus('No wallet selected.')
            return
        }

        setIsSending(true)
        setStatus('Sending message...')

        try {
            const ws = new WebSocket(nostrRelay)

            ws.onopen = async () => {
                console.log(`Connected to ${nostrRelay}`)
                try {
                    const signedEvent = await getSignedEvent({
                        pubkey: currentWallet.publicKey,
                        created_at: Math.floor(Date.now() / 1000),
                        kind: 1,
                        tags: [],
                        content: message,
                    })

                    ws.send(JSON.stringify(["EVENT", signedEvent]))
                    setStatus(`Message sent to ${nostrRelay}`)
                } catch (error) {
                    setStatus('Failed to sign or send message.')
                    console.error("Send message error:", error)
                }
            }

            ws.onmessage = (event) => {
                console.log("Message received:", event.data)
                setStatus(`Received response from ${nostrRelay}: ${event.data}`)
            }

            ws.onerror = (error) => {
                console.error("WebSocket error:", error)
                setStatus(`Error connecting to ${nostrRelay}`)
            }

            ws.onclose = () => {
                console.log("WebSocket connection closed")
            }
        } catch (error) {
            console.error(`Failed to connect to relay ${nostrRelay}:`, error)
            setStatus(`Failed to connect to ${nostrRelay}`)
        } finally {
            setIsSending(false)
        }
    }

    const getPrivateKey = async () => {
        if (!currentWalletId) {
            setStatus("No wallet selected.")
            return
        }
        try {
            const privKey = await retrievePrivateKey()
            setNsec(privKey)
            setStatus("Private key retrieved successfully.")
        } catch (error) {
            console.error("Error retrieving private key:", error)
            setStatus("Failed to retrieve private key.")
        }
    }

    // Switch to a different wallet
    const switchWallet = async (id: string) => {
        const wallet = await retrieveEncryptedPrivateKey(id)
        if (wallet) {
            const credential = await navigator.credentials.get({
                publicKey: {
                    challenge: generateChallenge(),
                    allowCredentials: [{ id: base64ToUint8Array(wallet.id), type: "public-key" }],
                }
            }) as PublicKeyCredential;

            if (credential) {
                const decryptedPrivateKey = await decryptWithPasskey(wallet.encryptedKey, credential)
                const compactPublicKey = derivePublicKeyFromPrivate(decryptedPrivateKey)
                const npub1 = encodeNpub(compactPublicKey)
                setCurrentWallet({
                    id: wallet.id,
                    walletName: wallet.walletName || '',
                    publicKey: compactPublicKey,
                    npub1Key: npub1,
                    p2trAddress: (await getBitcoinAddress(compactPublicKey)).address || ''
                })
                setCurrentWalletId(id)
                localStorage.setItem("nostr_current_wallet_id", id)
                setStatus(`Switched to "${wallet.walletName}"`)
            } else {
                setStatus("Failed to retrieve credentials. Please log in again.")
                logout()
            }
        }
    }

    // Remove a wallet
    const removeWallet = async (id: string) => {
        await removeEncryptedPrivateKey(id)
        setWallets(await getAllStoredWallets())
        if (currentWalletId === id) {
            setCurrentWalletId(null)
            setCurrentWallet(null)
            localStorage.removeItem("nostr_current_wallet_id")
            setStatus("Current wallet removed. Please select another wallet or create a new one.")
        } else {
            setStatus("Wallet removed.")
        }
    }

    // Logout current wallet
    const logout = () => {
        setCurrentWalletId(null)
        setCurrentWallet(null)
        localStorage.removeItem("nostr_current_wallet_id")
        setStatus("Logged out successfully.")
    }

    // Clear all wallets
    const clearWallets = async () => {
        await clearAllWallets()
        setWallets([])
        setCurrentWalletId(null)
        setCurrentWallet(null)
        setStatus("All wallets have been cleared.")
    }

    const base64ToUint8Array = (base64: string): Uint8Array => {
        const binaryString = atob(base64)
        const len = binaryString.length
        const bytes = new Uint8Array(len)
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i)
        }
        return bytes
    }

    const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
        let binary = ''
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        return btoa(binary)
    }

    return {
        wallets,
        currentWallet,
        message,
        setMessage,
        signature,
        status,
        generateKeys,
        signMessage,
        sendMessage,
        isGenerating,
        isSigning,
        isSending,
        getPrivateKey,
        nsec,
        isInitialized,
        switchWallet,
        removeWallet,
        logout,
        clearWallets
    }
}