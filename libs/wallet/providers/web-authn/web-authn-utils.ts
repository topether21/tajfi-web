import * as secp from "@noble/secp256k1";
import { bech32 } from "bech32";

export const generateChallenge = (): Uint8Array => {
	return crypto.getRandomValues(new Uint8Array(32));
};

export const hexToUint8Array = (hex: string): Uint8Array => {
	const bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < hex.length; i += 2) {
		bytes[i / 2] = Number.parseInt(hex.substring(i, i + 2), 16);
	}
	return bytes;
}

export const base64ToUint8Array = (base64: string): Uint8Array => {
	const binaryString = atob(base64);
	const len = binaryString.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes;
};

export const derivePublicKeyFromPrivate = (privateKeyHex: string): string => {
	const privKeyBuffer = Buffer.from(privateKeyHex, "hex");
	const pubKey = secp.getPublicKey(privKeyBuffer, true);
	return Buffer.from(pubKey).toString("hex").substring(2);
};

export const encodeNpub = (publicKeyHex: string): string => {
	const pubWords = bech32.toWords(Buffer.from(publicKeyHex, "hex"));
	return bech32.encode("npub", pubWords);
};

export const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
	let binary = "";
	for (let i = 0; i < bytes.byteLength; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
};
