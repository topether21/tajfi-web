import useSWR from 'swr'
import { listTransfers } from '@/lib/wallet/api'
import { saveUserTransfers } from '@/lib/debug/user'

export const useHistory = () => {
  const fetcher = () =>
    listTransfers().then((data) => {
      saveUserTransfers(data)
      return data
    })

  const { data: transfers = [], error } = useSWR('wallet-transfers', fetcher, {
    refreshInterval: 5000,
  })

  const loading = !error && transfers.length === 0

  return {
    transfers,
    loading,
    error,
  }
}
