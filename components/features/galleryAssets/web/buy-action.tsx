import {
	Actionsheet,
	ActionsheetBackdrop,
	ActionsheetContent,
	ActionsheetDragIndicator,
	ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import {
	FormControl,
	FormControlLabel,
	FormControlLabelText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import type {
	BuyAssetCompleteBody,
	BuyAssetCompleteResponse,
	BuyAssetStartBody,
	BuyAssetStartResponse,
} from "@/libs/wallet/api";
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useAuth } from "../../wallet/connect-wallet/auth-context";
import { AssetImage } from "./asset-image";
import type { Asset } from "./use-assets";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react-native";

export const useBuyAction = () => {
	const [showBuy, setShowBuy] = useState(false);
	const handleClose = () => setShowBuy(false);
	const handleOpen = () => setShowBuy(true);
	return {
		showBuy,
		handleClose,
		handleOpen,
	};
};

const getActionLabel = ({
	buyStartData,
	buyCompleteData,
	errorMessage,
}: {
	buyStartData: BuyAssetStartResponse | null | undefined;
	buyCompleteData: BuyAssetCompleteResponse | null | undefined;
	errorMessage: string | null | undefined;
}) => {
	if (errorMessage) return "Close";
	if (!buyStartData && !buyCompleteData) return "Confirm";
	if (buyStartData) return "Buy";
	return "Close";
};

const getActionOnPress = ({
	buyStartData,
	buyCompleteData,
	handleBuyStart,
	handleBuyComplete,
	errorMessage,
	handleClose,
}: {
	buyStartData: BuyAssetStartResponse | null | undefined;
	buyCompleteData: BuyAssetCompleteResponse | null | undefined;
	handleBuyStart: () => Promise<void>;
	handleBuyComplete: () => Promise<void>;
	errorMessage: string | null | undefined;
	handleClose: () => void;
}) => {
	if (errorMessage) return handleClose;
	if (!buyStartData && !buyCompleteData) return handleBuyStart;
	if (buyStartData) return handleBuyComplete;
	return () => { };
};

export const BuyAction = ({
	isOpen,
	handleClose,
	asset,
	isLoading,
	buyStart,
	buyComplete,
	buyStartData,
	buyCompleteData,
	errorMessage,
}: {
	isOpen: boolean;
	handleClose: () => void;
	asset: Asset;
	isLoading: boolean;
	buyStart: (body: BuyAssetStartBody) => Promise<BuyAssetStartResponse | null>;
	buyComplete: (
		body: BuyAssetCompleteBody,
	) => Promise<BuyAssetCompleteResponse | null>;
	buyStartData: BuyAssetStartResponse | null | undefined;
	buyCompleteData: BuyAssetCompleteResponse | null | undefined;
	errorMessage: string | null | undefined;
}) => {
	const { profile } = useAuth();

	const handleBuyStart = async () => {
		try {
			await buyStart({
				psbt: asset.order?.virtual_psbt ?? "",
				anchor_psbt: asset.order?.anchor_psbt ?? "",
			});
		} catch (e) {
			console.error(e);
		}
	};

	const handleBuyComplete = async () => {
		if (!profile) return;
		try {
			await buyComplete({
				psbt: buyStartData?.updated_virtual_psbt ?? "",
				anchor_psbt: buyStartData?.updated_anchor_psbt ?? "",
				sighash_hex: "",  // TODO: get sighash hex
				signature_hex: "", // TODO: get signature hex
				amount_sats_to_pay: asset.order?.amount_sats_to_receive ?? 0,
			});
		} catch (e) {
			console.error(e);
		}
	};

	const actionLabel = getActionLabel({ buyStartData, buyCompleteData, errorMessage });
	const actionOnPress = getActionOnPress({
		buyStartData,
		buyCompleteData,
		handleBuyStart,
		handleBuyComplete,
		errorMessage,
		handleClose
	});

	return (
		<>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "position"}
			>
				<Actionsheet isOpen={isOpen} onClose={handleClose} snapPoints={[100]}>
					<ActionsheetBackdrop />
					<ActionsheetContent>
						<ActionsheetDragIndicatorWrapper>
							<ActionsheetDragIndicator />
						</ActionsheetDragIndicatorWrapper>
						<VStack className="w-full pt-5">
							<HStack space="md" className="justify-center items-center">
								<Box className="w-[64px] h-full px-2">
									<AssetImage assetId={asset.id} />
								</Box>
								<VStack className="flex-1">
									<Text className="font-bold">Buy {asset.name}</Text>
									{/* <Text>Select the amount you want to sell</Text> */}
								</VStack>
								<Pressable onPress={handleClose}>
									<Icon
										as={CloseIcon}
										size="lg"
										className="stroke-background-500"
									/>
								</Pressable>
							</HStack>
							<FormControl className="mt-[36px]">
								<FormControlLabel>
									<FormControlLabelText>
										You are about to buy {asset.order?.amount_to_sell ?? ""} {asset.name}
									</FormControlLabelText>
								</FormControlLabel>
								{errorMessage ? (
									<Alert action="error" variant="solid" className="mt-3">
										<AlertIcon as={InfoIcon} />
										<AlertText>{errorMessage}</AlertText>
									</Alert>
								) : null}
								<Button
									onPress={actionOnPress}
									className="mt-3"
									disabled={isLoading}
								>
									<ButtonText className="flex-1">{actionLabel}</ButtonText>
								</Button>
							</FormControl>
						</VStack>
					</ActionsheetContent>
				</Actionsheet>
			</KeyboardAvoidingView>
		</>
	);
};
