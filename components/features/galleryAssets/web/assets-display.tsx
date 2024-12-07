import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import {
	VariableSizeGrid as Grid,
	VariableSizeList as List,
} from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { CELL_WIDTH, GAP, LIST_ITEM_HEIGHT, MIN_ROW_HEIGHT } from "./constants";
import { GridAssetItem } from "./grid-asset-item";
import { ListAssetItem } from "./list-asset-item";
import type { Asset } from "./use-assets";

interface AssetsDisplayProps {
	filteredAssets: Asset[];
	isGridView: boolean;
	isItemLoaded: (index: number) => boolean;
	loadMoreItems: (startIndex: number, stopIndex: number) => Promise<void>;
	containerRef: React.RefObject<HTMLDivElement | null>;
	isOwner?: boolean;
}

const calculateColumnCount = (width: number) =>
	Math.max(1, Math.floor(width / (CELL_WIDTH + GAP)));
const calculateColumnWidth = (width: number, columnCount: number) =>
	Math.floor((width - GAP * (columnCount - 1)) / columnCount);

export const AssetsDisplay: React.FC<AssetsDisplayProps> = React.memo(
	({
		isOwner,
		filteredAssets,
		isGridView,
		isItemLoaded,
		loadMoreItems,
		containerRef,
	}) => (
		<div
			ref={containerRef as React.LegacyRef<HTMLDivElement>}
			className="container mx-auto flex-grow overflow-auto pt-4"
		>
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
									style={{ gap: 8 }}
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
													boxSizing: "border-box",
												}}
												key={filteredAssets[index].id}
												className="bg-background"
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
									itemSize={() => LIST_ITEM_HEIGHT}
									width={width}
									onItemsRendered={onItemsRendered}
									ref={ref}
								>
									{({ index, style }) => (
										<ListAssetItem
											index={index}
											style={style}
											assets={filteredAssets}
										/>
									)}
								</List>
							)}
						</InfiniteLoader>
					);
				}}
			</AutoSizer>
		</div>
	),
	// TODO: improve this
	(prevProps, nextProps) => {
		return (
			prevProps.isOwner === nextProps.isOwner &&
			prevProps.isGridView === nextProps.isGridView &&
			prevProps.filteredAssets.length === nextProps.filteredAssets.length &&
			prevProps.filteredAssets.every(
				(asset, index) => asset.id === nextProps.filteredAssets[index].id,
			) &&
			prevProps.filteredAssets.every(
				(asset, index) => asset.name === nextProps.filteredAssets[index].name,
			) &&
			prevProps.filteredAssets.every(
				(asset, index) =>
					asset.price === nextProps.filteredAssets[index].price,
			) &&
			prevProps.filteredAssets.every(
				(asset, index) => asset.units === nextProps.filteredAssets[index].units,
			)
		);
	},
);

AssetsDisplay.displayName = "AssetsDisplay";
