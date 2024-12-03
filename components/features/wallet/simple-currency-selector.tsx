import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ChevronDownIcon, Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { useStore } from "@nanostores/react";
import { TouchableOpacity } from "react-native";
import { $receiveAssetId } from "../../../store/asset-id-store";
import { useBalances } from "./hooks/use-balances";

export const SimpleCurrencySelector = ({
	handleOpen,
}: { handleOpen: () => void }) => {
	const { currencies } = useBalances();
	const receiveAssetId = useStore($receiveAssetId);
	const currency = currencies.get(receiveAssetId);
	if (!currency) return null;
	return (
		<VStack space="2xl">
			<HStack space="md">
				<TouchableOpacity
					className="align-center justify-center"
					onPress={handleOpen}
				>
					<Box className="flex-row items-center justify-center space-x-2">
						<Heading size="sm" className="text-background-tajfi-deep-blue">
							{currency}
						</Heading>
						<Icon
							as={ChevronDownIcon}
							size="xl"
							className="stroke-background-tajfi-deep-blue"
						/>
					</Box>
				</TouchableOpacity>
			</HStack>
		</VStack>
	);
};
