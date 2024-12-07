import { AssetGalleryScreen } from "@/components/features/galleryAssets";
import { ASSETS } from "@/components/features/galleryAssets/web/assets";
import { useBalances } from "@/components/features/wallet/hooks/use-balances";
import { useOrders } from "@/components/features/wallet/hooks/use-orders";
import { Heading } from "@/components/ui/heading";

export default function MarketplacePage() {
	const { orders } = useOrders();
	const { currencies } = useBalances();

	const assets = orders
		.filter((order) => order.amount_to_sell > 0)
		.map((order, index) => ({
			id: order.asset_id || `${index}`,
			name: currencies.get(order.asset_id) || "",
			price: order.amount_sats_to_receive,
			image: ASSETS[index].image,
			satoshiPrice: order.amount_sats_to_receive,
			ordinalNumber: index,
			units: order.amount_to_sell,
		}));
	const isItemLoaded = (index: number) => true;
	const loadMoreItems = () => Promise.resolve();
	return (
		<>
			<Heading
				size="lg"
				className="pb-2 text-background-tajfi-deep-blue px-4 bg-background-0"
			>
				Trade
			</Heading>
			<AssetGalleryScreen
				assets={assets}
				isItemLoaded={isItemLoaded}
				loadMoreItems={loadMoreItems}
				isOwner={false}
			/>
		</>
	);
}
