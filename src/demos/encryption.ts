// encryption.ts - Helper for WebCrypto encryption/decryption
export async function deriveKeyFromPasskey(credential: PublicKeyCredential): Promise<CryptoKey> {
    const rawId = new Uint8Array(credential.rawId);
    const hash = await crypto.subtle.digest('SHA-256', rawId);
    return crypto.subtle.importKey('raw', hash, 'AES-GCM', true, ['encrypt', 'decrypt']);
}

export async function encryptWithPasskey(privateKey: string, credential: PublicKeyCredential): Promise<ArrayBuffer> {
    const cryptoKey = await deriveKeyFromPasskey(credential);
    const encoder = new TextEncoder();
    const data = encoder.encode(privateKey);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, data);
    return new Uint8Array([...iv, ...new Uint8Array(encrypted)]).buffer;
}

export async function decryptWithPasskey(encryptedData: ArrayBuffer, credential: PublicKeyCredential): Promise<string> {
    const cryptoKey = await deriveKeyFromPasskey(credential);
    const iv = encryptedData.slice(0, 12);
    const encrypted = encryptedData.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, encrypted);
    return new TextDecoder().decode(decrypted);
}
