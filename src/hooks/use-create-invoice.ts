import { receive } from '@/lib/wallet/api'
import { useState } from 'react'
import { useAsyncFn, useDebounce } from 'react-use'

export const useCreateInvoice = (amount: number | '', assetId: string | undefined) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [{ loading, error, value }, createNewInvoice] = useAsyncFn(
    async ({ amount, assetId }: { amount: number; assetId: string }) => {
      console.log('creating invoice')
      setErrorMessage('')
      if (!amount || !assetId) return null
      try {
        const response = await receive({ amount, assetId })
        return response
      } catch (e) {
        setErrorMessage('Failed to create invoice')
        return null
      }
    },
  )
  useDebounce(
    () => {
      if (amount === '' || !assetId) return
      createNewInvoice({ amount: Number(amount), assetId })
    },
    1000,
    [amount, assetId],
  )
  return { loading, error: errorMessage || error?.message, invoice: value ?? null }
}
