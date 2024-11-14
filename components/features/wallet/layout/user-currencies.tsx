import {
	Actionsheet,
	ActionsheetBackdrop,
	ActionsheetContent,
	ActionsheetDragIndicator,
	ActionsheetDragIndicatorWrapper,
	ActionsheetFlatList,
} from "@/components/ui/actionsheet";
import { type AssetBalance, useBalances } from "../hooks/use-balances";
import { RenderCurrencyItem } from "./user-currency";

export const UserCurrencies = ({
	isOpen,
	handleClose,
}: {
	isOpen: boolean;
	handleClose: (assetId?: string) => void;
}) => {
	const { userBalances } = useBalances();
	return (
		<Actionsheet isOpen={isOpen} onClose={handleClose}>
			<ActionsheetBackdrop />
			<ActionsheetContent>
				<ActionsheetDragIndicatorWrapper>
					<ActionsheetDragIndicator />
				</ActionsheetDragIndicatorWrapper>
				<ActionsheetFlatList
					data={userBalances}
					renderItem={({ item }) => (
						<RenderCurrencyItem
							item={item as AssetBalance}
							onPress={() => handleClose((item as AssetBalance).assetId)}
						/>
					)}
					keyExtractor={(item) => (item as AssetBalance).assetId}
				/>
			</ActionsheetContent>
		</Actionsheet>
	);
};
