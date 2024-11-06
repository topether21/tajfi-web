'use client'

import { useState, useEffect } from 'react'
import * as secp from '@noble/secp256k1'
import { sha256 } from '@noble/hashes/sha256'
import { schnorr } from '@noble/curves/secp256k1'
import { bech32 } from 'bech32'

const nostrRelay = "wss://relay.damus.io"

export const useNostr = () => {
    const [privateKey, setPrivateKey] = useState('')
    const [publicKey, setPublicKey] = useState('')
    const [npub1Key, setNpub1Key] = useState('')
    const [nsec1Key, setNsec1Key] = useState('')
    const [message, setMessage] = useState('')
    const [signature, setSignature] = useState('')
    const [status, setStatus] = useState('')

    useEffect(() => {
        generateKeys()
    }, [])

    const generateKeys = () => {
        const privKey = secp.utils.randomPrivateKey()
        const pubKey = secp.getPublicKey(privKey, true)

        const compactPrivateKey = Buffer.from(privKey).toString('hex')
        const compactPublicKey = Buffer.from(pubKey).toString('hex').substring(2) // remove the prefix

        setPrivateKey(compactPrivateKey)
        setPublicKey(compactPublicKey)

        // Convert the public key to Bech32 format
        const pubWords = bech32.toWords(Buffer.from(compactPublicKey, 'hex'))
        const npub1 = bech32.encode('npub', pubWords)
        setNpub1Key(npub1)

        // Convert the private key to Bech32 format
        const privWords = bech32.toWords(Buffer.from(compactPrivateKey, 'hex'))
        const nsec1 = bech32.encode('nsec', privWords)
        setNsec1Key(nsec1)
    }

    const getSignedEvent = async (event: { pubkey: string, created_at: number, kind: number, tags: string[], content: string }, privKey: string) => {
        const eventData = JSON.stringify([
            0,
            event.pubkey,
            event.created_at,
            event.kind,
            event.tags,
            event.content
        ])
        const id = Buffer.from(sha256(new TextEncoder().encode(eventData))).toString('hex')
        const sig = Buffer.from(await schnorr.sign(id, privKey)).toString('hex')
        return { ...event, id, sig }
    }

    const sendMessage = async () => {
        if (!message) {
            setStatus('Please enter a message')
            return
        }

        const relays = [nostrRelay]

        for (const relayURL of relays) {
            const ws = new WebSocket(relayURL)

            ws.onopen = async () => {
                const signedEvent = await getSignedEvent({
                    content: message,
                    created_at: Math.floor(Date.now() / 1000),
                    kind: 1, // '1' is the kind for a text note
                    tags: [],
                    pubkey: publicKey,
                }, privateKey)

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
    }

    const signMessage = async () => {
        if (!message) {
            setStatus('Please enter a message')
            return
        }

        const hash = sha256(new TextEncoder().encode(message))
        const sig = Buffer.from(await schnorr.sign(hash, privateKey)).toString('hex')
        setSignature(sig)

        const isValid = schnorr.verify(sig, hash, Buffer.from(publicKey, 'hex'))
        setStatus(`Signature valid: ${isValid}`)
    }

    return {
        privateKey,
        publicKey,
        npub1Key,
        nsec1Key,
        message,
        setMessage,
        signature,
        status,
        generateKeys,
        signMessage,
        sendMessage,
        nostrRelay
    }
}
