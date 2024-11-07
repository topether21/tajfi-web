'use client'

import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Currency } from '@/components/containers/wallet/currency_selector/currency-selector'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useBalances } from '@/hooks/use-balances'

import { useHistory } from '@/hooks/use-history'
import type { HistoryTransaction } from '@/lib/wallet/api'

const TransactionItem = ({ transaction, currencies }: { transaction: HistoryTransaction; currencies: Map<string, string> }) => {
  const isReceive = transaction.type === 'receive'
  const date = new Date(Number.parseInt(transaction.timestamp) * 1000)
  const formattedDate = date.toLocaleDateString()
  const formattedTime = date.toLocaleTimeString()
  const assetName = currencies.get(transaction.asset_id)

  return (
    <div className="flex items-center justify-between py-4 border-b last:border-b-0">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${isReceive ? 'bg-green-100' : 'bg-red-100'}`}>
          {isReceive ? (
            <ArrowDownLeft className="w-4 h-4 text-green-600" />
          ) : (
            <ArrowUpRight className="w-4 h-4 text-red-600" />
          )}
        </div>
        <div>
          <p className="text-base font-semibold">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center h-8 w-8">
                    <Currency name={assetName} size="sm" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{transaction.asset_id}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </p>
          <p className="text-sm text-gray-500">
            {formattedDate} {formattedTime}
          </p>
        </div>
      </div>
      <div className={`text-base font-semibold ${isReceive ? 'text-green-600' : 'text-red-600'}`}>
        {isReceive ? '+' : '-'}
        {transaction.amount}
      </div>
    </div>
  )
}

const HistoryPage = () => {
  const { transfers } = useHistory()
  const { currencies } = useBalances()
  return (
    <div className="flex flex-col items-center justify-start h-full text-foreground">
      <h1 className="text-2xl font-bold mb-4">Wallet History</h1>
      <div className="w-full max-w-md p-4 flex-grow">
        <ScrollArea className="h-full pr-4">
          {transfers.map((transaction) => (
            <TransactionItem key={transaction.txid} transaction={transaction} currencies={currencies} />
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}

export default HistoryPage
