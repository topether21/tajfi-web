import { Send, Download, History, Wallet } from 'lucide-react'
import Link from 'next/link'
import { CurrencySelector } from './currency_selector/currency-selector'
import NumberFlow from '@number-flow/react'
import { Skeleton } from '@/components/ui/skeleton'
import type { AssetBalance } from '@/hooks/use-balances'
import { useState } from 'react'
import { motion } from 'framer-motion'

const ActionButton = ({
  Icon,
  label,
  href,
  setActiveAction,
  isActive,
}: {
  Icon: React.ElementType
  label: string
  href: string
  setActiveAction: React.Dispatch<React.SetStateAction<string | null>>
  isActive: boolean
}) => {
  return (
    <Link href={href} passHref>
      <motion.div
        onClick={() => setActiveAction(label)}
        className="flex flex-col items-center focus:outline-none relative z-10"
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      >
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
          <Icon size={24} color="white" />
        </div>
        <p className={`text-sm mt-2 ${isActive ? 'text-primary' : 'text-white'}`}>{label}</p>
      </motion.div>
    </Link>
  )
}

export const DesktopWalletHeader = ({ balances, loading }: { balances: AssetBalance[]; loading: boolean }) => {
  const [currentBalanceIndex, setCurrentBalanceIndex] = useState(0)
  const [activeAction, setActiveAction] = useState<string | null>(null)

  return (
    <div className="hidden md:block bg-background text-white px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-around mt-8 relative">
          <ActionButton
            Icon={Send}
            label="Send"
            href="/wallet/send"
            isActive={activeAction === 'Send'}
            setActiveAction={setActiveAction}
          />
          <ActionButton
            Icon={Download}
            label="Receive"
            href="/wallet/receive"
            isActive={activeAction === 'Receive'}
            setActiveAction={setActiveAction}
          />
          <ActionButton
            Icon={History}
            label="History"
            href="/wallet/history"
            isActive={activeAction === 'History'}
            setActiveAction={setActiveAction}
          />
          <ActionButton
            Icon={Wallet}
            label="Marketplace"
            href="/wallet/marketplace"
            isActive={activeAction === 'Marketplace'}
            setActiveAction={setActiveAction}
          />
        </div>
        {loading || !balances ? (
          <Skeleton className="h-12 w-full rounded-md" />
        ) : balances.length > 0 ? (
          <>
            <div className="flex justify-around py-4">
              <CurrencySelector balances={balances} setCurrentBalanceIndex={setCurrentBalanceIndex} />
            </div>
            <div className="flex justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-400 text-center">Your balance</p>
                {typeof balances?.[currentBalanceIndex]?.balance === 'number' ? (
                  <NumberFlow
                    value={balances[currentBalanceIndex].balance}
                    trend={false}
                    className="text-3xl font-bold text-green-500 mb-2 items-center"
                  />
                ) : (
                  <p className="text-3xl font-bold text-green-500 mb-2">--</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center pt-10 pb-4">
              <p className="text-center text-xl text-green-500">No currencies available</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
