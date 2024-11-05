import * as secp from '@noble/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { schnorr } from '@noble/curves/secp256k1';
import WebSocket from 'ws';
import { getBitcoinAddress } from '@/lib/wallet/providers/bitcoin';

// Generate a random private key
const privateKey = secp.utils.randomPrivateKey();

// Generate the public key from the private key in uncompressed format
const publicKey = secp.getPublicKey(privateKey, true);

const compactPrivateKey = Buffer.from(privateKey).toString('hex')
const compactPublicKey = Buffer.from(publicKey).toString('hex').substring(2) // remove the prefix
console.log("Private key:", compactPrivateKey);
console.log("Public key:", compactPublicKey);
const addressInfo = await getBitcoinAddress(compactPublicKey);
console.log("Address:", addressInfo.address);

const message = "Your message in Nostr";

const getSignedEvent = async (event, privateKey) => {
    const eventData = JSON.stringify([
        0,
        event.pubkey,
        event.created_at,
        event.kind,
        event.tags,
        event.content
    ]);
    console.log("Event data for signing:", eventData);
    event.id = Buffer.from(sha256(new TextEncoder().encode(eventData))).toString('hex');
    event.sig = Buffer.from(await schnorr.sign(event.id, privateKey)).toString('hex');
    return event;
}

const hash = sha256(new TextEncoder().encode(message));
const signature = await secp.signAsync(hash, privateKey);

const compactSignature = signature.toCompactHex();

const isValid = secp.verify(compactSignature, hash, publicKey);

console.log("Signature:", compactSignature);
console.log("Signature valid:", isValid);

const relays = ["wss://relay.damus.io"]; // List of relays

for (const relayURL of relays) {
    const ws = new WebSocket(relayURL);

    ws.onopen = async () => {
        const signedEvent = await getSignedEvent({
            content: message,
            created_at: Math.floor(Date.now() / 1000), // Unix timestamp,
            kind: 1, // '1' is the kind for a text note
            tags: [],
            pubkey: compactPublicKey,
        }, privateKey);
        console.log("Signed event:", signedEvent);
        const messageString = JSON.stringify(["EVENT", signedEvent]);
        console.log("Sending message:", messageString);
        ws.send(messageString);
    };


    ws.onmessage = (event) => {
        console.log("Message received:", event.data);
    };

    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
        console.log("WebSocket connection closed");
    };
};