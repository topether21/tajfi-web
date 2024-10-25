import { WalletAssets } from '@/components/containers/wallet/wallet-assets'
import { Skeleton } from '@/components/ui/skeleton'
import React, { Suspense } from 'react'

export default function Marketplace() {
  return (
    <div className="h-screen flex flex-col">
      <Suspense
        fallback={
          <div className="flex-grow flex items-center justify-center">
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        }
      >
        <WalletAssets />
      </Suspense>
    </div>
  )
}
