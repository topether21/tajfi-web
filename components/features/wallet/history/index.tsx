import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner"
import type { HistoryTransaction } from "@/libs/wallet/api";
import clsx from "clsx";
import { ArrowUpRight } from "lucide-react-native";
import { ArrowDownLeft } from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { useBalances } from "../hooks/use-balances";
import { useHistory } from "../hooks/use-history";
import { HEX_COLORS } from "@/components/ui/gluestack-ui-provider/config";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const TransactionItem = ({
	transaction,
	currencies,
}: { transaction: HistoryTransaction; currencies: Map<string, string> }) => {
	const isReceive = transaction.type === "receive";
	const date = new Date(Number.parseInt(transaction.timestamp) * 1000);
	const formattedDate = date.toLocaleDateString();
	const formattedTime = date.toLocaleTimeString();
	const assetName = currencies.get(transaction.asset_id) || "";

	return (
		<HStack className="flex items-center justify-between py-4">
			<HStack className="flex items-center space-x-4">
				<Box
					className={`p-2 rounded-full ${isReceive ? "bg-green-100" : "bg-red-100"}`}
				>
					{isReceive ? (
						<ArrowDownLeft className="w-4 h-4 text-green-600" />
					) : (
						<ArrowUpRight className="w-4 h-4 text-red-600" />
					)}
				</Box>
				<Box>
					<TouchableOpacity>
						<Animated.View entering={FadeIn} exiting={FadeOut}>
							<Text bold>{assetName}</Text>
						</Animated.View>
					</TouchableOpacity>
					<Text className="text-sm text-gray-500">
						{formattedDate} {formattedTime}
					</Text>
				</Box>
			</HStack>
			<Box
				className={`text-base font-semibold ${isReceive ? "text-green-600" : "text-red-600"}`}
			>
				{isReceive ? "+" : "-"}
				{transaction.amount}
			</Box>
		</HStack>
	);
};

const EmptyHistory = () => {
	return (
		<Box className="flex-1 flex items-center justify-center h-full">
			<Text className="text-center text-white text-lg">No transactions</Text>
		</Box>
	);
};

export const HistoryScreen = () => {
	const { transfers, loading } = useHistory();
	const { currencies } = useBalances();

	return (
		<>
			<Box className="flex-1 items-start justify-start px-4 bg-background-0">
				<Heading size="lg" className="mb-4 text-background-tajfi-deep-blue">
					History
				</Heading>
				<ScrollView
					className={clsx(
						"w-full h-full",
						loading && "flex-1 items-center justify-center",
						transfers.length > 0 && "pb-28 justify-start",
					)}
				>
					{loading ? (
						<Spinner size="small" color={HEX_COLORS.tajfiDeepBlue} />
					) : (
						<Animated.View entering={FadeIn} exiting={FadeOut}>
							{transfers.length === 0 && <EmptyHistory />}
							{transfers.map((transfer) => (
								<TransactionItem
									key={transfer.txid}
									transaction={transfer}
									currencies={currencies}
								/>
							))}
						</Animated.View>
						// <Animated.FlatList
						// 	data={transfers}
						// 	renderItem={({ item }) => (
						// 		<TransactionItem
						// 			transaction={item}
						// 			currencies={currencies}
						// 		/>
						// 	)}
						// 	keyExtractor={(item) => item.txid}
						// 	itemLayoutAnimation={LinearTransition}
						// />
					)}
				</ScrollView>
			</Box>
		</>
	);
};
