import { writeFile } from "node:fs/promises";

type Asset = {
	id: number;
	name: string;
	price: number;
	image: string;
	satoshiPrice: number;
	ordinalNumber: number;
};

const fetchAssets = async (start: number, size: number): Promise<Asset[]> => {
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

const TOTAL_ITEMS = 500;

const saveAssetsToJson = async () => {
	try {
		const assets = await fetchAssets(0, TOTAL_ITEMS);
		await writeFile("assets.json", JSON.stringify(assets, null, 2));
		console.log("Assets saved to assets.json");
	} catch (error) {
		console.error("Error saving assets:", error);
	}
};

saveAssetsToJson();
