import { decode as cborDecode } from 'cbor'
import { sha256 } from '@noble/hashes/sha256'
import { bech32 } from 'bech32'
import * as secp256k1 from '@noble/curves/secp256k1'
import * as secp from '@noble/secp256k1'

export class WaSignatureProvider {
    public keys = new Map<string, string>()

    public async getAvailableKeys() {
        return Array.from(this.keys.keys())
    }

    public async signEvent(event: {
        pubkey: string
        created_at: number
        kind: number
        tags: string[]
        content: string
    }) {
        const { pubkey, created_at, kind, tags, content } = event
        const eventData = JSON.stringify([0, pubkey, created_at, kind, tags, content])
        const digest = sha256(new TextEncoder().encode(eventData))

        const credId = this.keys.get(pubkey)
        if (!credId) throw new Error(`No credential found for pubkey: ${pubkey}`)

        const id = Uint8Array.from(atob(credId), c => c.charCodeAt(0))
        const assertion = await navigator.credentials.get({
            publicKey: {
                timeout: 60000,
                allowCredentials: [{ id, type: 'public-key' }],
                challenge: digest,
            },
        }) as PublicKeyCredential

        return this.constructSignature(assertion, pubkey, digest)
    }

    private async constructSignature(assertion: PublicKeyCredential, pubkey: string, digest: Uint8Array) {
        const assertionResponse = assertion.response as AuthenticatorAssertionResponse
        const signatureBuffer = new Uint8Array(assertionResponse.signature as ArrayBuffer)
        const authenticatorData = new Uint8Array(assertionResponse.authenticatorData as ArrayBuffer)
        const clientDataJSON = new Uint8Array(await crypto.subtle.digest('SHA-256', assertionResponse.clientDataJSON as ArrayBuffer))

        const der = this.parseDerSignature(signatureBuffer)

        // Construct Nostr-compatible signature
        const sigData = new Uint8Array([der.recovery + 27 + 4, ...der.r, ...der.s])
        return Buffer.from(sigData).toString('hex')
    }

    private parseDerSignature(der: Uint8Array) {
        const buffer = new Uint8Array(der)
        if (buffer[0] !== 0x30) throw new Error('Signature missing DER prefix')
        if (buffer[2] !== 0x02) throw new Error('Signature has bad r marker')
        const rLen = buffer[3]
        const r = buffer.slice(4, 4 + rLen)
        if (buffer[4 + rLen] !== 0x02) throw new Error('Signature has bad s marker')
        const sLen = buffer[5 + rLen]
        const s = buffer.slice(6 + rLen, 6 + rLen + sLen)

        const recovery = this.calculateRecovery(r, s) // Placeholder, adjust as needed

        return { r, s, recovery }
    }

    private calculateRecovery(r: Uint8Array, s: Uint8Array): number {
        // Logic to determine recovery param based on r, s, and public key properties
        // Placeholder implementation
        return 0
    }

    public async addKey(credId: string, pubkey: string) {
        this.keys.set(pubkey, credId)
    }

    public async registerNewKey(accountName: string) {
        const credential = await navigator.credentials.create({
            publicKey: {
                rp: { id: window.location.hostname, name: 'Nostr App' },
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

        const credId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)))
        const pubKey = this.extractPublicKeyFromAttestation(credential)

        // Validate and compress the public key
        const point = secp256k1.secp256k1.ProjectivePoint.fromHex(pubKey) // Ensure key is on the curve
        const compressedPubKey = point.toHex(true) // true for compressed format
        const compressedPubKeyBuffer = Buffer.from(compressedPubKey, 'hex')

        // Encode the compressed public key in Bech32 format (npub1) for Nostr
        const npub1 = bech32.encode('npub', bech32.toWords(compressedPubKeyBuffer))
        this.keys.set(npub1, credId)
        return npub1
    }

    private extractPublicKeyFromAttestation(credential: PublicKeyCredential): string {
        const attestationResponse = credential.response as AuthenticatorAttestationResponse
        const attestationObject = new Uint8Array(attestationResponse.attestationObject as ArrayBuffer)
        const decoded = cborDecode(attestationObject.buffer)

        const authData = new Uint8Array(decoded.authData)
        const publicKeyCose = authData.slice(-77) // Extract COSE key structure

        // Decode COSE key to get x and y coordinates
        const coseStruct = cborDecode(publicKeyCose.buffer)
        const x = coseStruct.get(-2) // X coordinate in COSE format
        const y = coseStruct.get(-3) // Y coordinate in COSE format

        if (!x || !y) throw new Error('Failed to extract public key coordinates')

        // Ensure x and y are the correct length (32 bytes each) and form a valid point
        if (x.length !== 32 || y.length !== 32) {
            throw new Error('Invalid key length for x or y coordinates')
        }

        // Concatenate x and y with the uncompressed key prefix (0x04) to form a valid secp256k1 point
        const uncompressedKey = Buffer.concat([Buffer.from([0x04]), x, y])

        if (uncompressedKey.length !== 65) {
            throw new Error(`Invalid uncompressed public key length: expected 65, got ${uncompressedKey.length}`)
        }

        return uncompressedKey.toString('hex')
    }
}
