import { VariableSizeGrid as Grid, VariableSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';
import { GridAssetItem } from './grid-asset-item';
import { ListAssetItem } from './list-asset-item';
import { CELL_WIDTH, LIST_ITEM_HEIGHT, MIN_ROW_HEIGHT } from '../../../lib/constants';
import type { Asset } from './use-assets';

interface AssetsDisplayProps {
    filteredAssets: Asset[];
    isGridView: boolean;
    isItemLoaded: (index: number) => boolean;
    loadMoreItems: (startIndex: number, stopIndex: number) => Promise<void>;
    containerRef: React.RefObject<HTMLDivElement>;
}

const calculateColumnCount = (width: number) => Math.max(1, Math.floor(width / CELL_WIDTH));
const calculateColumnWidth = (width: number, columnCount: number) => Math.floor(width / columnCount);

export const AssetsDisplay: React.FC<AssetsDisplayProps> = ({ filteredAssets, isGridView, isItemLoaded, loadMoreItems, containerRef }) => (
    <div ref={containerRef} className="container mx-auto flex-grow overflow-auto">
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
);
