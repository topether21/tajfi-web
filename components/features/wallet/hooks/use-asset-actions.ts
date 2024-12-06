import {
	type SellAssetCompleteBody,
	type SellAssetStartBody,
	sellAssetComplete,
	sellAssetStart,
} from "@/libs/wallet/api";
import { useState } from "react";
import { useAsyncFn } from "react-use";

export const useAssetActions = () => {
	const [error, setError] = useState<string | null>(null);

	const [{ loading: loadingSellStart, value: sellStartData }, sellStart] =
		useAsyncFn(async (body: SellAssetStartBody) => {
			setError(null);
			try {
				return await sellAssetStart(body);
			} catch (error) {
				const message = (error as Error).message || "Unknown error";
				setError(message);
				return null;
			}
		}, []);

	const [
		{ loading: loadingSellComplete, value: sellCompleteData },
		sellComplete,
	] = useAsyncFn(async (body: SellAssetCompleteBody) => {
		setError(null);
		try {
			return await sellAssetComplete(body);
		} catch (error) {
			const message = (error as Error).message || "Unknown error";
			setError(message);
			return null;
		}
	}, []);

	const isLoading = loadingSellStart || loadingSellComplete || false;

	return {
		sellStart,
		sellStartData,
		sellComplete,
		sellCompleteData,
		isLoading,
		error,
	};
};
