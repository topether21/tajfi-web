import { AssetGalleryScreen } from "@/components/features/galleryAssets";
import { useBalances } from "@/components/features/wallet/hooks/use-balances";

import { ASSETS } from "@/components/features/galleryAssets/web/assets";

export default function ProfilePage() {
    const { userBalances, currencies, loading, error } = useBalances()
    const assets = userBalances.filter(balance => balance.amount > 0).map((balance, index) => ({
        id: balance.assetId || `${index}`,
        name: balance.name || ASSETS[index].name,
        price: balance.amount,
        image: ASSETS[index].image,
        satoshiPrice: balance.amount * 10000,
        ordinalNumber: index,
        categories: [],
    }))
    return <AssetGalleryScreen assets={assets} isItemLoaded={() => true} loadMoreItems={() => { }} isOwner />;
}
