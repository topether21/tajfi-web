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
