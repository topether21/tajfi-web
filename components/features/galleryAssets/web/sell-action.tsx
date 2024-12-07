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
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import type {
    SellAssetCompleteBody,
    SellAssetCompleteResponse,
    SellAssetStartBody,
    SellAssetStartResponse,
} from "@/libs/wallet/api";
import { Hash } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { AssetImage } from "./asset-image";
import type { Asset } from "./use-assets";
import { useAuth } from "../../wallet/connect-wallet/auth-context";
import { getProviderStrategy } from "@/libs/wallet/providers";

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

const getActionLabel = (sellStartData: SellAssetStartResponse | null | undefined, sellCompleteData: SellAssetCompleteResponse | null | undefined) => {
    // if (!sellStartData && !sellCompleteData) return "Confirm";
    // if (sellCompleteData) return "Sell";
    // return "";
    // TODO: remove this
    return "Sell";
};

const getActionOnPress = (sellStartData: SellAssetStartResponse | null | undefined, sellCompleteData: SellAssetCompleteResponse | null | undefined, handleSellStart: () => void, handleSellComplete: () => void) => {
    // if (!sellStartData && !sellCompleteData) return handleSellStart;
    // if (sellStartData) return handleSellComplete;
    // return () => { };
    // TODO: remove this
    return handleSellComplete;
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
}: {
    isOpen: boolean;
    handleClose: () => void;
    asset: Asset;
    isLoading: boolean;
    sellStart: (body: SellAssetStartBody) => void;
    sellComplete: (body: SellAssetCompleteBody) => void;
    sellStartData: SellAssetStartResponse | null | undefined;
    sellCompleteData: SellAssetCompleteResponse | null | undefined;
}) => {
    const { profile } = useAuth();
    const [amount, setAmount] = useState<string | undefined>(undefined);

    const handleSellStart = () => {
        sellStart({
            asset_id: asset.id,
            amount_to_sell: amount ? Number.parseInt(amount) : 0,
        });
    };

    const handleSellComplete = async () => {
        if (!profile) return;
        try {
            const walletProvider = getProviderStrategy(profile.providerName);
            const signatureHex = await walletProvider.signTx(sellStartData?.sighash_hex_to_sign ?? "", {
                address: profile?.tapasAddress ?? "",
            });
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

    const actionLabel = getActionLabel(sellStartData, sellCompleteData);
    const actionOnPress = getActionOnPress(sellStartData, sellCompleteData, handleSellStart, handleSellComplete);

    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <Actionsheet isOpen={isOpen} onClose={handleClose}>
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
                            </HStack>
                            <FormControl className="mt-[36px]">
                                <FormControlLabel>
                                    <FormControlLabelText>
                                        Confirm the amount you want to sell
                                    </FormControlLabelText>
                                </FormControlLabel>
                                <Input className="w-full">
                                    <InputSlot>
                                        <InputIcon as={Hash} className="ml-2" />
                                    </InputSlot>
                                    <InputField
                                        value={amount?.toString()}
                                        onChangeText={setAmount}
                                    />
                                </Input>
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
