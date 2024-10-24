'use client'

import { ConnectWalletButton } from '@/components/containers/home/connect-wallet'
import { DesktopHeader } from '@/components/containers/layout/header'
import { MobileNavbar } from '@/components/containers/layout/mobile-navbar'
import { DesktopWalletHeader } from '@/components/containers/wallet/wallet-header'
import { Card } from '@/components/ui/card'
import { useBalances } from '@/hooks/use-balances'
import { useAuth } from '@/lib/auth-context'

const WalletLayout = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useAuth()
  const { balances, loading, currencies } = useBalances()
  return (
    <>
      <DesktopHeader />
      <div className="h-screen flex flex-col bg-background">
        {!profile && (
          <div className="flex flex-1 justify-center items-center">
            <ConnectWalletButton isHero />
          </div>
        )}
        {profile && (
          <>
            <DesktopWalletHeader balances={balances} loading={loading} />
            <Card className="w-full max-w-2xl mx-auto min-w-[300px] mt-6 pt-8">{children}</Card>
          </>
        )}
      </div>
      <MobileNavbar />
    </>
  )
}

export default WalletLayout
