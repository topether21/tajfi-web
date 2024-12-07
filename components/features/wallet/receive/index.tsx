import { LoadingIcon } from "@/components/icons/loading-icon";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useStore } from "@nanostores/react";
import { useFocusEffect } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import React, { useRef, useState } from "react";
import { TouchableOpacity } from "react-native";
import type { View } from "react-native";
import QRCode from "react-qr-code";
import useAsync from "react-use/lib/useAsync";
import { $receiveAssetId, resetReceiveAssetId } from "../../../../store/asset-id-store";
import { useCreateInvoice } from "../hooks/use-create-invoice";
import { useUserReceiveCurrency } from "../layout/use-user-receive-currency";
import { UserCurrencies } from "../layout/user-currencies";
import { SimpleCurrencySelector } from "../simple-currency-selector";
import { HEX_COLORS } from "@/components/ui/gluestack-ui-provider/config";

export const ReceiveScreen = () => {
	const { isOpen, handleClose, handleOpen } = useUserReceiveCurrency();
	const { value: sharingAvailable } = useAsync(Sharing.isAvailableAsync);
	const [assetAmount, setAssetAmount] = useState<string>("");
	const receiveAssetId = useStore($receiveAssetId);
	const { loading, invoice, error, createNewInvoice } = useCreateInvoice(
		assetAmount,
		receiveAssetId,
	);
	const qrCodeRef = useRef<View>(null);
	const qrCode = invoice?.encoded && assetAmount ? `${invoice.encoded}` : ""; // TODO: add tajfi:// prefix ???
	const copyInvoice = async () => {
		await Clipboard.setStringAsync(qrCode);
	};
	const shareInvoice = async () => {
		await Sharing.shareAsync(qrCode);
	};
	useFocusEffect(
		React.useCallback(() => {
			return () => {
				setAssetAmount("");
				resetReceiveAssetId();
			};
		}, []),
	);
	return (
		<>
			<Box className="flex-1 items-start justify-start px-4 bg-background-0">
				<Heading size="lg" className="mb-4 text-background-tajfi-deep-blue">
					Receive
				</Heading>

				<HStack space="xl" className="w-full items-center justify-start pb-6">
					<Input
						variant="outline"
						size="xl"
						isDisabled={false}
						isInvalid={false}
						isReadOnly={false}
						className="flex-1"
					>
						<InputField
							value={assetAmount ?? ""}
							type="text"
							placeholder="Enter amount..."
							className="text-background-tajfi-deep-blue"
							onChangeText={(value) => {
								if (value === "" || !Number.isNaN(Number(value))) {
									setAssetAmount(value === "" ? "" : value);
									createNewInvoice({
										amount: Number(value),
										assetId: receiveAssetId,
									});
								}
							}}
						/>
					</Input>
					<SimpleCurrencySelector handleOpen={handleOpen} />
				</HStack>

				<Box ref={qrCodeRef} className="mx-auto pb-24">
					{qrCode && (
						<>
							<Box className="bg-white rounded-lg p-2">
								<QRCode
									size={140}
									style={{
										height: "auto",
										maxWidth: "100%",
										width: "100%",
										backgroundColor: "white",
									}}
									value={qrCode}
								/>
							</Box>
							<VStack space="md" className="pt-4">
								<TouchableOpacity onPress={copyInvoice}>
									<HStack space="md">
										<Text className="text-background-tajfi-deep-blue">
											Copy Invoice
										</Text>
										<Ionicons
											name="copy"
											size={24}
											color={HEX_COLORS.tajfiDeepBlue}
										/>
									</HStack>
								</TouchableOpacity>
								{sharingAvailable && (
									<TouchableOpacity onPress={shareInvoice}>
										<HStack space="md">
											<Text className="text-background-tajfi-deep-blue">
												Share QR Code
											</Text>
											<Entypo
												name="share"
												size={24}
												color={HEX_COLORS.tajfiDeepBlue}
											/>
										</HStack>
									</TouchableOpacity>
								)}
							</VStack>
						</>
					)}
					{!qrCode && loading && <LoadingIcon />}
				</Box>
			</Box>
			<UserCurrencies
				isOpen={isOpen}
				handleClose={(assetId) => {
					handleClose(assetId);
					if (!assetId) return;
					createNewInvoice({ amount: Number(assetAmount), assetId });
				}}
			/>
		</>
	);
};
