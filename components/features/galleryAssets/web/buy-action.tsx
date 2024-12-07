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
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import type {
    BuyAssetCompleteBody,
    BuyAssetCompleteResponse,
    BuyAssetStartBody,
    BuyAssetStartResponse,
    SellAssetCompleteBody,
    SellAssetCompleteResponse,
    SellAssetStartBody,
    SellAssetStartResponse,
} from "@/libs/wallet/api";
import { getProviderStrategy } from "@/libs/wallet/providers";
import { Hash } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useAuth } from "../../wallet/connect-wallet/auth-context";
import { AssetImage } from "./asset-image";
import type { Asset } from "./use-assets";

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

const getActionLabel = (
    buyStartData: BuyAssetStartResponse | null | undefined,
    buyCompleteData: BuyAssetCompleteResponse | null | undefined,
) => {
    if (!buyStartData && !buyCompleteData) return "Confirm";
    if (buyCompleteData) return "Buy";
    return "";
    // // TODO: remove this
    // return "Sell";
};

const getActionOnPress = (
    buyStartData: BuyAssetStartResponse | null | undefined,
    buyCompleteData: BuyAssetCompleteResponse | null | undefined,
    handleBuyStart: () => void,
    handleBuyComplete: () => void,
) => {
    if (!buyStartData && !buyCompleteData) return handleBuyStart;
    if (buyStartData) return handleBuyComplete;
    return () => { };
    // TODO: remove this
    // return handleBuyComplete;
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
}: {
    isOpen: boolean;
    handleClose: () => void;
    asset: Asset;
    isLoading: boolean;
    buyStart: (body: BuyAssetStartBody) => Promise<BuyAssetStartResponse | null>;
    buyComplete: (body: BuyAssetCompleteBody) => Promise<BuyAssetCompleteResponse | null>;
    buyStartData: BuyAssetStartResponse | null | undefined;
    buyCompleteData: BuyAssetCompleteResponse | null | undefined;
}) => {
    const { profile } = useAuth();

    const handleBuyStart = async () => {
        try {
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    const handleBuyComplete = async () => {
        if (!profile) return;
        try {
        } catch (e) {
            console.error(e);
        }
    };

    const actionLabel = getActionLabel(buyStartData, buyCompleteData);
    const actionOnPress = getActionOnPress(
        buyStartData,
        buyCompleteData,
        handleBuyStart,
        handleBuyComplete,
    );

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
                                        Confirm the amount you want to buy {asset.units} {asset.name}
                                    </FormControlLabelText>
                                </FormControlLabel>
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
