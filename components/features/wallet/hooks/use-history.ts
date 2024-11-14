import { listTransfers } from "@/libs/wallet/api";
import useSWR from "swr";

export const useHistory = () => {
	const fetcher = () =>
		listTransfers().then((data) => {
			return data;
		});

	const { data: transfers = [], error } = useSWR("wallet-transfers", fetcher, {
		refreshInterval: 5000,
	});

	const loading = !error && transfers?.length === 0;

	return {
		transfers: transfers || [],
		loading,
		error,
	};
};
