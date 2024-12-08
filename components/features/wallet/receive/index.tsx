import { Box } from "@/components/ui/box";
import { HEX_COLORS } from "@/components/ui/gluestack-ui-provider/config";
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
import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity } from "react-native";
import type { View } from "react-native";
import QRCode from "react-qr-code";
import useAsync from "react-use/lib/useAsync";
import {
	$receiveAssetId,
	resetReceiveAssetId,
} from "../../../../store/asset-id-store";
import { useCreateInvoice } from "../hooks/use-create-invoice";
import { useUserReceiveCurrency } from "../layout/use-user-receive-currency";
import { UserCurrencies } from "../layout/user-currencies";
import { SimpleCurrencySelector } from "../simple-currency-selector";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { captureRef } from "react-native-view-shot";

export const ReceiveScreen = () => {
	const { isOpen, handleClose, handleOpen } = useUserReceiveCurrency();
	const { value: sharingAvailable } = useAsync(Sharing.isAvailableAsync);
	const [assetAmount, setAssetAmount] = useState<string>("");
	const receiveAssetId = useStore($receiveAssetId);
	const { loading, invoice, createNewInvoice } = useCreateInvoice();
	const qrCodeRef = useRef<View>(null);
	const qrCode = invoice?.encoded && assetAmount ? `${invoice.encoded}` : ""; // TODO: add tajfi:// prefix ???
	const copyInvoice = async () => {
		await Clipboard.setStringAsync(qrCode);
	};
	const shareQRCodeImage = async () => {
		try {
			const uri = await captureRef(qrCodeRef, {
				format: "png",
				quality: 0.8,
			});

			// Convert the data URL to a Blob
			const response = await fetch(uri);
			const blob = await response.blob();

			// Create a File from the Blob
			const file = new File([blob], "qr-code.png", { type: "image/png" });

			// Use the Web Share API if available
			if (navigator?.canShare({ files: [file] })) {
				await navigator.share({
					files: [file],
					title: 'QR Code',
					text: 'Here is the QR code image.',
				});
			} else {
				console.error("Sharing not supported on this browser.");
			}
		} catch (error) {
			console.error("Error sharing QR code image:", error);
		}
	};

	useEffect(() => {
		createNewInvoice({ amount: Number(assetAmount), assetId: receiveAssetId });
	}, [assetAmount, receiveAssetId, createNewInvoice]);
	useFocusEffect(
		React.useCallback(() => {
			// reset state on unmount
			return () => {
				setAssetAmount("");
				resetReceiveAssetId();
			};
		}, []),
	);
	return (
		<>
			<Box className="flex-1 items-start justify-start px-4 bg-background-0">
				<Heading size="lg" className="mb-2 text-background-tajfi-deep-blue">
					Receive
				</Heading>

				<HStack space="xl" className="w-full items-center justify-start pb-6">
					<Input
						variant="outline"
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

				{!loading && qrCode && (
					<Box className="mx-auto pb-24">
						<Animated.View entering={FadeIn} exiting={FadeOut}>
							<Box ref={qrCodeRef} className="bg-white rounded-lg p-2">
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
									<TouchableOpacity onPress={shareQRCodeImage}>
										<HStack space="md">
											<Text className="text-background-tajfi-deep-blue">
												Share QR Code Image
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
						</Animated.View>
					</Box>
				)}
			</Box>
			<UserCurrencies
				isOpen={isOpen}
				handleClose={(assetId) => {
					handleClose(assetId);
					if (!assetId) return;
					createNewInvoice({ amount: Number(assetAmount), assetId });
				}}
			/>
			{/* Hidden icons for prefetching */}
			{/* TODO: remove this once we have a better way to prefetch icons */}
			<Box className="hidden">
				<Ionicons
					name="copy"
					size={24}
					color={HEX_COLORS.tajfiDeepBlue}
				/>
				<Entypo
					name="share"
					size={24}
					color={HEX_COLORS.tajfiDeepBlue}
				/>
			</Box>
		</>
	);
};
