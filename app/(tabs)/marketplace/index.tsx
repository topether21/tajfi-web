import { MarketplaceScreen } from "@/components/features/marketplace";
import { useSegments } from "expo-router";

export default function MarketplacePage() {
    const segment = useSegments();
    console.log(segment);
    return <MarketplaceScreen />;
}
