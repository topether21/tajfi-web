import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
// import { $checkoutAssetIds } from "@/store/checkout-store";

// import { useStore } from "@nanostores/react";
import React, { useEffect } from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useRendersCount } from "react-use";
import { useAssetActions } from "../../wallet/hooks/use-asset-actions";
import { AssetImage } from "./asset-image";
import { BuyAction, useBuyAction } from "./buy-action";
import { SellAction, useSellAction } from "./sell-action";
import type { Asset } from "./use-assets";

interface GridAssetItemProps {
	item: Asset;
	isOwner?: boolean;
}

// TODO: move to utils
const formatSatoshis = (satoshis: number) => {
	return (satoshis / 100000000).toFixed(8);
};

export const GridAssetItem = React.memo(
	({ item, isOwner }: GridAssetItemProps) => {
		const {
			sellStart,
			isLoading,
			sellComplete,
			sellStartData,
			sellCompleteData,
			buyStart,
			buyComplete,
			buyStartData,
			buyCompleteData,
		} = useAssetActions();
		const {
			showSell,
			handleClose: handleCloseSell,
			handleOpen: handleOpenSell,
		} = useSellAction();
		const {
			showBuy,
			handleClose: handleCloseBuy,
			handleOpen: handleOpenBuy,
		} = useBuyAction();
		const [actionLabel] = isOwner ? ["Sell"] : ["Buy"];

		// const checkoutAssetIds = useStore($checkoutAssetIds);
		// TODO: continue with checkout card
		// const isChecked = checkoutAssetIds.find((id) => id === item.id);

		const renders = useRendersCount();
		console.log("renders", renders);
		useEffect(() => {
			console.log("mount", item);
			return () => {
				console.log("unmount", item);
			};
		}, [item]);
		return (
			<>
				<SellAction
					isOpen={showSell}
					handleClose={handleCloseSell}
					asset={item}
					isLoading={isLoading}
					sellStart={sellStart}
					sellComplete={sellComplete}
					sellStartData={sellStartData}
					sellCompleteData={sellCompleteData}
				/>
				<BuyAction
					isOpen={showBuy}
					handleClose={handleCloseBuy}
					asset={item}
					isLoading={isLoading}
					buyStart={buyStart}
					buyComplete={buyComplete}
					buyStartData={buyStartData}
					buyCompleteData={buyCompleteData}
				/>
				<Animated.View
					style={{ width: "100%", height: "100%" }}
					entering={FadeIn}
					exiting={FadeOut}
				>
					<Card
						className="overflow-hidden relative rounded-t-lg border group h-full"
						style={{ height: "100%" }}
					>
						{/* <Pressable className="absolute top-2 right-2 z-10" onPress={toggleCheckout}>
                        <Badge className="bg-background-tajfi-deep-blue text-white p-1 rounded-full" >
                            {isChecked ? <Check size={16} /> : <Plus size={16} />}
                        </Badge>
                    </Pressable> */}
						<AssetImage assetId={item.id} />
						<Box>
							<Text className="text-xs font-bold capitalize">
								{item.units ?? ""} {item.name}
							</Text>
							<Text className="text-xs">
								{isOwner ? "" : `${formatSatoshis(item.satoshiPrice)} BTC`}
							</Text>
						</Box>
						<Box className="absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
							<Button
								className="bg-background-tajfi-deep-blue text-white w-full rounded-t-lg"
								onPress={isOwner ? handleOpenSell : handleOpenBuy}
								disabled={isLoading}
							>
								<ButtonText>{actionLabel}</ButtonText>
							</Button>
						</Box>
					</Card>
				</Animated.View>
			</>
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
