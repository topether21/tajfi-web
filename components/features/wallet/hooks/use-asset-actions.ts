import {
	type BuyAssetCompleteBody,
	type BuyAssetStartBody,
	type SellAssetCompleteBody,
	type SellAssetStartBody,
	buyAssetComplete,
	buyAssetStart,
	sellAssetComplete,
	sellAssetStart,
} from "@/libs/wallet/api";
import { useState } from "react";
import { useAsyncFn } from "react-use";

export const useAssetActions = () => {
	const [errorMessage, setErrorMessage] = useState<string>("");

	const [{ loading: loadingSellStart, value: sellStartData }, sellStart] =
		useAsyncFn(async (body: SellAssetStartBody) => {
			setErrorMessage("");
			try {
				const res = await sellAssetStart(body);
				return res;
			} catch (error) {
				const message = (error as Error).message || "Unknown error";
				setErrorMessage(message);
				return null;
			}
		}, []);

	const [
		{ loading: loadingSellComplete, value: sellCompleteData },
		sellComplete,
	] = useAsyncFn(async (body: SellAssetCompleteBody) => {
		setErrorMessage("");
		try {
			const res = await sellAssetComplete(body);
			return res;
		} catch (error) {
			const message = (error as Error).message || "Unknown error";
			setErrorMessage(message);
			return null;
		}
	}, []);

	const [{ loading: loadingBuyStart, value: buyStartData }, buyStart] =
		useAsyncFn(async (body: BuyAssetStartBody) => {
			setErrorMessage("");
			try {
				const res = await buyAssetStart(body);
				return res;
			} catch (error) {
				const message = (error as Error).message || "Unknown error";
				setErrorMessage(message);
				return null;
			}
		}, []);

	const [{ loading: loadingBuyComplete, value: buyCompleteData }, buyComplete] =
		useAsyncFn(async (body: BuyAssetCompleteBody) => {
			setErrorMessage("");
			try {
				const res = await buyAssetComplete(body);
				return res;
			} catch (error) {
				const message = (error as Error).message || "Unknown error";
				setErrorMessage(message);
				return null;
			}
		}, []);

	const isLoading =
		loadingSellStart ||
		loadingSellComplete ||
		loadingBuyStart ||
		loadingBuyComplete ||
		false;

	const reset = () => {
		setErrorMessage("");
	};

	return {
		sellStart,
		sellStartData,
		sellComplete,
		sellCompleteData,
		buyStart,
		buyStartData,
		buyComplete,
		buyCompleteData,
		isLoading,
		errorMessage,
		reset
	};
};
