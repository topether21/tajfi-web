import {
	Actionsheet,
	ActionsheetBackdrop,
	ActionsheetContent,
	ActionsheetDragIndicator,
	ActionsheetDragIndicatorWrapper,
	ActionsheetFlatList,
} from "@/components/ui/actionsheet";
import { type AssetBalance, useUserBalances } from "../hooks/use-balances";
import { RenderCurrencyItem } from "./user-currency";

export const UserCurrencies = ({
	isOpen,
	handleClose,
}: {
	isOpen: boolean;
	handleClose: (assetId?: string) => void;
}) => {
	const userBalances = useUserBalances();
	return (
		<Actionsheet isOpen={isOpen} onClose={handleClose}>
			<ActionsheetBackdrop className="bg-background-tajfi-blue" />
			<ActionsheetContent className="bg-background-tajfi-deep-blue border-background-tajfi-deep-blue">
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
