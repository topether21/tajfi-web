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
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { useRendersCount } from "react-use";
import { useAssetActions } from "../../wallet/hooks/use-asset-actions";
import { MIN_CARD_HEIGHT } from "./constants";
import type { Asset } from "./use-assets";

interface GridAssetItemProps {
	item: Asset;
	isOwner?: boolean;
}

export const GridAssetItem = React.memo(
	({ item, isOwner }: GridAssetItemProps) => {
		const { sellStart } = useAssetActions();
		const action = isOwner ? "Sell" : "Buy";
		const formatSatoshis = (satoshis: number) => {
			return (satoshis / 100000000).toFixed(8);
		};
		const checkoutAssetIds = useStore($checkoutAssetIds);
		const isChecked = checkoutAssetIds.find((id) => id === item.id);
		const goToAsset = () => router.push(`/marketplace/${item.id}`);
		const toggleCheckout = () => {
			console.log("toggleCheckout", item.id, isChecked, checkoutAssetIds);
			if (isChecked) {
				console.log("removing from checkout", item.id);
				removeCheckoutAssetId(item.id);
			} else {
				console.log("adding to checkout", item.id);
				addCheckoutAssetId(item.id);
			}
		};
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
					className="m-2 overflow-hidden relative rounded-t-lg border group"
					style={{ height: MIN_CARD_HEIGHT }}
				>
					{/* <Pressable className="absolute top-2 right-2 z-10" onPress={toggleCheckout}>
          <Badge className="bg-background-tajfi-deep-blue text-white p-1 rounded-full" >
            {isChecked ? <Check size={16} /> : <Plus size={16} />}
          </Badge>
        </Pressable> */}
					<Image
						source={item.image}
						alt={item.name}
						contentFit="contain"
						className="select-none h-[87%] w-full"
						transition={500}
					/>
					<Box>
						<Text className="text-xs font-bold capitalize">{item.name}</Text>
						<Text className="text-xs">{formatSatoshis(item.price)} BTC</Text>
					</Box>
					<Box className="absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
						<Button className="bg-background-tajfi-deep-blue text-white w-full rounded-t-lg">
							<ButtonText>{action}</ButtonText>
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
