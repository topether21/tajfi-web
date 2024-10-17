'use client'

import { useState, useRef } from 'react'
import { VariableSizeGrid as Grid, VariableSizeList as List } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { Home, Search, Bell, User, Grid as GridIcon, List as ListIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import AutoSizer from 'react-virtualized-auto-sizer'
import { useAssets } from './use-assets'
import { GridAssetItem } from './grid-asset-item';
import { ListAssetItem } from './list-asset-item';
import { CELL_PADDING, CELL_WIDTH, LIST_ITEM_HEIGHT, MIN_ROW_HEIGHT } from './contants'


const calculateColumnCount = (width: number) => {
    return Math.max(1, Math.floor(width / (CELL_WIDTH + 2 * CELL_PADDING))); // Ensure at least one column
}

const calculateColumnWidth = (width: number, columnCount: number) => {
    return Math.floor(width / columnCount); // Adjust column width to fit container
}

export const AssetsMarketplace = () => {
    const { assets, isItemLoaded, loadMoreItems } = useAssets();
    const [isGridView, setIsGridView] = useState(true)
    const containerRef = useRef<HTMLDivElement>(null)

    return (
        <div className="flex flex-col h-full bg-blue-200">
            <div className="justify-between items-center p-4 bg-white border-b hidden md:flex">
                <h1 className="text-2xl font-bold">Taproot Assets Marketplace</h1>
                <div className="flex gap-4">
                    <Button variant="outline">Connect Wallet</Button>
                    <Button>List Asset</Button>
                    <Toggle
                        pressed={isGridView}
                        onPressedChange={setIsGridView}
                        aria-label="Toggle view"
                    >
                        {isGridView ? <GridIcon className="h-4 w-4" /> : <ListIcon className="h-4 w-4" />}
                    </Toggle>
                </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-white border-b md:hidden">
                <h1 className="text-xl font-bold">Marketplace</h1>
                <Toggle
                    pressed={isGridView}
                    onPressedChange={setIsGridView}
                    aria-label="Toggle view"
                >
                    {isGridView ? <GridIcon className="h-4 w-4" /> : <ListIcon className="h-4 w-4" />}
                </Toggle>
            </div>

            <div ref={containerRef} className="container mx-auto flex-grow overflow-auto bg-red-200">
                <AutoSizer>
                    {({ width, height }) => {
                        console.log("width", width, "height", height)
                        const columnCount = calculateColumnCount(width);
                        const columnWidth = calculateColumnWidth(width, columnCount);
                        const rowCount = Math.ceil(assets.length / columnCount);
                        return isGridView ? (
                            <InfiniteLoader
                                isItemLoaded={isItemLoaded}
                                itemCount={assets.length + 1}
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
                                            if (index >= assets.length) return null;
                                            return (
                                                <div
                                                    style={{
                                                        ...style,
                                                        width: columnWidth,
                                                        height: MIN_ROW_HEIGHT,
                                                        padding: CELL_PADDING,
                                                        boxSizing: 'border-box',
                                                    }}
                                                >
                                                    <GridAssetItem item={assets[index]} />
                                                </div>
                                            );
                                        }}
                                    </Grid>
                                )}
                            </InfiniteLoader>
                        ) : (
                            <InfiniteLoader
                                isItemLoaded={isItemLoaded}
                                itemCount={assets.length + 1}
                                loadMoreItems={loadMoreItems}
                            >
                                {({ onItemsRendered, ref }) => (
                                    <List
                                        height={height}
                                        itemCount={assets.length}
                                        itemSize={() => LIST_ITEM_HEIGHT}
                                        width={width}
                                        onItemsRendered={onItemsRendered}
                                        ref={ref}
                                    >
                                        {({ index, style }) => (
                                            <ListAssetItem index={index} style={style} assets={assets} />
                                        )}
                                    </List>
                                )}
                            </InfiniteLoader>
                        );
                    }}
                </AutoSizer>
            </div>

            <nav className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t flex justify-around items-center z-10 md:hidden">
                <Button variant="ghost" size="icon">
                    <Home className="h-6 w-6" />
                    <span className="sr-only">Home</span>
                </Button>
                <Button variant="ghost" size="icon">
                    <Search className="h-6 w-6" />
                    <span className="sr-only">Search</span>
                </Button>
                <Button variant="ghost" size="icon">
                    <Bell className="h-6 w-6" />
                    <span className="sr-only">Notifications</span>
                </Button>
                <Button variant="ghost" size="icon">
                    <User className="h-6 w-6" />
                    <span className="sr-only">Profile</span>
                </Button>
            </nav>
        </div>
    )
}
