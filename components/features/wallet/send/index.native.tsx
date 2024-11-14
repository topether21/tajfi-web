import { useTabBarVisibility } from "@/components/containers/tab-bar/ tab-bar-visibility-context";
import { CurrencySelector } from "@/components/features/wallet/currency";
import {
	BottomSheet,
	BottomSheetBackdrop,
	BottomSheetContent,
	BottomSheetDragIndicator,
	BottomSheetItem,
	BottomSheetItemText,
	BottomSheetPortal,
	BottomSheetTrigger,
} from "@/components/ui/bottomsheet";
import { Box } from "@/components/ui/box";

// TODO: this is a draft for the native implementation
const SendPage = () => {
	const { setIsVisible } = useTabBarVisibility();
	return (
		<Box className="flex-1 items-start justify-start bg-background-0">
			<BottomSheet
				onClose={() => {
					setIsVisible(true);
				}}
				onOpen={() => {
					setIsVisible(false);
				}}
			>
				<BottomSheetTrigger>
					<Box className="p-4">
						<CurrencySelector />
					</Box>
				</BottomSheetTrigger>
				<BottomSheetPortal
					snapPoints={["25%", "50%"]}
					backdropComponent={BottomSheetBackdrop}
					handleComponent={BottomSheetDragIndicator}
					onChange={(index) => {
						if (index === -1) {
							setIsVisible(true);
						}
					}}
				>
					<BottomSheetContent>
						<BottomSheetItem>
							<BottomSheetItemText>Item 1</BottomSheetItemText>
						</BottomSheetItem>
						<BottomSheetItem>
							<BottomSheetItemText>Item 2</BottomSheetItemText>
						</BottomSheetItem>
						<BottomSheetItem>
							<BottomSheetItemText>Item 3</BottomSheetItemText>
						</BottomSheetItem>
					</BottomSheetContent>
				</BottomSheetPortal>
			</BottomSheet>
		</Box>
	);
};

export default SendPage;
