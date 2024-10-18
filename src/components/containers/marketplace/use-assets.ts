import { useState, useCallback, useEffect, useRef } from 'react';

export type Asset = {
    id: number;
    name: string;
    price: number;
    image: string;
    satoshiPrice: number;
    ordinalNumber: number;
    categories: string[];
};

const LOADING = 1;
const LOADED = 2;

const fetchAssets = async (start: number, size: number) => {
    console.log("fetching assets", start, size);
    return Array.from({ length: size }, (_, index) => {
        const id = start + index;
        return {
            id,
            name: `Asset ${id}`,
            price: Math.floor(Math.random() * 100) / 100,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id + 1}.png`,
            satoshiPrice: 100000000,
            ordinalNumber: 1,
            categories: ["normal"],
        };
    });
};

const PAGE_SIZE = 20;
const INITIAL_LOAD_SIZE = 20;
const MAX_ITEMS = 200;

export const useAssets = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemStatusMap = useRef<{ [key: number]: number }>({}).current;

    const isItemLoaded = (index: number) => !!itemStatusMap[index];

    const loadMoreItems = useCallback(async () => {
        if (assets.length >= MAX_ITEMS) {
            console.log("Maximum number of items reached");
            return;
        }

        const startIndex = currentIndex;
        const stopIndex = Math.min(startIndex + PAGE_SIZE - 1, MAX_ITEMS - 1);
        console.log("loading more items", startIndex, stopIndex);

        for (let index = startIndex; index <= stopIndex; index++) {
            itemStatusMap[index] = LOADING;
        }

        const newAssets = await fetchAssets(startIndex, stopIndex - startIndex + 1);
        setAssets(prevAssets => [...prevAssets, ...newAssets]);

        for (let index = startIndex; index <= stopIndex; index++) {
            itemStatusMap[index] = LOADED;
        }

        setCurrentIndex(stopIndex + 1);
    }, [assets.length, currentIndex, itemStatusMap]);

    useEffect(() => {
        const loadInitialAssets = async () => {
            const initialAssets = await fetchAssets(0, INITIAL_LOAD_SIZE);
            setAssets(initialAssets);
            setCurrentIndex(INITIAL_LOAD_SIZE);
        };
        loadInitialAssets();
    }, []);

    return { assets, isItemLoaded, loadMoreItems, currentIndex, categories: ["normal", "rare", "epic", "legendary"] };
};
