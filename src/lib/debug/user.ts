import type { AssetBalance } from '@/hooks/use-balances'
import { DEBUG, KEY_DEBUG_BALANCES, KEY_DEBUG_TRANSFERS } from '../constants'
import type { HistoryTransaction } from '../wallet/api'

export const saveUserBalances = (balances: AssetBalance[], currencies: Map<string, string>) => {
    if (typeof window === 'undefined' || !DEBUG) return
    const value = JSON.stringify({
        userBalances: balances,
        currencies: Array.from(currencies.entries()),
    })
    localStorage.setItem(KEY_DEBUG_BALANCES, value)
}

export const saveUserTransfers = (transfers: HistoryTransaction[]) => {
    if (typeof window === 'undefined' || !DEBUG) return
    const value = JSON.stringify(transfers)
    localStorage.setItem(KEY_DEBUG_TRANSFERS, value)
}
