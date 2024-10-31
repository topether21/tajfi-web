'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Wallet, Coins, Sparkles, Rocket, Zap, X } from 'lucide-react'

export const WalletModal = () => {
  const wallets = [
    { name: 'MetaMask', icon: Wallet },
    { name: 'Ordswap', icon: Coins },
    { name: 'Generative', icon: Sparkles },
    { name: 'UniSat', icon: Rocket },
    { name: 'Alby', icon: Zap },
    { name: 'Xverse', icon: X },
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full max-w-sm">
          Connect Wallet
        </Button>
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
                onClick={() => console.log(`Connecting to ${wallet.name}...`)}
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
