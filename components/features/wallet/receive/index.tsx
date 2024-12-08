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
import { Divider } from "@/components/ui/divider"
import {
	TouchableOpacity
} from "react-native";
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
import { useToast } from "@/components/ui/toast";
import { Toast, ToastTitle } from "@/components/ui/toast";
import { Send } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { TajfiSpinnerFullScreen } from "@/components/containers/tajfi-spinner";
import { Pressable } from "@/components/ui/pressable";
import { useSizes } from "@/hooks/useSizes";
import clsx from "clsx";

export const ReceiveScreen = () => {
	const { isSmall } = useSizes();
	const { isOpen, handleClose, handleOpen } = useUserReceiveCurrency();
	const [assetAmount, setAssetAmount] = useState<string>("");
	const receiveAssetId = useStore($receiveAssetId);
	const { loading, invoice, createNewInvoice } = useCreateInvoice();
	const qrCodeRef = useRef<View>(null);
	const qrCode = invoice?.encoded && assetAmount ? `${invoice.encoded}` : ""; // TODO: add tajfi:// prefix ???
	const [isSharing, setIsSharing] = useState(false);
	const copyInvoice = async () => {
		try {
			await Clipboard.setStringAsync(qrCode);

			// Show toast notification for success
			toast.show({
				placement: "top",
				render: ({ id }) => {
					const toastId = `toast-${id}`;
					return (
						<Toast
							nativeID={toastId}
							className="px-5 py-3 gap-4 shadow-soft-1 items-center flex-row"
						>
							<Icon
								as={Send}
								size="xl"
								className="fill-typography-100 stroke-none"
							/>
							<Divider
								orientation="vertical"
								className="h-[30px] bg-outline-200"
							/>
							<ToastTitle size="sm">Invoice copied to clipboard.</ToastTitle>
						</Toast>
					);
				},
			});
		} catch (error) {
			// Show toast notification for error
			toast.show({
				placement: "top",
				render: ({ id }) => {
					const toastId = `toast-${id}`;
					return (
						<Toast
							nativeID={toastId}
							className="px-5 py-3 gap-4 shadow-soft-1 items-center flex-row"
						>
							<Icon
								as={Send}
								size="xl"
								className="fill-typography-100 stroke-none"
							/>
							<Divider
								orientation="vertical"
								className="h-[30px] bg-outline-200"
							/>
							<ToastTitle size="sm">{`Failed to copy invoice: ${(error as Error).message}`}</ToastTitle>
						</Toast>
					);
				},
			});
		}
	};

	const toast = useToast();
	const shareQRCodeImage = async () => {
		setIsSharing(true);
		try {
			const uri = await captureRef(qrCodeRef, {
				format: "png",
				quality: 0.8,
			});
			const response = await fetch(uri);
			const blob = await response.blob();
			const reader = new FileReader();

			reader.onloadend = async () => {
				const base64data = reader.result as string;
				const base64Image = base64data.split(',')[1]; // Remove the data URL prefix
				await Clipboard.setImageAsync(base64Image);

				// Show toast notification for success
				toast.show({
					placement: "top",
					render: ({ id }) => {
						const toastId = `toast-${id}`;
						return (
							<Toast
								nativeID={toastId}
								className="px-5 py-3 gap-4 shadow-soft-1 items-center flex-row"
							>
								<Icon
									as={Send}
									size="xl"
									className="fill-typography-100 stroke-none"
								/>
								<Divider
									orientation="vertical"
									className="h-[30px] bg-outline-200"
								/>
								<ToastTitle size="sm">Image copied to clipboard.</ToastTitle>
							</Toast>
						);
					},
				});
			};

			reader.readAsDataURL(blob);
		} catch (clipboardError) {

			// Show toast notification for clipboard error
			toast.show({
				placement: "top",
				render: ({ id }) => {
					const toastId = `toast-${id}`;
					return (
						<Toast
							nativeID={toastId}
							className="px-5 py-3 gap-4 shadow-soft-1 items-center flex-row"
						>
							<Icon
								as={Send}
								size="xl"
								className="fill-typography-100 stroke-none"
							/>
							<Divider
								orientation="vertical"
								className="h-[30px] bg-outline-200"
							/>
							<ToastTitle size="sm">{`Failed to copy image: ${(clipboardError as Error).message}`}</ToastTitle>
						</Toast>
					);
				},
			});
		} finally {
			setIsSharing(false);
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

				{loading && (
					<TajfiSpinnerFullScreen />
				)}

				{!loading && qrCode && (
					<Box className="pb-24">
						<Animated.View entering={FadeIn} exiting={FadeOut}>
							<Box ref={qrCodeRef} className="bg-white rounded-lg p-2 m-[-8]">
								<QRCode
									value={qrCode}
									className={clsx("w-full h-auto bg-white", isSmall ? "max-w-[150px]" : "max-w-[300px]")}
								/>
							</Box>

							<VStack space="md" className="pt-4">
								<Pressable onPress={shareQRCodeImage} >
									<HStack space="md" className="min-w-24">
										<Text className="text-background-tajfi-deep-blue">
											Share QR Code Image
										</Text>
										<Entypo
											name="share"
											size={24}
											color={HEX_COLORS.tajfiDeepBlue}
										/>
									</HStack>
								</Pressable>
								<Pressable onPress={copyInvoice}>
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
								</Pressable>
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
