import type { WalletProvider } from "../types";
import { AlbyWallet } from "./alby";
import { OneKeyWallet } from "./onekey";
import type { WalletStrategy } from "./shared";
import { WebAuthnWallet } from "./web-authn";

export const getProviderStrategy = (provider: WalletProvider): WalletStrategy => {
    switch (provider) {
        case 'alby': return new AlbyWallet()
        case 'oneKey': return new OneKeyWallet()
        case 'webAuthn': return new WebAuthnWallet()
        default: throw new Error(`Unknown provider: ${provider}`)
    }
}