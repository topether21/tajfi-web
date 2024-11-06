import { decode as cborDecode } from 'cbor'
import { sha256 } from '@noble/hashes/sha256'
import { bech32 } from 'bech32'
import { secp256k1 } from '@noble/secp256k1'

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
        const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', new Uint8Array([...authenticatorData, ...clientDataJSON])))

        // Use @noble/secp256k1 to recover the public key from the signature
        const publicKeyRecovered = secp256k1.Signature.fromCompact(new Uint8Array([...der.r, ...der.s])).recoverPublicKey(digest, der.recovery)

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

        const recovery = this.calculateRecovery(r, s) // Implement a method to determine recovery, or set a default

        return { r, s, recovery }
    }

    private calculateRecovery(r: Uint8Array, s: Uint8Array): number {
        // Logic to determine recovery param based on r, s, and public key properties
        // Alternatively, use a fixed recovery param if deterministic signing is consistent
        return 0 // Placeholder for actual logic
    }

    public async addKey(credId: string, pubkey: string) {
        this.keys.set(pubkey, credId)
    }

    public async registerNewKey(accountName: string) {
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

        const credId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)))
        const pubKey = this.extractPublicKeyFromAttestation(credential)

        const npub1 = bech32.encode('npub', bech32.toWords(Buffer.from(pubKey, 'hex')))
        this.keys.set(npub1, credId)
        return npub1
    }

    private extractPublicKeyFromAttestation(credential: PublicKeyCredential): string {
        const attestationResponse = credential.response as AuthenticatorAttestationResponse
        const attestationObject = new Uint8Array(attestationResponse.attestationObject as ArrayBuffer)
        const decoded = cborDecode(attestationObject.buffer)

        const authData = new Uint8Array(decoded.authData)
        const publicKeyCose = authData.slice(-77) // Last 77 bytes for COSE key format

        // Parse COSE key into hex format for Nostr
        const coseStruct = cborDecode(publicKeyCose.buffer)
        const x = coseStruct.get(-2) // X coordinate
        const y = coseStruct.get(-3) // Y coordinate

        if (!x || !y) throw new Error('Failed to extract public key coordinates')

        return Buffer.concat([Buffer.from([0x04]), x, y]).toString('hex')
    }
}
