import { listTransfers } from "@/libs/wallet/api";
import useSWR from "swr";

export const useHistory = () => {
	const fetcher = () =>
		listTransfers().then((data) => {
			return data;
		});

	const { data: transfers = [], error, isLoading } = useSWR("wallet-transfers", fetcher, {
		refreshInterval: 5000,
	});

	return {
		transfers: transfers || [],
		loading: isLoading,
		error,
	};
};
