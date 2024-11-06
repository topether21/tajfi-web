// encryption.ts - Helper for WebCrypto encryption/decryption

export async function deriveKeyFromPasskey(
    credential: PublicKeyCredential,
    salt: Uint8Array
): Promise<CryptoKey> {
    const rawId = new Uint8Array(credential.rawId);
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        rawId,
        'PBKDF2',
        false,
        ['deriveKey']
    );
    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
}

export interface EncryptedData {
    salt: number[];
    iv: number[];
    ciphertext: number[];
}

export async function encryptWithPasskey(
    privateKey: string,
    credential: PublicKeyCredential
): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const cryptoKey = await deriveKeyFromPasskey(credential, salt);
    const encoder = new TextEncoder();
    const data = encoder.encode(privateKey);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        cryptoKey,
        data
    );
    const encryptedData: EncryptedData = {
        salt: Array.from(salt),
        iv: Array.from(iv),
        ciphertext: Array.from(new Uint8Array(encrypted))
    };
    return JSON.stringify(encryptedData);
}

export async function decryptWithPasskey(
    encryptedDataStr: string,
    credential: PublicKeyCredential
): Promise<string> {
    try {
        const encryptedData: EncryptedData = JSON.parse(encryptedDataStr);
        const salt = new Uint8Array(encryptedData.salt);
        const iv = new Uint8Array(encryptedData.iv);
        const ciphertext = new Uint8Array(encryptedData.ciphertext);
        const cryptoKey = await deriveKeyFromPasskey(credential, salt);
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            cryptoKey,
            ciphertext
        );
        return new TextDecoder().decode(decrypted);
    } catch (error) {
        console.error('Decryption failed:', error);
        throw new Error('Unable to decrypt data.');
    }
}