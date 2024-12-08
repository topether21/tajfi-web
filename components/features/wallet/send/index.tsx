import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import * as Clipboard from "expo-clipboard";
import { useFocusEffect } from "expo-router";
import { Clipboard as ClipboardIcon, Scan } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useAuth } from "../connect-wallet/auth-context";
import { useInvoiceDetails } from "../hooks/use-invoice-details";
import { useSendFunds } from "../hooks/use-send-funds";
import { ScannerModal } from "./camera-expo";
import { TransactionSummary } from "./send-preview";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { TajfiSpinnerFullScreen } from "@/components/containers/tajfi-spinner";

const normalizeInvoice = (invoice: string) => {
	return invoice.replace("tajfi://", "");
};

export const SendScreen = () => {
	const [showScanner, setShowScanner] = useState(false);
	const [invoice, setInvoice] = useState("");
	const { profile } = useAuth();

	const {
		isLoading: loadingInvoice,
		invoiceDetails,
		error: errorInvoice,
		fetchInvoiceDetails,
		reset: resetInvoiceDetails,
	} = useInvoiceDetails();

	const {
		loading: loadingSend,
		error: errorSend,
		sendFundsStart,
		sendFundsComplete,
		preSignedData,
		isSent,
		reset: resetSendFunds,
	} = useSendFunds();

	const handleInvoiceChange = (text: string) => {
		const normalizedInvoice = normalizeInvoice(text);
		setInvoice(normalizedInvoice);
		fetchInvoiceDetails(normalizedInvoice);
	};

	const handleQrScan = (text: string) => {
		setShowScanner(false);
		const normalizedInvoice = normalizeInvoice(text);
		setInvoice(normalizedInvoice);
		fetchInvoiceDetails(normalizedInvoice);
	};

	// TODO: is it necessary? We can improve this
	useEffect(() => {
		if (invoice) {
			sendFundsStart(invoice);
		}
	}, [invoice, sendFundsStart]);

	const onSend = () => {
		if (!preSignedData || !profile) return;
		sendFundsComplete({
			sighashHexToSign: preSignedData.sighash_hex_to_sign,
			providerName: profile.providerName,
			tapasAddress: profile.tapasAddress,
			fundedPsbt: preSignedData.funded_psbt,
		});
	};

	const isLoading = loadingInvoice || loadingSend;
	const error = errorInvoice || errorSend || "";
	const onCloseScanner = () => {
		setShowScanner(false);
	};

	const onOpenScanner = () => {
		setShowScanner(true);
	};

	const fetchCopiedText = async () => {
		const text = await Clipboard.getStringAsync();
		setInvoice(text);
		fetchInvoiceDetails(text);
	};

	useFocusEffect(
		useCallback(() => {
			return () => {
				setInvoice("");
				resetInvoiceDetails();
				resetSendFunds();
			};
		}, [resetInvoiceDetails, resetSendFunds]),
	);

	return (
		<>
			<Box className="flex-1 items-start justify-start bg-background-0 px-4">
				<Heading size="lg" className="mb-2 text-background-tajfi-deep-blue">
					Send
				</Heading>
				<Input
					variant="outline"
					className="w-full"
					isDisabled={false}
					isInvalid={false}
					isReadOnly={false}
				>
					<InputField
						placeholder="Enter invoice..."
						onChangeText={handleInvoiceChange}
						className="text-background-tajfi-deep-blue"
						value={invoice}
						autoFocus
					/>
					<InputSlot>
						<HStack space="xl" className="pr-4">
							<TouchableOpacity onPress={onOpenScanner}>
								<InputIcon
									as={Scan}
									size="md"
									className="stroke-background-tajfi-deep-blue"
								/>
							</TouchableOpacity>
							<TouchableOpacity onPress={fetchCopiedText}>
								<InputIcon
									as={ClipboardIcon}
									size="md"
									className="stroke-background-tajfi-deep-blue"
								/>
							</TouchableOpacity>
						</HStack>
					</InputSlot>
				</Input>

				{isSent ? (
					<Text>Transaction confirmed.</Text>
				) : (
					(invoiceDetails || error) && (
						<Animated.View
							entering={FadeIn}
							exiting={FadeOut}
							style={{ flex: 1, width: "100%" }}
						>
							<TransactionSummary
								invoiceDetails={invoiceDetails}
								onSend={onSend}
								invoice={invoice}
								error={error}
							/>
						</Animated.View>
					)
				)}

				<ScannerModal
					showScanner={showScanner}
					handleClose={onCloseScanner}
					onQr={handleQrScan}
				/>
			</Box>
		</>
	);
};
