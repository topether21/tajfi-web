export const signInvoice = async (sigHashHex: string) => {
  debugger
  const signed = await window.nostr?.signSchnorr(sigHashHex)
  return signed
}
