import type { AssetBalance } from "@/components/features/wallet/hooks/use-balances";
import { CurrencyLogoIcon } from "@/components/icons/currency-logo";
import { Avatar } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
	item: AssetBalance;
	onPress: () => void;
};

export const RenderCurrencyItem = ({ item, onPress }: Props) => {
	const assetId = item.assetId ?? item.name;
	return (
		<TouchableOpacity style={[styles.container]} onPress={onPress}>
			<VStack space="2xl">
				<HStack space="md">
					<Avatar className="bg-">
						<CurrencyLogoIcon
							assetId={assetId}
							name={item.name}
							height={30}
							width={30}
						/>
					</Avatar>
					<Box className="align-center justify-center">
						<Box className="flex-row items-center justify-center space-x-2">
							<Heading size="sm" className="text-white">
								{item.name}
							</Heading>
							<Text className="text-white">{item.amount}</Text>
						</Box>
					</Box>
				</HStack>
			</VStack>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 14,
		marginHorizontal: 8,
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
	},
});
