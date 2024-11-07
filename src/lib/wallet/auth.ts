'use client'
import { AUTH_MESSAGE, KEY_AUTH_TOKEN, KEY_WALLET_DATA } from '../constants'
import { auth } from './api'
import { getProviderStrategy } from './providers/index'
import type { WebAuthnProvider } from './providers/web-authn/web-authn'
import type { WalletProvider } from './types'

export const connectWallet = async (providerName: WalletProvider) => {
  const walletProvider = getProviderStrategy(providerName)
  let tapasPublicKey = ''
  let tapasAddress = ''
  try {
    const keys = await walletProvider.getKeys()
    tapasPublicKey = keys.tapasPublicKey
    tapasAddress = keys.tapasAddress
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('web-authn: No wallet selected')) {
        const keys = await (walletProvider as unknown as WebAuthnProvider).createKeys({ walletName: 'Tajfi' })
        tapasPublicKey = keys.tapasPublicKey
        tapasAddress = keys.tapasAddress
      }
    }
  }
  console.log({ tapasPublicKey, tapasAddress })
  const signature = await walletProvider.signSimpleMessage(AUTH_MESSAGE, {
    address: tapasAddress,
    publicKey: tapasPublicKey,
  }) ?? ''
  // const signature = 'valid_signature'
  console.log('signature', signature)
  const serverAuthResponse = await auth({
    tapasPublicKey,
    signature,
    message: AUTH_MESSAGE,
  })
  localStorage.setItem(KEY_AUTH_TOKEN, serverAuthResponse.token)

  const token = serverAuthResponse.token || ''
  const walletData = {
    providerName,
    tapasPublicKey,
    tapasAddress,
    token,
  }

  return walletData
}

export const disconnectWallet = () => {
  localStorage.removeItem(KEY_WALLET_DATA)
  localStorage.removeItem(KEY_AUTH_TOKEN)
}
