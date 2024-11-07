'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { useState, useRef, useEffect } from 'react'
import { QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useInvoiceDetails } from '@/hooks/use-invoice-details'
import { Currency } from '@/components/containers/wallet/currency_selector/currency-selector'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Suspense } from 'react'
import { useSendFunds } from './use-send-funds'
import { sendComplete } from '@/lib/wallet/api'
import { getProviderStrategy, } from '@/lib/wallet/providers/index'
import { useAuth } from '@/hooks/auth-context'
import { useBalances } from '@/hooks/use-balances'

const TransactionSummary = ({
  invoiceDetails,
  loading,
  invoice,
}: {
  invoiceDetails: { amount: number; assetId: string } | null
  loading: boolean
  invoice: string
}) => {
  const { loading: loadingSend, error: errorSend, preSignedData, sendFundsStart } = useSendFunds()
  const { currencies } = useBalances()

  console.log('TransactionSummary', { invoiceDetails, preSignedData })
  const [signingError, setSigningError] = useState('')
  const [sentTransaction, setSentTransaction] = useState(false)
  const { profile } = useAuth()

  const handleConfirm = async () => {
    if (!preSignedData || !profile) return
    try {
      setSigningError('')

      const walletProvider = getProviderStrategy(profile.providerName)
      const signatureHex = await walletProvider.signTx(preSignedData.sighashHexToSign, { address: profile.tapasAddress })
      if (!signatureHex) {
        setSigningError('Failed to sign invoice')
        return
      }
      await sendComplete({ psbt: preSignedData.fundedPsbt, signature_hex: signatureHex, sighash: preSignedData.sighashHexToSign })
      setSentTransaction(true)
    } catch (e) {
      setSigningError((e as Error).message || 'Failed to send transaction')
      setSentTransaction(false)
    }
  }

  // TODO: is it necessary? We can improve this
  useEffect(() => {
    if (invoiceDetails && invoice) {
      sendFundsStart(invoice)
    }
  }, [invoiceDetails, invoice])

  const error = errorSend || signingError

  if (!invoiceDetails) return null

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Transaction Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
          <span className="text-lg font-medium">Amount:</span>
          <span className="text-2xl font-bold">{invoiceDetails?.amount}</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
          <span className="text-lg font-medium">Currency:</span>
          <div>
            <Currency name={currencies.get(invoiceDetails.assetId)} size='sm' />
          </div>
        </div>
        {!sentTransaction && !error && (
          <div className="flex items-center text-yellow-600 dark:text-yellow-400">
            <AlertCircle className="mr-2" />
            <span className="text-xs">Please review the details before confirming.</span>
          </div>
        )}
        {sentTransaction && (
          <div className="flex items-center text-green-600 dark:text-green-400">
            <CheckCircle2 className="mr-2" />
            <span>Transaction confirmed.</span>
          </div>
        )}
        {error && (
          <div className="flex items-center text-red-600 dark:text-red-400">
            <AlertCircle className="mr-2" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full text-lg"
          size="lg"
          onClick={handleConfirm}
          disabled={!preSignedData || Boolean(sentTransaction)}
        >
          {sentTransaction ? 'Sent' : 'Confirm'}
          {!sentTransaction && <ArrowRight className="ml-2" />}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function SendPage() {
  const [invoice, setInvoice] = useState('')
  const { loading, invoiceDetails, error, fetchInvoiceDetails } = useInvoiceDetails()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInvoice = e.target.value
    console.log({ newInvoice })
    setInvoice(newInvoice)
    fetchInvoiceDetails(newInvoice)
  }

  return (
    <div className="flex flex-col items-center justify-start h-full text-foreground">
      <h1 className="text-2xl font-bold mb-4">Send Funds</h1>
      <div className="w-full max-w-md py-4">
        <div className="mb-6">
          <label htmlFor="send-invoice" className="block text-base font-medium mb-1">
            Your invoice
          </label>
          <div className="flex items-center pb-2">
            <Input
              ref={inputRef}
              id="send-invoice"
              className="flex-grow text-xl font-light bg-transparent border-none text-white p-0 h-auto no-arrows focus:outline-none ring-2 ring-gray-800"
              value={invoice}
              onChange={handleInvoiceChange}
            />
            <QrCode className="ml-2" />
          </div>
          <Suspense fallback={<Skeleton className="h-24 w-full rounded-md" />}>
            <TransactionSummary invoiceDetails={invoiceDetails} loading={loading} invoice={invoice} />
          </Suspense>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  )
}
