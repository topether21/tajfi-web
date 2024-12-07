import { listBalances } from "@/libs/wallet/api";
import { useCallback, useState } from "react";
import useSWR from "swr";

export type AssetBalance = {
	amount: number;
	name: string;
	assetId: string;
};

export const useBalances = () => {
	console.log("useBalances");
	const [isRefreshing, setIsRefreshing] = useState(true);

	const fetcher = () =>
		listBalances().then((data) => {
			const balances = Object.entries(data.asset_balances).reduce(
				(acc, [assetId, balance]) => {
					if (balance.asset_genesis.asset_type === "COLLECTIBLE") return acc;
					const assetBalance = {
						amount: Number(balance.balance),
						name: balance.asset_genesis.name,
						assetId,
					};

					if (
						balance.asset_genesis.name ===
						process.env.EXPO_PUBLIC_DEFAULT_ASSET_NAME
					) {
						acc.unshift(assetBalance);
					} else {
						acc.push(assetBalance);
					}

					return acc;
				},
				[] as AssetBalance[],
			);

			const currencies = new Map(
				balances.map((balance) => [balance.assetId, balance.name]),
			);
			const response = { userBalances: balances, currencies };
			return response;
		});

	const {
		data: balances = {
			userBalances: [
				{
					amount: 0,
					name: process.env.EXPO_PUBLIC_DEFAULT_ASSET_NAME,
					assetId: process.env.EXPO_PUBLIC_DEFAULT_ASSET_ID,
				},
			],
			currencies: new Map<string, string>(),
		},
		error,
	} = useSWR("wallet-balance", fetcher, {
		refreshInterval: isRefreshing ? 4000 : 0,
	});

	const loading = !error && balances.userBalances.length === 0;
	const currencies = balances.currencies;

	const startRefreshing = useCallback(() => {
		console.log("startRefreshing");
	}, []);
	const stopRefreshing = useCallback(() => {
		console.log("stopRefreshing");
		setIsRefreshing(false);
	}, []);

	return {
		userBalances: balances.userBalances,
		currencies,
		loading,
		error,
		startRefreshing,
		stopRefreshing,
	};
};
