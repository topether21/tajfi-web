import { listOrders } from "@/libs/wallet/api";
import useSWR from "swr";

export const useOrders = () => {
	const fetcher = () =>
		listOrders().then((data) => {
			return data;
		});

	const { data: orders = [], error } = useSWR("orders", fetcher, {
		refreshInterval: 5000,
	});

	const loading = !error && orders?.length === 0;

	return {
		orders: orders || [],
		loading,
		error,
	};
};
