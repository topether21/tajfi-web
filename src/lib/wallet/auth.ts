'use client'
import { AUTH_MESSAGE } from '../constants'
import { auth } from './api'
import { getWalletKeys, signBip322MessageSimple, signMessage } from './providers'
import type { WalletProvider } from './types'

export type WalletKeys = {
  ordinalsPublicKey: string
  token: string
  provider: WalletProvider
}

export const connectWallet = async (provider: WalletProvider) => {

  const { ordinalsPublicKey, ordinalsAddress } = await getWalletKeys(provider)
  debugger
  const signature = await signBip322MessageSimple(AUTH_MESSAGE, { provider, publicKey: ordinalsPublicKey }) ?? ''
  console.log('signature', signature)
  const serverAuthResponse = await auth({
    ordinalsPublicKey,
    signature,
    message: AUTH_MESSAGE,
  })
  localStorage.setItem('authToken', serverAuthResponse.token)

  const token = serverAuthResponse.token || ''
  const walletData = {
    walletName: provider,
    ordinalsPublicKey,
    token,
    provider,
  }

  return walletData
}

export const disconnectWallet = () => {
  localStorage.removeItem('walletData')
  localStorage.removeItem('authToken')
}
