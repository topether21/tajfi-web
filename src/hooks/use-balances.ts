import useSWR from 'swr';
import { listBalances } from "@/lib/wallet/api";

export type AssetBalance = {
    balance: number;
    name: string;
    assetId: string;
}

export const useBalances = () => {
    const fetcher = () => listBalances().then(data => {
        const balances = Object.entries(data.asset_balances).reduce((acc, [assetId, balance]) => {
            if (balance.asset_genesis.asset_type === 'COLLECTIBLE') {
                return acc;
            }
            const assetBalance = {
                balance: Number(balance.balance),
                name: balance.asset_genesis.name,
                assetId,
            };

            if (balance.asset_genesis.name === 'tether') {
                acc.unshift(assetBalance);
            } else {
                acc.push(assetBalance);
            }

            return acc;
        }, [] as AssetBalance[]);

        return balances;
    });

    const { data: balances = [], error } = useSWR('wallet-balance', fetcher, {
        refreshInterval: 4000
    });

    const loading = !error && balances.length === 0;
    const currencies = balances.map(balance => balance.assetId);

    return {
        balances,
        currencies,
        loading,
        error,
    };
};
