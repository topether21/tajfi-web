import { create, type StateCreator } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { listBalances } from "@/libs/wallet/api";

export type AssetBalance = {
	amount: number;
	name: string;
	assetId: string;
};

type BalancesSlice = {
	userBalances: AssetBalance[];
	currencies: Map<string, string>;
	loading: boolean;
	error: Error | null;
	fetchBalances: () => Promise<void>;
};

type RefreshSlice = {
	isRefreshing: boolean;
	startRefreshing: () => void;
	stopRefreshing: () => void;
};

type StoreState = BalancesSlice & RefreshSlice;

const haveBalancesChanged = (
	newBalances: AssetBalance[],
	currentBalances: AssetBalance[]
): boolean => {
	return (
		newBalances.length !== currentBalances.length ||
		newBalances.some((newBalance, index) => {
			const currentBalance = currentBalances[index];
			return (
				currentBalance.assetId !== newBalance.assetId ||
				currentBalance.amount !== newBalance.amount ||
				currentBalance.name !== newBalance.name
			);
		})
	);
};

const haveCurrenciesChanged = (
	newCurrencies: Map<string, string>,
	currentCurrencies: Map<string, string>
): boolean => {
	return (
		newCurrencies.size !== currentCurrencies.size ||
		[...newCurrencies].some(
			([key, value]) => currentCurrencies.get(key) !== value
		)
	);
};

const createBalancesSlice: StateCreator<StoreState, [], [], BalancesSlice> = (
	set,
	get,
) => ({
	userBalances: [],
	currencies: new Map<string, string>(),
	loading: false,
	error: null,
	fetchBalances: async () => {
		try {
			set({ loading: true });
			const data = await listBalances();
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

			const newCurrencies = new Map(
				balances.map((balance) => [balance.assetId, balance.name]),
			);

			const currentBalances = get().userBalances;
			const currentCurrencies = get().currencies;

			const balancesChanged = haveBalancesChanged(balances, currentBalances);
			const currenciesChanged = haveCurrenciesChanged(newCurrencies, currentCurrencies);

			if (balancesChanged) {
				set({ userBalances: balances });
			}

			if (currenciesChanged) {
				set({ currencies: newCurrencies });
			}

			if (!balancesChanged && !currenciesChanged) {
				set({ error: null });
			}
		} catch (err) {
			set({ error: err as Error });
		} finally {
			set({ loading: false });
		}
	},
});

const createRefreshSlice: StateCreator<StoreState, [], [], RefreshSlice> = (
	set,
	get,
	_store,
) => {
	let refreshInterval: NodeJS.Timeout | null = null;
	// Start refreshing by default
	setTimeout(() => get().startRefreshing(), 0);
	return {
		isRefreshing: false,
		startRefreshing: () => {
			if (!get().isRefreshing) {
				set({ isRefreshing: true });
				get().fetchBalances(); // Fetch immediately
				refreshInterval = setInterval(get().fetchBalances, 4000);
			}
		},
		stopRefreshing: () => {
			if (get().isRefreshing) {
				set({ isRefreshing: false });
				if (refreshInterval) {
					clearInterval(refreshInterval);
					refreshInterval = null;
				}
			}
		},
	};
};

export const useBalancesStore = create<StoreState>((set, get, store) => ({
	...createBalancesSlice(set, get, store),
	...createRefreshSlice(set, get, store),
}));

export const useCurrencies = () => {
	const { currencies } = useBalancesStore(
		useShallow((state) => ({
			currencies: state.currencies,
		})),
	);
	return currencies;
};

export const useUserBalances = () => {
	const { userBalances } = useBalancesStore(
		useShallow((state) => ({
			userBalances: state.userBalances,
		})),
	);
	return userBalances;
};

export const useBalanceRefresh = () => {
	const { startRefreshing, stopRefreshing } = useBalancesStore(
		useShallow((state) => ({
			startRefreshing: state.startRefreshing,
			stopRefreshing: state.stopRefreshing,
		})),
	);
	return { startRefreshing, stopRefreshing };
};
