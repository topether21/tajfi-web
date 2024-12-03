import { Box } from "@/components/ui/box";
import { useSizes } from "@/hooks/useSizes";
import clsx from "clsx";
import { AssetsMarketplace } from "./web/marketplace";
import type { AssetsMarketplaceProps } from "./web/types";

export const MarketplaceScreen = ({ assets, isItemLoaded, loadMoreItems }: AssetsMarketplaceProps) => {
    const { isLarge } = useSizes();
    return (
        <Box className={clsx("px-4 flex-1", isLarge ? "pb-28" : "pb-16", "bg-background-tajfi-white")}>
            <AssetsMarketplace assets={assets} isItemLoaded={isItemLoaded} loadMoreItems={loadMoreItems} />
        </Box>
    );
};
