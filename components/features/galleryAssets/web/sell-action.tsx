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
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { HStack } from "@/components/ui/hstack";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import type {
	SellAssetCompleteBody,
	SellAssetCompleteResponse,
	SellAssetStartBody,
	SellAssetStartResponse,
} from "@/libs/wallet/api";
import { getProviderStrategy } from "@/libs/wallet/providers";
import { InfoIcon, Hash } from "lucide-react-native";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useAuth } from "../../wallet/connect-wallet/auth-context";
import { AssetImage } from "./asset-image";
import type { Asset } from "./use-assets";
import { useBalanceRefresh } from "../../wallet/hooks/use-balances";

export const useSellAction = () => {
	const [showSell, setShowSell] = useState(false);
	const handleClose = () => setShowSell(false);
	const handleOpen = () => setShowSell(true);
	return {
		showSell,
		handleClose,
		handleOpen,
	};
};

const getActionLabel = ({
	sellStartData,
	sellCompleteData,
	errorMessage,
	isLoading,
}: {
	sellStartData: SellAssetStartResponse | null | undefined;
	sellCompleteData: SellAssetCompleteResponse | null | undefined;
	errorMessage: string | undefined;
	isLoading: boolean;
}) => {
	if (errorMessage) return "Close";
	if (isLoading) return "Processing...";
	if (!sellStartData && !sellCompleteData) return "Confirm";
	if (sellCompleteData) return "Done";
	if (sellStartData) return "Sell";
	return "";
};

const getActionOnPress = ({
	sellStartData,
	sellCompleteData,
	handleSellStart,
	handleSellComplete,
	errorMessage,
	handleClose,
}: {
	sellStartData: SellAssetStartResponse | null | undefined;
	sellCompleteData: SellAssetCompleteResponse | null | undefined;
	handleSellStart: () => void;
	handleSellComplete: () => void;
	errorMessage: string | undefined;
	handleClose: () => void;
}) => {
	if (errorMessage) return handleClose;
	if (!sellStartData && !sellCompleteData) return handleSellStart;
	if (sellStartData) return handleSellComplete;
	return () => { };
};

export const SellAction = ({
	isOpen,
	handleClose,
	asset,
	isLoading,
	sellStart,
	sellComplete,
	sellStartData,
	sellCompleteData,
	errorMessage,
}: {
	isOpen: boolean;
	handleClose: () => void;
	asset: Asset;
	isLoading: boolean;
	sellStart: (
		body: SellAssetStartBody,
	) => Promise<SellAssetStartResponse | null>;
	sellComplete: (
		body: SellAssetCompleteBody,
	) => Promise<SellAssetCompleteResponse | null>;
	sellStartData: SellAssetStartResponse | null | undefined;
	sellCompleteData: SellAssetCompleteResponse | null | undefined;
	errorMessage: string | undefined;
}) => {
	const { startRefreshing, stopRefreshing } = useBalanceRefresh();
	const { profile } = useAuth();
	const [amount, setAmount] = useState<string | undefined>(undefined);

	const handleSellStart = async () => {
		try {
			const res = await sellStart({
				asset_id: asset.id,
				amount_to_sell: amount ? Number.parseInt(amount) : 0,
			});
			return res;
		} catch (e) {
			console.error(e);
			return null;
		}
	};

	const handleSellComplete = async () => {
		if (!profile) return;
		try {
			const walletProvider = getProviderStrategy(profile.providerName);
			const signatureHex = await walletProvider.signTx(
				sellStartData?.sighash_hex_to_sign ?? "",
				{
					address: profile?.tapasAddress ?? "",
				},
			);
			await sellComplete({
				psbt: sellStartData?.funded_psbt ?? "",
				sighash_hex: sellStartData?.sighash_hex_to_sign ?? "",
				signature_hex: signatureHex,
				amount_sats_to_receive: amount ? Number.parseInt(amount) : 0,
			});
		} catch (e) {
			console.error(e);
		}
	};

	const handleAmountChange = (text: string) => {
		const numericValue = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
		setAmount(numericValue);
	};

	const actionLabel = getActionLabel({
		sellStartData,
		sellCompleteData,
		errorMessage,
		isLoading,
	});
	const actionOnPress = getActionOnPress({
		sellStartData,
		sellCompleteData,
		handleSellStart,
		handleSellComplete,
		errorMessage,
		handleClose,
	});

	useEffect(() => {
		console.log("isOpen", isOpen);
		if (isOpen) {
			stopRefreshing?.();
		} else {
			startRefreshing?.();
		}
	}, [isOpen, startRefreshing, stopRefreshing]);

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
									<Text className="font-bold">Sell {asset.name}</Text>
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
										Confirm the amount you want to sell, you have{" "}
										{asset.amount ?? ""} {asset.name}
									</FormControlLabelText>
								</FormControlLabel>
								<Input className="w-full">
									<InputSlot>
										<InputIcon as={Hash} className="ml-2" />
									</InputSlot>
									<InputField
										value={amount?.toString()}
										onChangeText={handleAmountChange}
										keyboardType="numeric"
										type="text"
									/>
								</Input>
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
