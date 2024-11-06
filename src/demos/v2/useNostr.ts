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

    useEffect(() => {
        generateKeys()
    }, [])

    const generateChallenge = (): Uint8Array => {
        return crypto.getRandomValues(new Uint8Array(32))
    }

    const generateKeys = async () => {
        setIsGenerating(true)
        const privKey = secp.utils.randomPrivateKey()
        const pubKey = secp.getPublicKey(privKey, true)

        const compactPrivateKey = Buffer.from(privKey).toString('hex')
        const compactPublicKey = Buffer.from(pubKey).toString('hex').substring(2)

        try {
            const credential = await navigator.credentials.create({
                publicKey: {
                    challenge: generateChallenge(),
                    rp: { name: "My Nostr App" },
                    user: {
                        id: crypto.getRandomValues(new Uint8Array(16)),
                        name: "user@example.com",
                        displayName: "Nostr User",
                    },
                    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                    authenticatorSelection: { authenticatorAttachment: "platform" },
                    attestation: "direct",
                }
            }) as PublicKeyCredential;

            if (credential) {
                const encryptedPrivateKey = await encryptWithPasskey(compactPrivateKey, credential)
                const keyId = Buffer.from(credential.rawId).toString('base64')

                await storeEncryptedPrivateKey(keyId, encryptedPrivateKey)
                // Consider using a more secure storage mechanism
                sessionStorage.setItem("nostr_key_id", keyId)

                setPublicKey(compactPublicKey)

                const pubWords = bech32.toWords(Buffer.from(compactPublicKey, 'hex'))
                setNpub1Key(bech32.encode('npub', pubWords))
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
        const keyId = sessionStorage.getItem("nostr_key_id")
        if (!keyId) throw new Error("Key ID not found.")

        const encryptedPrivateKey = await retrieveEncryptedPrivateKey(keyId)
        if (!encryptedPrivateKey) throw new Error("Encrypted private key not found.")

        try {
            const credential = await navigator.credentials.get({
                publicKey: {
                    challenge: generateChallenge(),
                    allowCredentials: [{ id: Uint8Array.from(Buffer.from(keyId, 'base64')), type: "public-key" }],
                }
            }) as PublicKeyCredential;

            if (!credential) throw new Error("Credential retrieval failed.")

            return await decryptWithPasskey(encryptedPrivateKey, credential)
        } catch (error) {
            console.error("Credential retrieval error:", error)
            throw new Error("Failed to retrieve private key.")
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

        const relays = [nostrRelay]

        for (const relayURL of relays) {
            try {
                const ws = new WebSocket(relayURL)

                ws.onopen = async () => {
                    try {
                        const signedEvent = await getSignedEvent({
                            content: message,
                            created_at: Math.floor(Date.now() / 1000),
                            kind: 1,
                            tags: [],
                            pubkey: publicKey,
                        })

                        const messageString = JSON.stringify(["EVENT", signedEvent])
                        ws.send(messageString)
                        setStatus(`Message sent to ${relayURL}`)
                    } catch (error) {
                        setStatus(`Failed to sign or send message to ${relayURL}`)
                        console.error(`Error sending message to ${relayURL}:`, error)
                    }
                }

                ws.onmessage = (event) => {
                    console.log("Message received:", event.data)
                    setStatus(`Received response from ${relayURL}: ${event.data}`)
                }

                ws.onerror = (error) => {
                    console.error("WebSocket error:", error)
                    setStatus(`Error connecting to ${relayURL}`)
                }

                ws.onclose = () => {
                    console.log("WebSocket connection closed")
                }
            } catch (error) {
                console.error(`Failed to connect to relay ${relayURL}:`, error)
                setStatus(`Failed to connect to ${relayURL}`)
            }
        }

        setIsSending(false)
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
        isSending
    }
}