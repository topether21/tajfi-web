import { AssetGalleryScreen } from "@/components/features/galleryAssets";
import { useAssets } from "@/components/features/galleryAssets/web/use-assets";


export default function MarketplacePage() {
    const { assets, isItemLoaded, loadMoreItems } = useAssets()
    return <AssetGalleryScreen assets={assets} isItemLoaded={isItemLoaded} loadMoreItems={loadMoreItems} />;
}
