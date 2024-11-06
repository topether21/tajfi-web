'use client'

import { useState, useEffect } from 'react'
import { WaSignatureProvider } from './WaSignatureProvider'

const nostrRelay = "wss://relay.damus.io"

export const useNostr = () => {
    const [publicKey, setPublicKey] = useState('')
    const [npub1Key, setNpub1Key] = useState('')
    const [message, setMessage] = useState('')
    const [signature, setSignature] = useState('')
    const [status, setStatus] = useState('')

    const signatureProvider = new WaSignatureProvider()

    useEffect(() => {
        initializeWebAuthn()
    }, [])

    const initializeWebAuthn = async () => {
        try {
            const savedPubKey = localStorage.getItem('nostr_pubkey')
            const savedCredId = localStorage.getItem('nostr_cred_id')
            if (savedPubKey && savedCredId) {
                // Load existing WebAuthn key
                signatureProvider.addKey(savedCredId, savedPubKey)
                setPublicKey(savedPubKey)
                setNpub1Key(savedPubKey)
                setStatus('WebAuthn key loaded successfully')
            } else {
                // Create a new WebAuthn credential and store it
                const npubKey = await signatureProvider.registerNewKey('nostr-user')
                setPublicKey(npubKey)
                setNpub1Key(npubKey)
                localStorage.setItem('nostr_pubkey', npubKey)
                setStatus('WebAuthn key created successfully')
            }
        } catch (error) {
            console.error("Error initializing WebAuthn:", error)
            setStatus(`Error: ${error.message}`)
        }
    }

    const sendMessage = async () => {
        if (!message) {
            setStatus('Please enter a message')
            return
        }

        try {
            const created_at = Math.floor(Date.now() / 1000)
            const event = {
                pubkey: publicKey,
                created_at,
                kind: 1,
                tags: [],
                content: message,
            }

            const sig = await signatureProvider.signEvent(event)
            setSignature(sig)

            const signedEvent = { ...event, sig }

            const relays = [nostrRelay]
            for (const relayURL of relays) {
                const ws = new WebSocket(relayURL)

                ws.onopen = () => {
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
