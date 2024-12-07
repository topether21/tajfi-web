import type { Asset } from "./use-assets";

export type AssetsMarketplaceProps = {
	assets: Asset[];
	isItemLoaded: (index: number) => boolean;
	loadMoreItems: (startIndex: number, stopIndex: number) => Promise<void>;
	isOwner?: boolean;
	startRefreshing?: () => void;
	stopRefreshing?: () => void;
};
