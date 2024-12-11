import { Avatar } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ChevronDownIcon, Icon } from "@/components/ui/icon";

import { CurrencyLogoIcon } from "@/components/icons/currency-logo";
import { VStack } from "@/components/ui/vstack";
import { useStore } from "@nanostores/react";
import { TouchableOpacity, View } from "react-native";
import { $assetId } from "../../../store/asset-id-store";
import { useCurrencies } from "./hooks/use-balances";
import { DEFAULT_ASSET_ID, DEFAULT_ASSET_NAME } from "@/libs/constants";

export const CurrencySelector = ({ onPress }: { onPress?: () => void }) => {
	const currencies = useCurrencies();
	const assetId = useStore($assetId) || DEFAULT_ASSET_ID;
	const currency = currencies.get(assetId) || DEFAULT_ASSET_NAME;
	return (
		<View>
			<TouchableOpacity onPress={() => onPress?.()}>
				<VStack space="2xl">
					<HStack space="md">
						<Avatar className="bg-background-0">
							<CurrencyLogoIcon
								assetId={assetId}
								height={30}
								width={30}
							/>
						</Avatar>
						<Box className="align-center justify-center">
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
						</Box>
					</HStack>
				</VStack>
			</TouchableOpacity>
		</View>
	);
};
