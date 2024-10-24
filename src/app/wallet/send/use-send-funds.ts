import { sendComplete, sendStart } from '@/lib/wallet/api'
import { useState } from 'react'
import { useAsyncFn } from 'react-use'

export const useSendFunds = () => {
  const [errorMessage, setErrorMessage] = useState('')
  const [{ loading: loadingStart, error: errorStart, value: fundedPsbt }, sendFundsStart] = useAsyncFn(
    async (invoice: string) => {
      console.log('sending funds')
      setErrorMessage('')
      if (!invoice.trim()) return null
      try {
        const res = await sendStart({ invoice })
        return res.funded_psbt
      } catch (e) {
        setErrorMessage((e as Error).message)
        return null
      }
    },
  )
  const [{ loading: loadingComplete, error: errorComplete, value: valueComplete }, sendFundsComplete] = useAsyncFn(
    async (psbt: string) => {
      console.log('sending funds')
      setErrorMessage('')
      if (!psbt.trim()) return null
      try {
        const res = await sendComplete({ psbt })
        return res
      } catch (e) {
        setErrorMessage((e as Error).message)
        return null
      }
    },
  )
  return {
    loading: loadingStart || loadingComplete,
    error: errorMessage || errorComplete?.message || errorStart?.message,
    fundedPsbt: fundedPsbt ?? null,
    sentTransaction: valueComplete ?? null,
    sendFundsStart,
    sendFundsComplete,
  }
}
