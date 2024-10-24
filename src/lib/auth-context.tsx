'use client'

import type { ReactNode } from 'react'
import type React from 'react'
import { createContext, useContext, useMemo, useState } from 'react'
import { connectWallet, disconnectWallet, type WalletKeys } from './wallet/auth'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface AuthContextType {
  profile: WalletKeys | null
  login: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<WalletKeys | null>(null)
  const [error, setError] = useState<string | null>(null)

  const login = async () => {
    try {
      const wallet = await connectWallet()
      setProfile(wallet)
      setError(null)
    } catch (err) {
      const errorMessage = (err as Error).message.includes('Nostr key') ? 'nostrKeyError' : 'genericError'
      setError(errorMessage)
    }
  }

  const logout = () => {
    setProfile(null)
    disconnectWallet()
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: only profile is changing
  const auth = useMemo(() => ({ profile, login, logout }), [profile])

  console.log('----> profile', profile)

  return (
    <>
      <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
      {error && (
        <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Error</AlertDialogTitle>
              <AlertDialogDescription>
                {error === 'nostrKeyError' ? (
                  <>
                    Please go to your Alby Account Settings and create or import a Nostr key. You can also install the
                    Alby extension from{' '}
                    <a
                      href="https://chromewebstore.google.com/detail/alby-bitcoin-wallet-for-l/iokeahhehimjnekafflcihljlcjccdbe?hl=en"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-foreground text-underline font-bold"
                    >
                      here
                    </a>
                    .
                  </>
                ) : (
                  'Failed to connect wallet. Please try again.'
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setError(null)}>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
