'use client'

import React, { useState, useRef } from 'react'
import { useAssets } from './use-assets'
import { FilterControls } from './filter-controls'
import { AssetsDisplay } from './assets-display'
import { DesktopHeader } from '../layout/header'
import { useFilteredAssets } from './use-filtered-assets'

export const AssetsMarketplace = () => {
    const { assets, isItemLoaded, loadMoreItems } = useAssets();
    const [isGridView, setIsGridView] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("price");
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredAssets = useFilteredAssets(assets, searchTerm, "All", sortBy);

    return (
        <div className="flex flex-col h-full bg-background">
            <DesktopHeader />
            <FilterControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortBy={sortBy}
                setSortBy={setSortBy}
                isGridView={isGridView}
                setIsGridView={setIsGridView}
            />
            <AssetsDisplay
                filteredAssets={filteredAssets}
                isGridView={isGridView}
                isItemLoaded={isItemLoaded}
                loadMoreItems={loadMoreItems}
                containerRef={containerRef}
            />
        </div>
    );
}
