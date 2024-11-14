import ecc from "@bitcoinerlab/secp256k1";
import * as bitcoin from "bitcoinjs-lib";
bitcoin.initEccLib(ecc);
const NETWORK = bitcoin.networks.bitcoin;

export const toXOnly = (pubKey: Uint8Array) =>
	pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);

export const toXOnlyStr = (pubKey: string) =>
	pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);

export const getP2trAddress = async (pubkey: string) => {
	const pubkeyBuffer = Buffer.from(pubkey, "hex");
	const addrInfo = bitcoin.payments.p2tr({
		pubkey: pubkeyBuffer,
		network: NETWORK,
	});
	return addrInfo;
};
