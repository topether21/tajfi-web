import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as Clipboard from "expo-clipboard";
import { useFocusEffect } from "expo-router";
import { Scan, Clipboard as ClipboardIcon } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useAuth } from "../connect-wallet/auth-context";
import { useInvoiceDetails } from "../hooks/use-invoice-details";
import { useSendFunds } from "../hooks/use-send-funds";
import { ScannerModal } from "./camera-expo";
import { TransactionSummary } from "./send-preview";

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
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

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
		if (invoiceDetails && invoice) {
			sendFundsStart(invoice);
		}
	}, [invoiceDetails, invoice, sendFundsStart]);

	const onSend = () => {
		if (!preSignedData || !profile) return;
		sendFundsComplete({
			sighashHexToSign: preSignedData.sighashHexToSign,
			providerName: profile.providerName,
			tapasAddress: profile.tapasAddress,
			fundedPsbt: preSignedData.fundedPsbt,
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
				<Heading size="lg" className="mb-4 text-background-tajfi-deep-blue">
					Send
				</Heading>
				<Input
					variant="outline"
					size="xl"
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
					/>
					<InputSlot>
						<HStack space="xl" className="pr-4">
							<TouchableOpacity onPress={onOpenScanner}>
								<InputIcon as={Scan} size="md" className="stroke-background-tajfi-deep-blue" />
							</TouchableOpacity>
							<TouchableOpacity onPress={fetchCopiedText}>
								<InputIcon as={ClipboardIcon} size={24} className="stroke-background-tajfi-deep-blue" />
							</TouchableOpacity>
						</HStack>
					</InputSlot>
				</Input>

				{isSent ? (
					<Text>Transaction confirmed.</Text>
				) : (
					<TransactionSummary
						invoiceDetails={invoiceDetails}
						isLoading={isLoading}
						onSend={onSend}
						error={error}
					/>
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
