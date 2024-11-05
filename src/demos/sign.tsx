'use client'
import React, { useState } from 'react';
import * as bitcoin from 'bitcoinjs-lib';
import ecc from '@bitcoinerlab/secp256k1';
import { ECPairFactory } from 'ecpair';
import { sign, getSharedSecret, utils } from '@noble/secp256k1';
import { createCipheriv, createDecipheriv } from 'node:crypto';

const ECPair = ECPairFactory(ecc);

const App = () => {
    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [relayUrl, setRelayUrl] = useState('wss://relay.nostr.info');
    const [message, setMessage] = useState('');
    const [destinationPublicKey, setDestinationPublicKey] = useState('');
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    const generateKeys = () => {
        const keyPair = ECPair.makeRandom();
        setPrivateKey(keyPair.privateKey.toString('hex'));
        setPublicKey(keyPair.publicKey.toString('hex').substring(2));
    };

    const connect = () => {
        if (!publicKey || !privateKey) {
            alert('Generate or input public/private keys.');
            return;
        }

        clearMessages();
        const newSocket = new WebSocket(relayUrl);
        setSocket(newSocket);

        newSocket.addEventListener('message', async (message) => {
            const [type, subId, event] = JSON.parse(message.data);
            if (!event) return;
            const { kind, content, tags, pubkey, created_at, id } = event || {};
            if (kind === 1) {
                appendMessage(content, pubkey, created_at, tags);
            } else if (kind === 4) {
                const decryptedContent = pubkey === publicKey
                    ? await decrypt(privateKey, getDestinationPublicKeyFromTags(tags), content)
                    : await decrypt(privateKey, pubkey, content);
                appendMessage(decryptedContent, pubkey, created_at, tags);
            }
        });

        newSocket.addEventListener('close', () => {
            console.log('Disconnected');
        });

        newSocket.addEventListener('open', () => {
            console.log('Connected to ' + relayUrl);
            const subId = ECPair.makeRandom().privateKey.toString('hex');
            const authorFilter = { authors: [publicKey] };
            const edmFilter = { '#p': [publicKey] };
            const subscription = ['REQ', subId, authorFilter, edmFilter];
            newSocket.send(JSON.stringify(subscription));
        });
    };

    const disconnect = () => {
        if (socket) {
            socket.close();
            setSocket(null);
        }
    };

    const send = () => {
        if (!socket) {
            alert('You must connect to a relay.');
            return;
        }
        if (!message) {
            alert('Write a message.');
            return;
        }

        if (destinationPublicKey) {
            sendEncryptedDirectMessage(privateKey, publicKey, destinationPublicKey, message);
        } else {
            sendTextNote();
        }
        setMessage('');
    };

    const sendTextNote = async () => {
        const event = {
            content: message,
            created_at: Math.floor(Date.now() / 1000),
            kind: 1,
            tags: [],
            pubkey: publicKey,
        };
        const signedEvent = await getSignedEvent(event, privateKey);
        socket.send(JSON.stringify(['EVENT', signedEvent]));
    };

    const sendEncryptedDirectMessage = async (privkey, pubkey, destpubkey, text) => {
        const encrypted = encrypt(privkey, destpubkey, text);
        const event = {
            content: encrypted,
            created_at: Math.floor(Date.now() / 1000),
            kind: 4,
            tags: [['p', destpubkey]],
            pubkey: pubkey,
        };
        const signedEvent = await getSignedEvent(event, privkey);
        socket.send(JSON.stringify(['EVENT', signedEvent]));
    };

    const getSignedEvent = async (event, privateKey) => {
        const eventData = JSON.stringify([
            0,
            event.pubkey,
            event.created_at,
            event.kind,
            event.tags,
            event.content,
        ]);
        event.id = bitcoin.crypto.sha256(Buffer.from(eventData)).toString('hex');
        event.sig = await sign(event.id, privateKey, { der: false });
        return event;
    };

    const encrypt = (privkey, pubkey, text) => {
        const key = getSharedSecret(privkey, '02' + pubkey, true).substring(2);
        const iv = window.crypto.getRandomValues(new Uint8Array(16));
        const cipher = createCipheriv('aes-256-cbc', hexToBytes(key), iv);
        const encryptedMessage = cipher.update(text, 'utf8', 'base64') + cipher.final('base64');
        return encryptedMessage + '?iv=' + btoa(String.fromCharCode.apply(null, iv));
    };

    const decrypt = (privkey, pubkey, ciphertext) => {
        const [emsg, iv] = ciphertext.split('?iv=');
        const key = getSharedSecret(privkey, '02' + pubkey, true).substring(2);
        const decipher = createDecipheriv('aes-256-cbc', hexToBytes(key), hexToBytes(base64ToHex(iv)));
        const decryptedMessage = decipher.update(emsg, 'base64') + decipher.final('utf8');
        return decryptedMessage;
    };

    const appendMessage = (content, pubkey, created_at, tags) => {
        const newMessage = {
            date: created_at,
            from: pubkey,
            to: getDestinationPublicKeyFromTags(tags),
            message: content,
        };
        setMessages((prevMessages) => [newMessage, ...prevMessages]);
    };

    const clearMessages = () => {
        setMessages([]);
    };

    const getDestinationPublicKeyFromTags = (tags) => {
        for (let i = 0; i < tags.length; i++) {
            if (tags[i][0] === 'p') {
                return tags[i][1];
            }
        }
        return '';
    };

    const hexToBytes = (hex) => Uint8Array.from(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

    const base64ToHex = (str) => {
        const raw = atob(str);
        return Array.from(raw).map((char) => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    };

    return (
        <div>
            <form onSubmit={(e) => { e.preventDefault(); generateKeys(); }}>
                <button type="submit">Generate</button> or input public/private keys:
                <textarea rows="2" cols="50" value={publicKey} onChange={(e) => setPublicKey(e.target.value)} placeholder="Public key" />
                <textarea rows="2" cols="50" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} placeholder="Private key" />
            </form>

            <form onSubmit={(e) => { e.preventDefault(); connect(); }}>
                <input type="text" size="30" value={relayUrl} onChange={(e) => setRelayUrl(e.target.value)} placeholder="Relay Url" />
                <button type="submit">Connect</button>
                <button type="button" onClick={disconnect}>Disconnect</button>
            </form>

            <form onSubmit={(e) => { e.preventDefault(); send(); }}>
                <textarea rows="2" cols="50" value={destinationPublicKey} onChange={(e) => setDestinationPublicKey(e.target.value)} placeholder="Input a destination public key for direct message or leave empty for public message" />
                <textarea rows="4" cols="50" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" />
                <button type="submit">Send</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.map((msg, index) => (
                        <tr key={index}>
                            <td>{new Date(msg.date * 1000).toLocaleString()}</td>
                            <td>{msg.from}</td>
                            <td>{msg.to}</td>
                            <td>{msg.message}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default App;