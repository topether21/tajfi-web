"use client";

import React, { useState, useRef } from "react";

import { Box } from "@/components/ui/box";
import { AssetsDisplay } from "./assets-display";
import { FilterControls } from "./filter-controls";
import type { AssetsMarketplaceProps } from "./types";
import { useFilteredAssets } from "./use-filtered-assets";

export const AssetsMarketplace = ({
	assets,
	isItemLoaded,
	loadMoreItems,
	isOwner,
}: AssetsMarketplaceProps) => {
	const [isGridView, setIsGridView] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("price");
	const containerRef = useRef<HTMLDivElement>(null);

	const filteredAssets = useFilteredAssets(assets, searchTerm, "All", sortBy);

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
			/>
			<AssetsDisplay
				isOwner={isOwner}
				filteredAssets={filteredAssets}
				isGridView={isGridView}
				isItemLoaded={isItemLoaded}
				loadMoreItems={loadMoreItems}
				containerRef={containerRef}
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
