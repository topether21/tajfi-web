'use client'

import { useState, useRef, useMemo } from 'react'
import { VariableSizeGrid as Grid, VariableSizeList as List } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { Grid as GridIcon, List as ListIcon } from 'lucide-react'
import { Toggle } from "@/components/ui/toggle"
import AutoSizer from 'react-virtualized-auto-sizer'
import { type Asset, useAssets } from './use-assets'
import { GridAssetItem } from './grid-asset-item';
import { ListAssetItem } from './list-asset-item';
import { CELL_PADDING, CELL_WIDTH, LIST_ITEM_HEIGHT, MIN_ROW_HEIGHT } from '../../../lib/constants'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Header } from '../layout/header'
import { MobileNavbar } from '../layout/mobile-navbar'
const calculateColumnCount = (width: number) => {
    return Math.max(1, Math.floor(width / (CELL_WIDTH + 2 * CELL_PADDING)));
}

const calculateColumnWidth = (width: number, columnCount: number) => {
    return Math.floor(width / columnCount);
}

export const useFilteredAssets = (assets: Asset[], searchTerm: string, category: string, sortBy: string) => {
    return useMemo(() => assets
        .filter(asset =>
            asset.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (category === "All" || asset.categories.includes(category))
        )
        .sort((a, b) => {
            if (sortBy === "price") return a.price - b.price;
            if (sortBy === "rarity") return b.ordinalNumber - a.ordinalNumber;
            return 0;
        }), [assets, searchTerm, category, sortBy]);
};

export const AssetsMarketplace = () => {
    const { assets, isItemLoaded, loadMoreItems, categories } = useAssets();
    const [isGridView, setIsGridView] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState(categories?.[0] ?? "All");
    const [sortBy, setSortBy] = useState("price");
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredAssets = useFilteredAssets(assets, searchTerm, category, sortBy);

    return (
        <div className="flex flex-col h-full bg-background">
            <Header />
            <div className="container mx-auto flex-col md:flex-row gap-4 p-4 bg-background border-b border-border hidden md:flex">
                <div className="relative flex-grow">
                    <Input
                        type="text"
                        placeholder="Search assets..."
                        className="pl-8 bg-input text-foreground border-border"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full md:w-[180px] bg-input text-foreground border-border">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-input text-foreground border-border">
                        {categories?.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-[180px] bg-input text-foreground border-border">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-input text-foreground border-border">
                        <SelectItem value="price">Price: Low to High</SelectItem>
                        <SelectItem value="rarity">Rarity: High to Low</SelectItem>
                    </SelectContent>
                </Select>
                <Toggle
                    pressed={isGridView}
                    onPressedChange={setIsGridView}
                    aria-label="Toggle view"
                >
                    {isGridView ? <GridIcon className="h-4 w-4 text-foreground" /> : <ListIcon className="h-4 w-4 text-foreground" />}
                </Toggle>
            </div>

            <div ref={containerRef} className="container mx-auto flex-grow overflow-auto bg-card">
                <AutoSizer>
                    {({ width, height }) => {
                        const columnCount = calculateColumnCount(width);
                        const columnWidth = calculateColumnWidth(width, columnCount);
                        const rowCount = Math.ceil(filteredAssets.length / columnCount);
                        return isGridView ? (
                            <InfiniteLoader
                                isItemLoaded={isItemLoaded}
                                itemCount={filteredAssets.length + 1}
                                loadMoreItems={loadMoreItems}
                            >
                                {({ onItemsRendered, ref }) => (
                                    <Grid
                                        columnCount={columnCount}
                                        columnWidth={() => columnWidth}
                                        height={height}
                                        rowCount={rowCount}
                                        rowHeight={() => MIN_ROW_HEIGHT}
                                        width={width}
                                        onItemsRendered={({ visibleRowStartIndex, visibleRowStopIndex, visibleColumnStartIndex, visibleColumnStopIndex }) => {
                                            onItemsRendered({
                                                overscanStartIndex: visibleRowStartIndex * columnCount + visibleColumnStartIndex,
                                                overscanStopIndex: visibleRowStopIndex * columnCount + visibleColumnStopIndex,
                                                visibleStartIndex: visibleRowStartIndex * columnCount + visibleColumnStartIndex,
                                                visibleStopIndex: visibleRowStopIndex * columnCount + visibleColumnStopIndex,
                                            });
                                        }}
                                        ref={ref}
                                    >
                                        {({ columnIndex, rowIndex, style }) => {
                                            const index = rowIndex * columnCount + columnIndex;
                                            if (index >= filteredAssets.length) return null;
                                            return (
                                                <div
                                                    style={{
                                                        ...style,
                                                        width: columnWidth,
                                                        height: MIN_ROW_HEIGHT,
                                                        padding: CELL_PADDING,
                                                        boxSizing: 'border-box',
                                                    }}
                                                    className="bg-background"
                                                >
                                                    <GridAssetItem item={filteredAssets[index]} />
                                                </div>
                                            );
                                        }}
                                    </Grid>
                                )}
                            </InfiniteLoader>
                        ) : (
                            <InfiniteLoader
                                isItemLoaded={isItemLoaded}
                                itemCount={filteredAssets.length + 1}
                                loadMoreItems={loadMoreItems}
                            >
                                {({ onItemsRendered, ref }) => (
                                    <List
                                        height={height}
                                        itemCount={filteredAssets.length}
                                        itemSize={() => LIST_ITEM_HEIGHT}
                                        width={width}
                                        onItemsRendered={onItemsRendered}
                                        ref={ref}
                                    >
                                        {({ index, style }) => (
                                            <ListAssetItem index={index} style={style} assets={filteredAssets} />
                                        )}
                                    </List>
                                )}
                            </InfiniteLoader>
                        );
                    }}
                </AutoSizer>
            </div>

            <MobileNavbar />
        </div>
    )
}
