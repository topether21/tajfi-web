import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import {
	VariableSizeGrid as Grid,
	type GridOnScrollProps,
	VariableSizeList as List,
} from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { CELL_WIDTH, GAP, LIST_ITEM_HEIGHT, MIN_ROW_HEIGHT } from "./constants";
import { GridAssetItem } from "./grid-asset-item";
import { ListAssetItem } from "./list-asset-item";
import type { Asset } from "./use-assets";
import isEqual from "lodash.isequal";

interface AssetsDisplayProps {
	filteredAssets: Asset[];
	isGridView: boolean;
	isItemLoaded: (index: number) => boolean;
	loadMoreItems: (startIndex: number, stopIndex: number) => Promise<void>;
	containerRef: React.RefObject<HTMLDivElement | null>;
	scrollHandler: (event: GridOnScrollProps) => void;
	isOwner?: boolean;
}

const calculateColumnCount = (width: number) =>
	Math.max(1, Math.floor((width + GAP) / (CELL_WIDTH + GAP)));

export const AssetsDisplay: React.FC<AssetsDisplayProps> = React.memo(
	({
		isOwner,
		filteredAssets,
		isGridView,
		isItemLoaded,
		loadMoreItems,
		containerRef,
		scrollHandler,
	}) => {
		return (
			<div
				ref={containerRef as React.LegacyRef<HTMLDivElement>}
				className="container mx-auto flex-grow overflow-auto"
			// Removed padding to avoid outer gaps
			>
				<AutoSizer>
					{({ width, height }) => {
						const columnCount = calculateColumnCount(width);
						// const columnWidth = calculateColumnWidth(width, columnCount);
						const rowCount = Math.ceil(filteredAssets.length / columnCount);
						return isGridView ? (
							<InfiniteLoader
								isItemLoaded={isItemLoaded}
								itemCount={filteredAssets.length}
								loadMoreItems={loadMoreItems}
							>
								{({ onItemsRendered, ref }) => (
									<Grid
										onScroll={scrollHandler}
										columnCount={columnCount}
										columnWidth={() => CELL_WIDTH}
										height={height}
										rowCount={rowCount}
										rowHeight={() => MIN_ROW_HEIGHT}
										width={width}
										onItemsRendered={({
											visibleRowStartIndex,
											visibleRowStopIndex,
											visibleColumnStartIndex,
											visibleColumnStopIndex,
										}) => {
											onItemsRendered({
												overscanStartIndex:
													visibleRowStartIndex * columnCount +
													visibleColumnStartIndex,
												overscanStopIndex:
													visibleRowStopIndex * columnCount +
													visibleColumnStopIndex,
												visibleStartIndex:
													visibleRowStartIndex * columnCount +
													visibleColumnStartIndex,
												visibleStopIndex:
													visibleRowStopIndex * columnCount +
													visibleColumnStopIndex,
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
														left: columnIndex * (CELL_WIDTH + GAP),
														top: rowIndex * (MIN_ROW_HEIGHT + GAP),
														width: CELL_WIDTH,
														height: MIN_ROW_HEIGHT,
														boxSizing: "border-box",
													}}
													key={filteredAssets[index].id}
												>
													<GridAssetItem
														item={filteredAssets[index]}
														isOwner={isOwner}
													/>
												</div>
											);
										}}
									</Grid>
								)}
							</InfiniteLoader>
						) : (
							<InfiniteLoader
								isItemLoaded={isItemLoaded}
								itemCount={filteredAssets.length}
								loadMoreItems={loadMoreItems}
							>
								{({ onItemsRendered, ref }) => (
									<List
										height={height}
										itemCount={filteredAssets.length}
										itemSize={() => LIST_ITEM_HEIGHT + GAP} // Include gap between list items
										width={width}
										onItemsRendered={onItemsRendered}
										ref={ref}
									>
										{({ index, style }) => (
											<div
												style={{
													...style,
													height: LIST_ITEM_HEIGHT,
													marginBottom: GAP, // Gap between list items
												}}
											>
												<ListAssetItem
													index={index}
													style={{ width: "100%", height: "100%" }}
													assets={filteredAssets}
												/>
											</div>
										)}
									</List>
								)}
							</InfiniteLoader>
						);
					}}
				</AutoSizer>
			</div>
		);
	},
	(prevProps, nextProps) => {
		// 
		return isEqual(prevProps, nextProps);
	},
);

AssetsDisplay.displayName = "AssetsDisplay";
