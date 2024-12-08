import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useCurrencies } from "../hooks/use-balances";

export const TransactionSummary = ({
	invoiceDetails,
	invoice,
	error,
	onSend,
}: {
	invoiceDetails: { amount: number; assetId: string } | null;
	invoice: string | null;
	error: string;
	onSend: () => void;
}) => {
	const currencies = useCurrencies();

	const errorMessage = error?.includes(
		"The operation either timed out or was not allowed",
	)
		? ""
		: error;

	if (errorMessage && invoice)
		return <Text className="text-error-500">{error}</Text>;
	if (!invoiceDetails) return null;

	return (
		<Box className="pt-4 w-full text-background-tajfi-deep-blue flex-1">
			<Heading size="md">Transaction Summary</Heading>
			<Box>
				<Box className="flex justify-between bg-secondary rounded-lg">
					<Text className="text-lg font-medium">Amount:</Text>
					<Text className="text-2xl font-bold">{invoiceDetails?.amount}</Text>
				</Box>
				<Box className="flex justify-between bg-secondary rounded-lg pt-4">
					<Text className="text-lg font-medium">Currency:</Text>
					<Text>{currencies.get(invoiceDetails.assetId)}</Text>
				</Box>
			</Box>
			<Button size="sm" onPress={onSend} className="mt-4 w-full">
				<ButtonText>Confirm</ButtonText>
			</Button>
		</Box>
	);
};
