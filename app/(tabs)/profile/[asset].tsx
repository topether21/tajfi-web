import { Box } from "@/components/ui/box";
import { HEX_COLORS } from "@/components/ui/gluestack-ui-provider/config";
import { Heading } from "@/components/ui/heading";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import clsx from "clsx";
import { ScrollView } from "react-native";
import { FadeIn, FadeOut } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import useTimeout from "react-use/lib/useTimeout";

export default function AssetPage() {
	const [isLoading] = useTimeout(1000);
	return (
		<>
			<Box className="flex-1 items-start justify-start px-4 bg-background-0">
				<Heading size="lg" className="mb-4 text-background-tajfi-deep-blue">
					My Assets
				</Heading>
				<ScrollView
					className={clsx(
						"w-full h-full",
						isLoading() && "flex-1 items-center justify-center",
					)}
				>
					{isLoading() ? (
						<Spinner size="small" color={HEX_COLORS.tajfiDeepBlue} />
					) : (
						<Animated.View entering={FadeIn} exiting={FadeOut}>
							<Text>Asset</Text>
						</Animated.View>
					)}
				</ScrollView>
			</Box>
		</>
	);
}
