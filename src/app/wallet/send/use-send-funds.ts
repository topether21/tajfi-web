import { sendComplete, sendStart } from '@/lib/wallet/api'
import { useState } from 'react'
import { useAsyncFn } from 'react-use'

export const useSendFunds = () => {
  const [errorMessage, setErrorMessage] = useState('')
  const [{ loading: loadingStart, error: errorStart, value: preSignedData }, sendFundsStart] = useAsyncFn(
    async (invoice: string) => {
      console.log('sending funds')
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
  const [{ loading: loadingComplete, error: errorComplete, value: valueComplete }, sendFundsComplete] = useAsyncFn(
    async ({ fundedPsbt, signatureHex }: { fundedPsbt: string; signatureHex: string }) => {
      console.log('sending funds')
      setErrorMessage('')
      if (!fundedPsbt.trim()) return null
      try {
        const res = await sendComplete({ psbt: fundedPsbt, signature_hex: signatureHex })
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
    preSignedData: preSignedData ?? null,
    sentTransaction: valueComplete ?? null,
    sendFundsStart,
    sendFundsComplete,
  }
}
