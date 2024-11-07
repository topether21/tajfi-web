declare global {
    interface Window {
        nostr?: {
            enable: () => Promise<void>
            getPublicKey: () => Promise<string>
            signSchnorr: (hex: string) => Promise<string>
        }
        unisat?: {
            signMessage: (message: string, type: string) => Promise<string>
            requestAccounts: () => Promise<string[]>
            getPublicKey: () => Promise<string>
        }
        ethereum?: {
            // TODO: specify the type
            request: (args: any) => Promise<any>
            selectedAddress: string
        }
    }
}

export type WalletKeys = {
    ordinalsPublicKey: string
    ordinalsAddress: string
    token: string
    providerName: WalletProvider
}

export type WalletProvider = 'alby' | 'oneKey' | 'webAuthn'
