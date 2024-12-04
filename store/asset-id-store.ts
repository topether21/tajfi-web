import { atom } from "nanostores";

export const $assetId = atom<string>(
	process.env.EXPO_PUBLIC_DEFAULT_ASSET_ID || "",
);
export const setAssetId = (assetId: string) => $assetId.set(assetId);

export const $receiveAssetId = atom<string>(
	process.env.EXPO_PUBLIC_DEFAULT_ASSET_ID || "",
);
export const setReceiveAssetId = (assetId: string) =>
	$receiveAssetId.set(assetId);

export const resetReceiveAssetId = () =>
	$receiveAssetId.set(process.env.EXPO_PUBLIC_DEFAULT_ASSET_ID || "");

export const $checkoutAssetIds = atom<string[]>([]);
export const setCheckoutAssetIds = (assetIds: string[]) => $checkoutAssetIds.set(assetIds);
export const resetCheckoutAssetIds = () => $checkoutAssetIds.set([]);
export const addCheckoutAssetId = (assetId: string) =>
	$checkoutAssetIds.set([...$checkoutAssetIds.get(), assetId]);
export const removeCheckoutAssetId = (assetId: string) =>
	$checkoutAssetIds.set(
		$checkoutAssetIds.get().filter((id) => id !== assetId),
	);
