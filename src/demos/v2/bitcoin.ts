import * as bitcoin from "bitcoinjs-lib"
import ecc from '@bitcoinerlab/secp256k1';

bitcoin.initEccLib(ecc);
const NETWORK = bitcoin.networks.bitcoin;

export const getBitcoinAddress = async (pubkey: string) => {
    const pubkeyBuffer = Buffer.from(pubkey, 'hex');
    const addrInfo = bitcoin.payments.p2tr({
        pubkey: pubkeyBuffer,
        network: NETWORK,
    });
    return addrInfo;
}