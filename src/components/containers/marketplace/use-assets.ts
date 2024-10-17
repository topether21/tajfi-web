import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';

export type Asset = {
    id: number;
    name: string;
    price: number;
    image: string;
    satoshiPrice: number;
    ordinalNumber: number;
    types: string[];
};

const LOADING = 1;
const LOADED = 2;

const fetchAssets = async (start: number, size: number) => {
    console.log("fetching assets", start, size);
    const promises = Array.from({ length: size }, (_, index) => {
        const id = start + index + 1; // Pokémon API IDs start at 1
        return axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    });

    const responses = await Promise.all(promises);
    return responses.map((response, index) => {
        const pokemon = response.data;
        return {
            id: start + index,
            name: pokemon.name,
            price: Math.floor(Math.random() * 100) / 100,
            image: pokemon.sprites.front_default,
            satoshiPrice: 100000000,
            ordinalNumber: 1,
            types: ["normal"],
        };
    });
};

export const useAssets = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const itemStatusMap = useRef<{ [key: number]: number }>({}).current;

    const isItemLoaded = (index: number) => !!itemStatusMap[index];

    const loadMoreItems = useCallback(async (startIndex: number, stopIndex: number) => {
        for (let index = startIndex; index <= stopIndex; index++) {
            itemStatusMap[index] = LOADING;
        }
        const newAssets = await fetchAssets(startIndex, stopIndex - startIndex + 1);
        setAssets(prevAssets => [...prevAssets, ...newAssets]);
        for (let index = startIndex; index <= stopIndex; index++) {
            itemStatusMap[index] = LOADED;
        }
    }, [itemStatusMap]);

    useEffect(() => {
        const loadInitialAssets = async () => {
            const initialAssets = await fetchAssets(0, 100);
            setAssets(initialAssets);
        };
        loadInitialAssets();
    }, []);

    return { assets, isItemLoaded, loadMoreItems };
};