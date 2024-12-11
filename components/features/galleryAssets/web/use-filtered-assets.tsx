import { useMemo } from "react";
import type { Asset } from "./use-assets";

// TODO: Implement this
export const useFilteredAssets = (
	assets: Asset[],
	searchTerm: string,
	sortBy: string,
) => {
	/// TODO: remove memo
	return useMemo(() => {
		let filteredAssets = assets;

		if (searchTerm) {
			filteredAssets = filteredAssets.filter((asset) =>
				asset.name.toLowerCase().includes(searchTerm.toLowerCase()),
			);
		}

		if (sortBy === "price") {
			filteredAssets = [...filteredAssets].sort((a, b) => a.amount - b.amount);
		}

		return filteredAssets;
	}, [assets, searchTerm, sortBy]);
};

// export const useFilteredAssets = (
// 	assets: Asset[],
// 	searchTerm: string,
// 	category: string,
// 	sortBy: string,
// ) => {
// 	return assets;
// };
