declare global {
    interface Window {
        nostr?: {
            enable: () => Promise<void>
            getPublicKey: () => Promise<string>
            signSchnorr: (hex: string) => Promise<string>
        }
        unisat?: {
            signMessage: (message: string, type: string) => Promise<string>
        }
    }
}

export type WalletKeys = {
    ordinalsPublicKey: string
    ordinalsAddress: string
    token: string
    providerName: WalletProvider
}

export type WalletProvider = 'alby' | 'unisat' | 'xverse' | 'onekey' | 'metaMask'
