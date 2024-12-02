import { Box } from "@/components/ui/box";
import { useSizes } from "@/hooks/useSizes";
import clsx from "clsx";
import { AssetsMarketplace } from "./web/marketplace";

export const MarketplaceScreen = () => {
    const { isLarge } = useSizes();
    return (
        <Box className={clsx("px-4 flex-1", isLarge ? "pb-28" : "pb-16", "bg-background-tajfi-white")}>
            <AssetsMarketplace />
        </Box>
    );
};
