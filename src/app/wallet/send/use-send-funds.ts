import { sendStart } from '@/lib/wallet/api'
import { useState } from 'react'
import { useAsyncFn } from 'react-use'

export const useSendFunds = () => {
  const [errorMessage, setErrorMessage] = useState('')
  const [{ loading: loadingStart, error: errorStart, value: preSignedData }, sendFundsStart] = useAsyncFn(
    async (invoice: string) => {
      console.log('sending funds sendFundsStart', invoice)
      setErrorMessage('')
      if (!invoice.trim()) return null
      try {
        const res = await sendStart({ invoice })
        return {
          fundedPsbt: res.funded_psbt,
          sighashHexToSign: res.sighash_hex_to_sign,
        }
      } catch (e) {
        setErrorMessage((e as Error).message)
        return null
      }
    },
  )
  return {
    loading: loadingStart,
    error: errorMessage || errorStart?.message,
    preSignedData: preSignedData ?? null,
    sendFundsStart,
  }
}
