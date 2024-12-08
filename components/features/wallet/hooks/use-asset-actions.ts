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
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const [{ loading: loadingSellStart, value: sellStartData }, sellStart] =
		useAsyncFn(async (body: SellAssetStartBody) => {
			setErrorMessage(null);
			try {
				const res = await sellAssetStart(body);
				debugger;
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
		setErrorMessage(null);
		try {
			const res = await sellAssetComplete(body);
			debugger;
			return res;
		} catch (error) {
			const message = (error as Error).message || "Unknown error";
			setErrorMessage(message);
			return null;
		}
	}, []);

	const [{ loading: loadingBuyStart, value: buyStartData }, buyStart] =
		useAsyncFn(async (body: BuyAssetStartBody) => {
			setErrorMessage(null);
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
			setErrorMessage(null);
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
	};
};
