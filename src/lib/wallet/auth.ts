'use client'
import { AUTH_MESSAGE } from '../constants'
import { auth } from './api'
import { getProviderStrategy } from './providers/index'
import type { WalletProvider } from './types'

export const connectWallet = async (providerName: WalletProvider) => {
  const walletProvider = getProviderStrategy(providerName)
  const { ordinalsPublicKey, ordinalsAddress } = await walletProvider.getKeys()
  console.log({ ordinalsPublicKey, ordinalsAddress })
  const signature = await walletProvider.signSimpleMessage(AUTH_MESSAGE, {
    address: ordinalsAddress,
    publicKey: ordinalsPublicKey,
  }) ?? ''
  // const signature = 'valid_signature'
  console.log('signature', signature)
  const serverAuthResponse = await auth({
    ordinalsPublicKey,
    signature,
    message: AUTH_MESSAGE,
  })
  localStorage.setItem('authToken', serverAuthResponse.token)

  const token = serverAuthResponse.token || ''
  const walletData = {
    providerName,
    ordinalsPublicKey,
    ordinalsAddress,
    token,
  }

  return walletData
}

export const disconnectWallet = () => {
  localStorage.removeItem('walletData')
  localStorage.removeItem('authToken')
}
