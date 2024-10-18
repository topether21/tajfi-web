import { useMemo } from 'react';
import { type Asset } from './use-assets';

export const useFilteredAssets = (assets: Asset[], searchTerm: string, category: string, sortBy: string) => {
    return useMemo(() => {
        let filteredAssets = assets;

        if (searchTerm) {
            filteredAssets = filteredAssets.filter(asset =>
                asset.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (category !== "All") {
            filteredAssets = filteredAssets.filter(asset => asset.categories.includes(category));
        }

        if (sortBy === "price") {
            filteredAssets.sort((a, b) => a.price - b.price);
        } else if (sortBy === "rarity") {
            filteredAssets.sort((a, b) => b.ordinalNumber - a.ordinalNumber);
        }

        return filteredAssets;
    }, [assets, searchTerm, category, sortBy]);
};