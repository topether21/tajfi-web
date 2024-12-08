import { Box } from "@/components/ui/box";
import { useSizes } from "@/hooks/useSizes";
import clsx from "clsx";
import type { AssetsMarketplaceProps } from "./web/marketplace";
import { AssetsMarketplace } from "./web/marketplace";

export const AssetGalleryScreen = ({
	assets,
	isItemLoaded,
	loadMoreItems,
}: AssetsMarketplaceProps) => {
	const { isLarge } = useSizes();
	return (
		<Box
			className={clsx(
				"px-4 flex-1",
				isLarge ? "pb-28" : "pb-24",
				"bg-background-tajfi-white",
			)}
		>
			<AssetsMarketplace
				assets={assets}
				isItemLoaded={isItemLoaded}
				loadMoreItems={loadMoreItems}
			/>
		</Box>
	);
};
