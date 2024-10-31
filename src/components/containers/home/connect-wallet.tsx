'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Wallet, Sparkles, Rocket, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { MotionDiv } from '../shared'
import { useAuth } from '@/lib/auth-context'
import type { WalletProvider } from '@/lib/wallet/auth'

export const useWalletAuth = ({ onCancel }: { onCancel?: () => void }) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const { profile, login, logout } = useAuth()
  const router = useRouter()

  const handleConnectWallet = async (walletProvider: WalletProvider) => {
    try {
      setIsConnecting(true)
      console.log('Wallet connected!')
      await login(walletProvider)
      setIsConnecting(false)
      router.push('/wallet/send')
    } catch (error) {
      console.error(error)
    } finally {
      setIsConnecting(false)
      onCancel?.()
    }
  }

  const handleLogout = () => {
    logout()
    console.log('Logged out!')
    router.push('/')
  }

  return {
    isConnecting,
    profile,
    handleConnectWallet,
    handleLogout,
  }
}

interface ConnectWalletModalProps {
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  isHero?: boolean
}

export const ConnectWalletButton: React.FC<ConnectWalletModalProps> = ({
  size = 'default',
  onClick,
  isHero = false,
}) => {
  const { handleLogout, isConnecting, profile } = useWalletAuth({ onCancel: onClick })

  if (profile) {
    return (
      <Button
        size={isHero ? 'lg' : size}
        onClick={handleLogout}
        className={cn(
          isHero
            ? 'mt-8 px-10 py-5 bg-primary text-white text-xl font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-primary-dark hover:shadow-xl'
            : '',
        )}
      >
        Logout
      </Button>
    )
  }

  return (
    <Button
      size={isHero ? 'lg' : size}
      onClick={onClick}
      disabled={isConnecting}
      className={cn(
        isHero
          ? 'mt-8 px-10 py-5 bg-primary text-white text-xl font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-primary-dark hover:shadow-xl'
          : '',
      )}
    >
      {isConnecting ? (
        <>
          <MotionDiv
            className="w-4 h-4 border-t-2 border-r-2 border-white rounded-full mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
          />
          Connecting...
        </>
      ) : (
        <>
          {!isHero && <Wallet className="w-4 h-4 mr-2" />}
          Connect Wallet
        </>
      )}
    </Button>
  )
}

export const ConnectWalletModal = ({ isHero }: { isHero?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }
  const { handleConnectWallet } = useWalletAuth({ onCancel: closeModal })

  const wallets = [
    { name: 'alby' as WalletProvider, icon: Wallet },
    { name: 'xverse' as WalletProvider, icon: Sparkles },
    { name: 'metaMask' as WalletProvider, icon: Rocket },
    { name: 'keyone' as WalletProvider, icon: Zap },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <ConnectWalletButton onClick={openModal} isHero={isHero} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Choose your wallet</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 p-4">
          {wallets.map((wallet) => {
            const IconComponent = wallet.icon
            return (
              <Button
                key={wallet.name}
                variant="outline"
                className="flex flex-col items-center justify-center gap-2 h-24 hover:bg-primary/5"
                onClick={() => handleConnectWallet(wallet.name)}
              >
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                  <IconComponent className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">{wallet.name}</span>
              </Button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
