'use client'

import { useState, useEffect } from 'react'
import * as secp from '@noble/secp256k1'
import { sha256 } from '@noble/hashes/sha256'
import { schnorr } from '@noble/curves/secp256k1'
import { bech32 } from 'bech32'
import { storeEncryptedPrivateKey, retrieveEncryptedPrivateKey } from './db'
import { encryptWithPasskey, decryptWithPasskey } from './encryption'

export const nostrRelay = "wss://relay.damus.io"

export const useNostr = () => {
    const [publicKey, setPublicKey] = useState('')
    const [npub1Key, setNpub1Key] = useState('')
    const [message, setMessage] = useState('')
    const [signature, setSignature] = useState('')
    const [status, setStatus] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [isSigning, setIsSigning] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [nsec, setNsec] = useState('') // New state for testing
    const [nickname, setNickname] = useState('') // New state for nickname
    const [isInitialized, setIsInitialized] = useState(false) // New state for initialization

    useEffect(() => {
        const initialize = async () => {
            const keyId = localStorage.getItem("nostr_key_id")
            if (keyId) {
                try {
                    const storedData = await retrieveEncryptedPrivateKey(keyId)
                    if (!storedData || !storedData.encryptedKey) {
                        setStatus("Encrypted private key not found. Please generate new keys.")
                        setIsInitialized(true)
                        return
                    }

                    const credential = await navigator.credentials.get({
                        publicKey: {
                            challenge: generateChallenge(),
                            allowCredentials: [{ id: base64ToUint8Array(keyId), type: "public-key" }],
                        }
                    }) as PublicKeyCredential;

                    if (credential) {
                        const decryptedPrivateKey = await decryptWithPasskey(storedData.encryptedKey, credential)
                        const compactPublicKey = derivePublicKeyFromPrivate(decryptedPrivateKey)
                        setPublicKey(compactPublicKey)

                        const pubWords = bech32.toWords(Buffer.from(compactPublicKey, 'hex'))
                        setNpub1Key(bech32.encode('npub', pubWords))
                        setNickname(storedData.nickname)
                        setStatus("Existing account loaded successfully.")
                    } else {
                        setStatus("Failed to retrieve credentials. Please generate new keys.")
                    }
                } catch (error) {
                    console.error("Error initializing account:", error)
                    setStatus("Error loading existing account. Please generate new keys.")
                } finally {
                    setIsInitialized(true)
                }
            } else {
                setIsInitialized(true)
            }
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

    const generateKeys = async (userNickname: string) => {
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
                        name: userNickname,
                        displayName: userNickname,
                    },
                    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                    authenticatorSelection: { authenticatorAttachment: "platform" },
                    attestation: "direct",
                }
            }) as PublicKeyCredential;

            if (credential) {
                const encryptedPrivateKey = await encryptWithPasskey(compactPrivateKey, credential)
                const keyId = uint8ArrayToBase64(new Uint8Array(credential.rawId))

                await storeEncryptedPrivateKey(keyId, encryptedPrivateKey, userNickname)
                localStorage.setItem("nostr_key_id", keyId)

                setPublicKey(compactPublicKey)

                const pubWords = bech32.toWords(Buffer.from(compactPublicKey, 'hex'))
                setNpub1Key(bech32.encode('npub', pubWords))
                setNickname(userNickname)
                setStatus("Keys generated and stored securely.")
            }
        } catch (error) {
            setStatus("Failed to create passkey.")
            console.error("Passkey creation error:", error)
        } finally {
            setIsGenerating(false)
        }
    }

    const retrievePrivateKey = async (): Promise<string> => {
        const keyId = localStorage.getItem("nostr_key_id")
        if (!keyId) {
            throw new Error("No key ID found in localStorage.")
        }

        const storedData = await retrieveEncryptedPrivateKey(keyId)
        if (!storedData || !storedData.encryptedKey) {
            throw new Error("Encrypted private key not found.")
        }

        const credential = await navigator.credentials.get({
            publicKey: {
                challenge: generateChallenge(),
                allowCredentials: [{ id: base64ToUint8Array(keyId), type: "public-key" }],
            }
        }) as PublicKeyCredential;

        if (!credential) {
            throw new Error("Failed to retrieve credentials.")
        }

        const decryptedPrivateKey = await decryptWithPasskey(storedData.encryptedKey, credential)
        return decryptedPrivateKey
    }

    const signMessage = async () => {
        if (!message) {
            setStatus('Please enter a message')
            return
        }

        setIsSigning(true)
        setStatus('Signing message...')

        try {
            const privKey = await retrievePrivateKey()
            const hash = sha256(new TextEncoder().encode(message))
            const sig = Buffer.from(await schnorr.sign(hash, privKey)).toString('hex')
            setSignature(sig)

            const isValid = schnorr.verify(sig, hash, Buffer.from(publicKey, 'hex'))
            setStatus(`Signature valid: ${isValid}`)
        } catch (error) {
            setStatus('Failed to sign message.')
            console.error("Signing error:", error)
        } finally {
            setIsSigning(false)
        }
    }

    const getSignedEvent = async (event: { pubkey: string, created_at: number, kind: number, tags: string[], content: string }) => {
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

        setIsSending(true)
        setStatus('Sending message...')

        try {
            const ws = new WebSocket(nostrRelay)

            ws.onopen = async () => {
                console.log(`Connected to ${nostrRelay}`)
                try {
                    const signedEvent = await getSignedEvent({
                        pubkey: publicKey,
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

    // New Test Method to Retrieve Private Key
    const getPrivateKey = async () => {
        try {
            const privKey = await retrievePrivateKey()
            setNsec(privKey)
            setStatus("Private key retrieved successfully.")
        } catch (error) {
            console.error("Error retrieving private key:", error)
            setStatus("Failed to retrieve private key.")
        }
    }

    // Helper Functions
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
        publicKey,
        npub1Key,
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
        getPrivateKey,       // Expose the test method
        nsec,                // Expose the retrieved private key
        nickname,            // Expose nickname
        setNickname,         // Expose setNickname
        isInitialized        // Expose initialization status
    }
}