import { MarketplaceScreen } from "@/components/features/marketplace";

export default function ProfilePage() {
    return <MarketplaceScreen assets={[]} isItemLoaded={() => true} loadMoreItems={() => Promise.resolve()} />;
}
