import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react-native";
import type { FC } from "react";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";

interface FilterControlsProps {
	searchTerm: string;
	setSearchTerm: (value: string) => void;
	sortBy: string;
	setSortBy: (value: string) => void;
	isGridView: boolean;
	setIsGridView: (value: boolean) => void;
	totalItems: number;
	y: SharedValue<number>;
}

export const FilterControls: FC<FilterControlsProps> = ({
	searchTerm,
	setSearchTerm,
	sortBy,
	setSortBy,
	isGridView,
	setIsGridView,
	totalItems,
	y,
}) => {
	const searchInputStyle = useAnimatedStyle(() => {
		const isHidden = y.value > 50;
		return {
			// transform: [
			// 	{
			// 		translateY: withTiming(isHidden ? -100 : 0, { duration: 300 }),
			// 	},
			// ],
			opacity: withTiming(isHidden ? 0 : 1, { duration: 500 }),
			height: withTiming(isHidden ? 0 : 50, { duration: 500 }),
			width: "100%",
			paddingBottom: -16,
		};
	});
	if (totalItems === 0) return null;
	return (
		<HStack className="container mx-auto flex-row gap-4 bg-background pb-2">
			{/* Animated search input */}
			<Animated.View style={searchInputStyle}>
				<Box className="relative flex-grow">
					<Input>
						<InputSlot className="pl-3">
							<InputIcon as={SearchIcon} />
						</InputSlot>
						<InputField
							placeholder="Search..."
							onChangeText={setSearchTerm}
							value={searchTerm}
						/>
					</Input>
				</Box>
			</Animated.View>
			{/* <Center>
				<Pressable
					onPress={() => setIsGridView(!isGridView)}
					aria-label="Toggle view"
				>
					{isGridView ? (
						<GridIcon className="stroke-background-tajfi-deep-blue" />
					) : (
						<ListIcon className="stroke-background-tajfi-deep-blue" />
					)}
				</Pressable>
			</Center> */}
		</HStack>
	);
};
