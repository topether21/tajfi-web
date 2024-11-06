'use client'

import { useState, useEffect } from 'react'
import { sha256 } from '@noble/hashes/sha256'
import { bech32 } from 'bech32'

const nostrRelay = "wss://relay.damus.io"

export const useNostr = () => {
    const [publicKey, setPublicKey] = useState('')
    const [npub1Key, setNpub1Key] = useState('')
    const [message, setMessage] = useState('')
    const [signature, setSignature] = useState('')
    const [status, setStatus] = useState('')

    useEffect(() => {
        initializeWebAuthn()
    }, [])

    const initializeWebAuthn = async () => {
        try {
            const credId = localStorage.getItem('nostr_cred_id')
            if (!credId) {
                await createWebAuthnCredential('nostr-user')
            } else {
                setStatus('WebAuthn key already exists.')
            }
        } catch (error) {
            console.error("Error initializing WebAuthn:", error)
            setStatus(`Error: ${error.message}`)
        }
    }

    const createWebAuthnCredential = async (accountName: string) => {
        try {
            const credential = await navigator.credentials.create({
                publicKey: {
                    rp: { id: window.location.host, name: 'Nostr App' },
                    user: {
                        id: new Uint8Array(16),
                        name: accountName,
                        displayName: accountName,
                    },
                    pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
                    timeout: 60000,
                    challenge: new Uint8Array(32).buffer,
                    attestation: 'direct',
                },
            }) as PublicKeyCredential

            const credId = credential.rawId
            const publicKey = credential.response.getPublicKey()

            localStorage.setItem('nostr_cred_id', btoa(String.fromCharCode(...new Uint8Array(credId))))
            setPublicKey(Buffer.from(publicKey).toString('hex'))

            const pubWords = bech32.toWords(Buffer.from(publicKey))
            const npub1 = bech32.encode('npub', pubWords)
            setNpub1Key(npub1)
            setStatus('WebAuthn key created successfully')
        } catch (error) {
            console.error("Error creating WebAuthn key:", error)
            setStatus(`Failed to create WebAuthn key: ${error.message}`)
        }
    }

    const signMessageWithWebAuthn = async (message: string) => {
        const credId = localStorage.getItem('nostr_cred_id')
        if (!credId) throw new Error('No WebAuthn credential found')

        const messageDigest = sha256(new TextEncoder().encode(message))

        const assertion = await navigator.credentials.get({
            publicKey: {
                timeout: 60000,
                allowCredentials: [{
                    id: Uint8Array.from(atob(credId), c => c.charCodeAt(0)),
                    type: 'public-key',
                }],
                challenge: messageDigest,
            },
        }) as PublicKeyCredential

        return Buffer.from(assertion.response.getSignature()).toString('hex')
    }

    const sendMessage = async () => {
        if (!message) {
            setStatus('Please enter a message')
            return
        }

        try {
            const sig = await signMessageWithWebAuthn(message)
            setSignature(sig)

            const relays = [nostrRelay]

            for (const relayURL of relays) {
                const ws = new WebSocket(relayURL)

                ws.onopen = async () => {
                    const signedEvent = {
                        content: message,
                        created_at: Math.floor(Date.now() / 1000),
                        kind: 1,
                        tags: [],
                        pubkey: publicKey,
                        sig,
                    }

                    const messageString = JSON.stringify(["EVENT", signedEvent])
                    ws.send(messageString)
                    setStatus(`Message sent to ${relayURL}`)
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
            }
        } catch (error) {
            console.error("Error signing message:", error)
            setStatus(`Error signing message: ${error.message}`)
        }
    }

    return {
        publicKey,
        npub1Key,
        message,
        setMessage,
        signature,
        status,
        generateKeys: initializeWebAuthn,
        signMessage: sendMessage,
        sendMessage,
        nostrRelay
    }
}
