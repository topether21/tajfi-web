// 'use client';
// import * as bitcoin from 'bitcoinjs-lib';
// import ecc from '@bitcoinerlab/secp256k1';
// import { PSBT_HEX } from './data';

// bitcoin.initEccLib(ecc);

// export type WalletKeys = {
//     ordinalsPublicKey: string;
//     paymentPublicKey: string;
//     ordinalsAddress: string;
//     paymentAddress: string;
// };


// const enableBTC = async () => {
//     try {
//         if (typeof window.webbtc !== 'undefined') {
//             await window.webbtc.enable();
//         }
//     }
//     catch (error) {
//         // User denied permission or cancelled 
//         console.log(error);
//     }
// };

// const getNostrPubKey = async () => {
//     if (window?.nostr?.enable) {
//         await window.nostr.enable();
//     } else {
//         throw new Error(
//             "Oops, it looks like you haven't set up your Nostr key yet." +
//             'Go to your Alby Account Settings and create or import a Nostr key.'
//         );
//     }
//     return window.nostr.getPublicKey();
// };

// // const signInvoice = async (ordinalsPublicKey: string) => {
// //     const hexPsbt = 
// //     const psbt = bitcoin.Psbt.fromHex(hexPsbt);
// //     // const signature = await window.nostr.signSchnorr();
// //     const signature = await window.nostr.signPsbt(hexPsbt);
// //     console.log('signature', signature);
// //     return signature;
// // };

// // const signInvoice = async (ordinalsPublicKey: string) => {
// //     const hexPsbt = PSBT_HEX
// //     const psbt = bitcoin.Psbt.fromHex(hexPsbt);
// //     console.log("base64", psbt.toBase64())
// //     const signature = await window.webbtc.signPsbt(hexPsbt)
// //     console.log("signature", signature)
// //     return signature;
// // };

// // const signInvoice = async (ordinalsPublicKey: string) => {
// //     const hexPsbt = PSBT_HEX
// //     const psbt = bitcoin.Psbt.fromHex(hexPsbt);
// //     console.log("base64", psbt.toBase64())
// //     const sigHash = psbt.__CACHE.__TX.getHash()

// //     console.log("sigHash", sigHash)

// //     const signed = await window.nostr.signSchnorr(sigHash);


// //     console.log("signed", signed)

// //     // psbt.updateInput(0, {
// //     //     tapKeySig: serializeTaprootSignature(Buffer.from(signed, 'hex')),
// //     // });

// //     // // Finalize the PSBT. Note that the transaction will not be broadcast to the Bitcoin network yet.
// //     // psbt.finalizeAllInputs();
// // };



// const getAddressInfo = (pubkey: string) => {
//     const pubkeyBuffer = Buffer.from(pubkey, 'hex');
//     console.log(`Pubkey: ${pubkey.toString()}`);
//     const addrInfo = bitcoin.payments.p2tr({
//         pubkey: pubkeyBuffer,
//         network: bitcoin.networks.bitcoin,
//     });

//     return addrInfo;
// }

// // const signInvoice = async (ordinalsPublicKey: string) => {
// //     const hexPsbt = PSBT_HEX
// //     const psbt = bitcoin.Psbt.fromHex(hexPsbt);
// //     console.log("base64", psbt.toBase64())
// //     const addressInfo = getAddressInfo(ordinalsPublicKey)
// //     console.log("addressInfo", addressInfo)
// //     // const sigHash = psbt.__CACHE.__TX.hashForSignature(0, addressInfo.output, bitcoin.Transaction.SIGHASH_DEFAULT)
// //     const sigHash = psbt.__CACHE.__TX.hashForWitnessV1(0, [addressInfo.output], [56n], bitcoin.Transaction.SIGHASH_DEFAULT)
// //     console.log("sigHash", sigHash)
// //     const signed = await window.nostr.signSchnorr(sigHash.toString('hex'));
// //     console.log("signed", signed)
// // };


