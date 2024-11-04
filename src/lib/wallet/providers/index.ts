import type { WalletProvider } from "../types";
import { AlbyWallet } from "./alby";
import { MetamaskWallet } from "./metamask";
import type { WalletStrategy } from "./shared";
import { UnisatWallet } from "./unisat";
import { XverseWallet } from "./xverse";


export const getProviderStrategy = (provider: WalletProvider): WalletStrategy => {
    switch (provider) {
        case 'alby': return new AlbyWallet()
        case 'xverse': return new XverseWallet()
        case 'unisat': return new UnisatWallet()
        case 'metaMask': return new MetamaskWallet()
        default: throw new Error(`Unknown provider: ${provider}`)
    }
}