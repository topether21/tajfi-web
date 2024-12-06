import { AssetGalleryScreen } from "@/components/features/galleryAssets";
import { ASSETS } from "@/components/features/galleryAssets/web/assets";
import { useOrders } from "@/components/features/wallet/hooks/use-orders";

export default function MarketplacePage() {
	const { orders } = useOrders();
	const assets = orders
		.filter((order) => order.amount_to_sell > 0)
		.map((order, index) => ({
			id: order.asset_id || `${index}`,
			name: "",
			price: order.amount_sats_to_receive,
			image: ASSETS[index].image,
			satoshiPrice: order.amount_sats_to_receive,
			ordinalNumber: index,
			categories: [],
		}));
	const isItemLoaded = (index: number) => true;
	const loadMoreItems = () => Promise.resolve();
	return (
		<AssetGalleryScreen
			assets={assets}
			isItemLoaded={isItemLoaded}
			loadMoreItems={loadMoreItems}
			isOwner
		/>
	);
}
