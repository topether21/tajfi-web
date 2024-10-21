import useSWR from 'swr';
import { mockListBalances } from "@/lib/wallet/api";

export const useBalance = () => {
    const fetcher = () => mockListBalances().then(data => data.balance);
    const { data: balance = 0, error } = useSWR('wallet-balance', fetcher, {
        refreshInterval: 5000
    });

    const loading = !error && !balance;
    return {
        balance,
        loading,
        error,
    };
};
