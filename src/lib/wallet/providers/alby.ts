import { bitcoin, NETWORK, toXOnly } from "./bitcoin";
import type { AddressInfo, Transaction, WalletStrategy } from "./shared";

export class AlbyWallet implements WalletStrategy {
    async getKeys() {
        if (window?.nostr?.enable) {
            await window.nostr.enable()
        } else {
            throw new Error(
                "Oops, it looks like you haven't set up your Nostr key yet." +
                'Go to your Account Settings and create or import a Nostr key.',
            )
        }
        return {
            ordinalsPublicKey: await window.nostr.getPublicKey(),
            ordinalsAddress: '', // TODO: add nostr address
        }
    }
    async signSimpleMessage(message: string, { publicKey }: { publicKey?: string }): Promise<string> {
        const nostrScript = await this.getAddressInfo(toXOnly(publicKey));
        const { output: scriptPubkey, pubkey } = nostrScript;

        // Generate a tagged hash of message to sign
        const prevoutHash = hexToBytes(
            "0000000000000000000000000000000000000000000000000000000000000000",
        );
        const prevoutIndex = 0xffffffff;
        const sequence = 0;
        const hash = hashBip322Message(message);

        // Create the virtual to_spend transaction
        const commands = [0, Buffer.from(hash)];
        const scriptSig = bitcoin.script.compile(commands);
        const virtualToSpend = new bitcoin.Transaction();
        virtualToSpend.version = 0;
        virtualToSpend.locktime = 0;
        virtualToSpend.addInput(
            Buffer.from(prevoutHash),
            prevoutIndex,
            sequence,
            scriptSig,
        );
        virtualToSpend.addOutput(Buffer.from(scriptPubkey), BigInt(0));

        // Create the virtual to_sign transaction
        const virtualToSign = new bitcoin.Psbt();
        virtualToSign.setLocktime(0);
        virtualToSign.setVersion(0);
        const prevTxHash = virtualToSpend.getHash(); // or id?
        const prevOutIndex = 0;
        const toSignScriptSig = bitcoin.script.compile([106]);

        virtualToSign.addInput({
            hash: prevTxHash,
            index: prevOutIndex,
            sequence: 0,
            witnessUtxo: { script: Buffer.from(scriptPubkey, "hex"), value: BigInt(0) },
            tapInternalKey: toXOnly(pubkey),
        });
        virtualToSign.addOutput({ script: toSignScriptSig, value: BigInt(0) });

        const sigHash = virtualToSign.__CACHE.__TX.hashForWitnessV1(
            0,
            [virtualToSign.data.inputs[0].witnessUtxo.script],
            [virtualToSign.data.inputs[0].witnessUtxo.value],
            bitcoin.Transaction.SIGHASH_DEFAULT,
        );

        const sigHashHex = Buffer.from(sigHash).toString('hex');

        debugger
        const sign = await signMessageAlby(sigHashHex);
        debugger

        virtualToSign.updateInput(0, {
            tapKeySig: serializeTaprootSignature(Buffer.from(sign, "hex")),
        });
        virtualToSign.finalizeAllInputs();

        const toSignTx = virtualToSign.extractTransaction();

        function encodeVarString(b) {
            return Buffer.concat([encode(b.byteLength), b]);
        }

        const len = encode(toSignTx.ins[0].witness.length);
        const result = Buffer.concat([
            len,
            ...toSignTx.ins[0].witness.map((w) => encodeVarString(w)),
        ]);

        const signature = base64.encode(result)
        return signature;
    }
    async signTx(transaction: Transaction): Promise<string> {
        if (window.nostr) {
            const signed = await window.nostr.signSchnorr(transaction)
            return signed
        }
        throw new Error('Signing with Nostr is not available')
    }
    async getAddressInfo(pubkey: string): Promise<AddressInfo> {
        const pubkeyBuffer = Buffer.from(pubkey, 'hex');
        const addrInfo = bitcoin.payments.p2tr({
            pubkey: pubkeyBuffer,
            network: NETWORK,
        });
        return addrInfo;
    }
}
