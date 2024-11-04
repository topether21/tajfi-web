import type { WalletProvider } from "../types";
import { AlbyWallet } from "./alby";
import type { WalletStrategy } from "./shared";


export const getProviderStrategy = (provider: WalletProvider): WalletStrategy => {
    switch (provider) {
        case 'alby': return new AlbyWallet()
        default: throw new Error(`Unknown provider: ${provider}`)
    }
}