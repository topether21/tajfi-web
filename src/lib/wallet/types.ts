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

export type WalletProvider = 'alby' | 'unisat' | 'xverse' | 'metaMask' | 'keyone'
