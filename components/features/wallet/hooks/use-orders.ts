import { listOrders } from "@/libs/wallet/api";
import useSWR from "swr";

export const useOrders = () => {
	const fetcher = () =>
		listOrders().then((data) => {
			return data;
		});

	const {
		data: orders = [],
		error,
		isLoading,
	} = useSWR("orders", fetcher, {
		refreshInterval: 5000,
	});

	return {
		orders: orders || [],
		loading: isLoading,
		error,
	};
};
