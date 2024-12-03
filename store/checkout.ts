import { atom } from "nanostores";

export const $checkoutAssetIds = atom<string[]>([]);
export const setCheckoutAssetIds = (assetIds: string[]) => $checkoutAssetIds.set(assetIds);
export const resetCheckoutAssetIds = () => $checkoutAssetIds.set([]);
export const addCheckoutAssetId = (assetId: string) =>
	$checkoutAssetIds.set([...$checkoutAssetIds.get(), assetId]);
export const removeCheckoutAssetId = (assetId: string) =>
	$checkoutAssetIds.set(
		$checkoutAssetIds.get().filter((id) => id !== assetId),
	);