// // const signInvoice = async (ordinalsPublicKey: string) => {
// //     const hexPsbt = PSBT_HEX;
// //     const psbt = bitcoin.Psbt.fromHex(hexPsbt);
// //     console.log("base64", psbt.toBase64());
// //     const addressInfo = getAddressInfo(ordinalsPublicKey);
// //     console.log("addressInfo", addressInfo);

// //     // Sign the PSBT using Nostr
// //     const signed = await window.nostr.signSchnorr(hexPsbt);
// //     console.log("signed", signed);

// //     // Convert the signature to Uint8Array
// //     const signatureBuffer = Buffer.from(signed, 'hex');
// //     const signatureUint8Array = new Uint8Array(signatureBuffer);

// //     // Convert the public key to Uint8Array
// //     const pubkeyBuffer = Buffer.from(ordinalsPublicKey, 'hex');
// //     const pubkeyUint8Array = new Uint8Array(pubkeyBuffer);

// //     // Ensure the Uint8Array is correctly passed
// //     psbt.updateInput(0, {
// //         partialSig: [
// //             {
// //                 pubkey: Uint8Array.from(pubkeyUint8Array),
// //                 signature: Uint8Array.from(signatureUint8Array),
// //             },
// //         ],
// //     });

// //     // Finalize the input
// //     psbt.finalizeInput(0);

// //     // Get the updated PSBT
// //     const updatedPsbtHex = psbt.toHex();
// //     console.log("Updated PSBT Hex:", updatedPsbtHex);
// // };

// // const signInvoice = async (ordinalsPublicKey: string) => {
// //     const hexPsbt = PSBT_HEX
// //     const psbt = bitcoin.Psbt.fromHex(hexPsbt);
// //     console.log("base64", psbt.toBase64())
// //     const addressInfo = getAddressInfo(ordinalsPublicKey)
// //     console.log("addressInfo", addressInfo)
// //     const sigHash = psbt.__CACHE.__TX.hashForWitnessV1(0, [addressInfo.output], [56n], bitcoin.Transaction.SIGHASH_DEFAULT)
// //     console.log("sigHash", sigHash)
// //     const signed = await window.nostr.signSchnorr(sigHash.toString('hex'));
// //     console.log("signed", signed)
// // };


// const signInvoice = async (ordinalsPublicKey: string) => {
//     const hexPsbt = PSBT_HEX
//     const psbt = bitcoin.Psbt.fromHex(hexPsbt);
//     console.log("base64", psbt.toBase64())
//     const addressInfo = getAddressInfo(ordinalsPublicKey)
//     console.log("addressInfo", addressInfo)
//     const signed = await window.nostr.signSchnorr(hexPsbt);
//     console.log("signed", signed)
// };


// const serverAuth = async (ordinalsPublicKey: string, signature = 'valid_signature') => {
//     const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/wallet/connect`;
//     console.log(apiUrl);
//     const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//         },
//         body: JSON.stringify({
//             public_key: ordinalsPublicKey,
//             signature,
//         }),
//     });

//     if (!response.ok) {
//         throw new Error('Failed to connect wallet');
//     }

//     const data = await response.json();
//     return data;
// };

// export const connectWallet = async (provider = '') => {
//     const walletName = provider?.split('.')[0] || 'alby';
//     const ordinalsPublicKey = await getNostrPubKey();
//     // const serverAuthResponse = await serverAuth(ordinalsPublicKey);
//     // console.log("serverAuthResponse", serverAuthResponse);
//     // await enableBTC();
//     await signInvoice(ordinalsPublicKey);
//     // const serverAuthResponse = await serverAuth(ordinalsPublicKey);
//     return {
//         walletName,
//         ordinalsPublicKey,
//         paymentPublicKey: '',
//         ordinalsAddress: '',
//         paymentAddress: '',
//         // token: serverAuthResponse.token,
//     };
// };
