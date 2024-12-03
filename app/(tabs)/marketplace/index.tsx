import { MarketplaceScreen } from "@/components/features/marketplace";
import { useAssets } from "@/components/features/marketplace/web/use-assets";
import { useSegments } from "expo-router";


export default function MarketplacePage() {
    const { assets, isItemLoaded, loadMoreItems } = useAssets()
    return <MarketplaceScreen assets={assets} isItemLoaded={isItemLoaded} loadMoreItems={loadMoreItems} />;
}
