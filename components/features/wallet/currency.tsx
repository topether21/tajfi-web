import { TetherUSDT } from "@/components/icons/tether";
import { Avatar } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ChevronDownIcon, Icon } from "@/components/ui/icon";

import { VStack } from "@/components/ui/vstack";
import { useStore } from "@nanostores/react";
import { TouchableOpacity, View } from "react-native";
import { $assetId } from "./hooks/asset-id-store";
import { useBalances } from "./hooks/use-balances";
import { HEX_COLORS } from "@/components/ui/gluestack-ui-provider/config";

export const CurrencySelector = ({ onPress }: { onPress?: () => void }) => {
	const { currencies } = useBalances();
	const assetId = useStore($assetId);
	const currency = currencies.get(assetId);
	if (!currency) return null;
	return (
		<View>
			<TouchableOpacity onPress={() => onPress?.()}>
				<VStack space="2xl">
					<HStack space="md">
						<Avatar className="bg-background-0">
							<Icon as={TetherUSDT} size="xl" className="stroke-white" />
						</Avatar>
						<Box className="align-center justify-center">
							<Box className="flex-row items-center justify-center space-x-2">
								<Heading size="sm" className="text-white">
									{currency}
								</Heading>
								<Icon
									as={ChevronDownIcon}
									size="xl"
									className="stroke-background-tajfi-deep-blue"
								/>
							</Box>
						</Box>
					</HStack>
				</VStack>
			</TouchableOpacity>
		</View>
	);
};
