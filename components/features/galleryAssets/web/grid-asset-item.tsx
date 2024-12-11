import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
// import { $checkoutAssetIds } from "@/store/checkout-store";

// import { useStore } from "@nanostores/react";
import React from "react";
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
			errorMessage,
			reset,
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


		const onCloseSell = () => {
			reset();
			handleCloseSell();
		};

		const onCloseBuy = () => {
			reset();
			handleCloseBuy();
		};

		const [actionLabel] = isOwner ? ["Sell"] : ["Buy"];

		// const checkoutAssetIds = useStore($checkoutAssetIds);
		// TODO: continue with checkout card
		// const isChecked = checkoutAssetIds.find((id) => id === item.id);

		// const renders = useRendersCount();
		// console.log("renders", renders);
		// useEffect(() => {
		// 	console.log("mount", item);
		// 	return () => {
		// 		console.log("unmount", item);
		// 	};
		// }, [item]);
		return (
			<>
				<SellAction
					isOpen={showSell}
					handleClose={onCloseSell}
					asset={item}
					isLoading={isLoading}
					sellStart={sellStart}
					sellComplete={sellComplete}
					sellStartData={sellStartData}
					sellCompleteData={sellCompleteData}
					errorMessage={errorMessage}
				/>
				<BuyAction
					isOpen={showBuy}
					handleClose={onCloseBuy}
					asset={item}
					isLoading={isLoading}
					buyStart={buyStart}
					buyComplete={buyComplete}
					buyStartData={buyStartData}
					buyCompleteData={buyCompleteData}
					errorMessage={errorMessage}
				/>
				<Box className="w-full h-full">
					<Card
						className="overflow-hidden relative rounded-t-lg border group h-full"
						style={{ height: "100%" }}
					>
						{/* <Pressable className="absolute top-2 right-2 z-10" onPress={toggleCheckout}>
                        <Badge className="bg-background-tajfi-deep-blue text-white p-1 rounded-full" >
                            {isChecked ? <Check size={16} /> : <Plus size={16} />}
                        </Badge>
                    </Pressable> */}
						<AssetImage assetId={item.assetId} />
						<Box>
							<Text className="text-xs font-bold capitalize">
								{item.order?.amount_to_sell ?? ""} {item.name}
							</Text>
							<Text className="text-xs">
								{item.order
									? `${formatSatoshis(item.order.amount_sats_to_receive)} BTC`
									: ""}
							</Text>
						</Box>
						<Box className="absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 w-full">
							<Button
								className="bg-background-tajfi-deep-blue text-white w-full rounded-t-lg"
								onPress={isOwner ? handleOpenSell : handleOpenBuy}
								disabled={isLoading}
								aria-label={`${actionLabel} ${item.name}`}
								tabIndex={0}
							>
								<ButtonText>{actionLabel}</ButtonText>
							</Button>
						</Box>
					</Card >
				</Box >
			</>
		);
	},
	(prevProps, nextProps) => {
		return prevProps.item.id === nextProps.item.id;
	},
);

GridAssetItem.displayName = "GridAssetItem";
