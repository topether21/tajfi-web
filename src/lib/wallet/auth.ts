'use client'
import { auth } from './api'

declare global {
  interface Window {
    nostr?: {
      enable: () => Promise<void>
      getPublicKey: () => Promise<string>
      signSchnorr: (hex: string) => Promise<string>
    }
  }
}

export type WalletKeys = {
  ordinalsPublicKey: string
  token: string
}

const getNostrPubKey = async () => {
  if (window?.nostr?.enable) {
    await window.nostr.enable()
  } else {
    throw new Error(
      "Oops, it looks like you haven't set up your Nostr key yet." +
        'Go to your Alby Account Settings and create or import a Nostr key.',
    )
  }
  return window.nostr.getPublicKey()
}

export const connectWallet = async (provider = '') => {
  const walletName = provider?.split('.')[0] || 'alby'

  const ordinalsPublicKey = await getNostrPubKey()
  const serverAuthResponse = await auth(ordinalsPublicKey)
  localStorage.setItem('authToken', serverAuthResponse.token)

  const token = serverAuthResponse.token || ''
  const walletData = {
    walletName,
    ordinalsPublicKey,
    token,
  }

  return walletData
}

export const disconnectWallet = () => {
  localStorage.removeItem('walletData')
  localStorage.removeItem('authToken')
}
