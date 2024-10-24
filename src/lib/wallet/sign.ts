export const signInvoice = async (sigHashHex: string) => {
    const signed = await window.nostr?.signSchnorr(sigHashHex)
    return signed
}
