import { AssetGalleryScreen } from "@/components/features/galleryAssets";
import {
	useCurrencies,
	useUserBalances,
} from "@/components/features/wallet/hooks/use-balances";
import { Heading } from "@/components/ui/heading";
import type { Asset } from "@/components/features/galleryAssets/web/use-assets";

export default function ProfilePage() {
	const currencies = useCurrencies();
	const userBalances = useUserBalances();

	const assets: Asset[] = userBalances
		.filter((balance) => balance.amount > 0)
		.map((balance) => ({
			id: balance.assetId,
			assetId: balance.assetId,
			name: currencies.get(balance.assetId) || "",
			amount: balance.amount,
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
				isOwner={true}
			/>
		</>
	);
}
