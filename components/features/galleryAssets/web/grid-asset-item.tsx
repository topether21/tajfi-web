import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import {
	$checkoutAssetIds,
	addCheckoutAssetId,
	removeCheckoutAssetId,
} from "@/store/checkout-store";

import { useStore } from "@nanostores/react";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { useRendersCount } from "react-use";
import { useAssetActions } from "../../wallet/hooks/use-asset-actions";
import { MIN_CARD_HEIGHT } from "./constants";
import type { Asset } from "./use-assets";
import { AssetImage } from "./asset-image";

interface GridAssetItemProps {
	item: Asset;
	isOwner?: boolean;
}

const formatSatoshis = (satoshis: number) => {
	return (satoshis / 100000000).toFixed(8);
};

// const goToAsset = (id: string) => router.push(`/marketplace/${id}`);
// const toggleCheckout = () => {
// 	console.log("toggleCheckout", item.id, isChecked, checkoutAssetIds);
// 	if (isChecked) {
// 		console.log("removing from checkout", item.id);
// 		removeCheckoutAssetId(item.id);
// 	} else {
// 		console.log("adding to checkout", item.id);
// 		addCheckoutAssetId(item.id);
// 	}
// };

export const GridAssetItem = React.memo(
	({ item, isOwner }: GridAssetItemProps) => {
		const { sellStart, isLoading, sellComplete } = useAssetActions();
		const [actionLabel] = isOwner ? ["Sell", sellStart] : ["Buy"];


		const checkoutAssetIds = useStore($checkoutAssetIds);
		const isChecked = checkoutAssetIds.find((id) => id === item.id);


		const renders = useRendersCount();
		console.log("renders", renders);
		useEffect(() => {
			console.log("mount", item);
			return () => {
				console.log("unmount", item);
			};
		}, [item]);
		return (
			<Pressable>
				<Card
					className="overflow-hidden relative rounded-t-lg border group"
					style={{ height: MIN_CARD_HEIGHT }}
				>
					{/* <Pressable className="absolute top-2 right-2 z-10" onPress={toggleCheckout}>
          <Badge className="bg-background-tajfi-deep-blue text-white p-1 rounded-full" >
            {isChecked ? <Check size={16} /> : <Plus size={16} />}
          </Badge>
        </Pressable> */}
					<AssetImage assetId={item.id} />
					<Box>
						<Text className="text-xs font-bold capitalize">{item.units ?? ''} {item.name}</Text>
						{isOwner ? null : (
							<Text className="text-xs">
								{formatSatoshis(item.satoshiPrice)} BTC
							</Text>
						)}
					</Box>
					<Box className="absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
						<Button
							disabled={isLoading}
							className="bg-background-tajfi-deep-blue text-white w-full rounded-t-lg"
						>
							<ButtonText>{actionLabel}</ButtonText>
						</Button>
					</Box>
				</Card>
			</Pressable>
		);
	},
	(prevProps, nextProps) => {
		return (
			prevProps.item.id === nextProps.item.id &&
			prevProps.isOwner === nextProps.isOwner
		);
	},
);

GridAssetItem.displayName = "GridAssetItem";
