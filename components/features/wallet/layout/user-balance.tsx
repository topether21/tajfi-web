import { CurrencySelector } from "@/components/features/wallet/currency";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { useStore } from "@nanostores/react";

import { LogOut } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { useWalletAuth } from "../connect-wallet/use-connect-wallet";
import { $assetId } from "../../../../store/asset-id-store";
import { useBalances } from "../hooks/use-balances";
import { useUserCurrencies } from "./use-user-currencies";
import { UserCurrencies } from "./user-currencies";
import { useSizes } from "@/hooks/useSizes";
import { NumberContainer } from "@/components/features/wallet/layout/number";
import { HEX_COLORS } from "@/components/ui/gluestack-ui-provider/config";

export const UserBalance = () => {
	const { isMobile } = useSizes();
	const { isOpen, handleClose, handleOpen } = useUserCurrencies();
	const { handleLogout } = useWalletAuth({});
	const { userBalances } = useBalances();
	const assetId = useStore($assetId);
	const currentAmount =
		userBalances.find((balance) => balance.assetId === assetId)?.amount || 0;
	return (
		<>
			<Box className="items-start justify-start bg-background-0">
				<Box className="pl-2 pr-4 py-4 flex-row items-center justify-between w-full">
					<CurrencySelector onPress={handleOpen} />
					{isMobile && (
						<TouchableOpacity onPress={handleLogout}>
							<LogOut size={24} color={HEX_COLORS.tajfiDeepBlue} />
						</TouchableOpacity>
					)}
				</Box>
				<Box className="pl-4">
					<HStack space="md">
						<Heading size="3xl" className="text-background-tajfi-deep-blue">
							Balance
						</Heading>
						<NumberContainer
							value={currentAmount}
							trend={false}
							className="text-3xl font-bold text-background-tajfi-deep-blue mb-2 items-center"
						/>
					</HStack>
				</Box>
				<UserCurrencies isOpen={isOpen} handleClose={handleClose} />
			</Box>
		</>
	);
};
