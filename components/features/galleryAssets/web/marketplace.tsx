"use client";

import React, { useState, useRef } from "react";

import { Box } from "@/components/ui/box";
import { useSharedValue } from "react-native-reanimated";
import type { GridOnScrollProps } from "react-window";
import { AssetsDisplay } from "./assets-display";
import { FilterControls } from "./filter-controls";
import { useFilteredAssets } from "./use-filtered-assets";
import type { Asset } from "./use-assets";

export type AssetsMarketplaceProps = {
	assets: Asset[];
	isItemLoaded: (index: number) => boolean;
	loadMoreItems: (startIndex: number, stopIndex: number) => Promise<void>;
};

export const AssetsMarketplace = ({
	assets,
	isItemLoaded,
	loadMoreItems,
}: AssetsMarketplaceProps) => {
	const [isGridView, setIsGridView] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("All");
	const containerRef = useRef<HTMLDivElement>(null);
	const filteredAssets = useFilteredAssets(assets, searchTerm, sortBy);
	const y = useSharedValue(0);

	const scrollHandler = (event: GridOnScrollProps) => {
		console.log("scroll", event);
		y.set(event.scrollTop);
	};

	return (
		<Box className="flex flex-col h-full bg-background">
			<FilterControls
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				sortBy={sortBy}
				setSortBy={setSortBy}
				isGridView={isGridView}
				setIsGridView={setIsGridView}
				totalItems={assets.length}
				y={y}
			/>
			<AssetsDisplay
				filteredAssets={filteredAssets}
				isGridView={isGridView}
				isItemLoaded={isItemLoaded}
				loadMoreItems={loadMoreItems}
				containerRef={containerRef}
				scrollHandler={scrollHandler}
			/>
			{/* <Fab
        size="lg"
        className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800"
      >
        <FabIcon as={ShoppingCartIcon} className="h-4 w-4 stroke-background-tajfi-white" />
      </Fab> */}
			{/* <Fab
        size="lg"
        className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800"
      >
        <Box className="relative flex items-center justify-center">
          <Text className="absolute bottom-3 left-2 rounded-full text-xs text-background-tajfi-white">
            {totalItems}
          </Text>
          <FabIcon as={ShoppingCartIcon} className="h-4 w-4 stroke-background-tajfi-white" />
        </Box>
      </Fab> */}
		</Box>
	);
};
