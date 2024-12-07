import { AssetGalleryScreen } from "@/components/features/galleryAssets";
import { useBalances } from "@/components/features/wallet/hooks/use-balances";

import { ASSETS } from "@/components/features/galleryAssets/web/assets";
import { Heading } from "@/components/ui/heading";

export default function ProfilePage() {
	const { userBalances, currencies } = useBalances();
	const assets = userBalances
		.filter((balance) => balance.amount > 0)
		.map((balance, index) => ({
			id: balance.assetId || `${index}`,
			name: balance.assetId ? currencies.get(balance.assetId) || "" : "",
			price: balance.amount,
			image: ASSETS[index].image,
			satoshiPrice: 0,
			ordinalNumber: index,
			units: balance.amount,
		}));
	const isItemLoaded = (index: number) => true;
	const loadMoreItems = () => Promise.resolve();
	return (
		<>
			<Heading
				size="lg"
				className="pb-2 text-background-tajfi-deep-blue px-4 bg-background-0"
			>
				My Assets
			</Heading>
			<AssetGalleryScreen
				assets={assets}
				isItemLoaded={isItemLoaded}
				loadMoreItems={loadMoreItems}
				isOwner
			/>
		</>
	);
}
