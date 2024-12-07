import type { ReactNode } from "react";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { Text } from "@/components/ui/text";
import { HEX_COLORS } from "@/components/ui/gluestack-ui-provider/config";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import clsx from "clsx";
import type { WalletKeys } from "@/libs/wallet/types";

export const TajfiGradient = ({
	children,
	className,
	isLoading,
	profile,
}: { children?: ReactNode; className?: string; isLoading?: boolean; profile?: WalletKeys | null; }) => {
	return (
		<LinearGradient
			className={clsx("w-full items-center flex-1 justify-center", className)}
			colors={[HEX_COLORS.tajfiDeepBlue, HEX_COLORS.tajfiBlue]}
			start={[0.5, 0]}
			end={[0.5, 1]}
		>
			<Animated.View
				entering={FadeIn}
				exiting={FadeOut}
				accessibilityLabel="tajfi-gradient"
				accessibilityRole="none"
			>
				<Text>
					{JSON.stringify({ profile, isLoading }, null, 2)}
				</Text>
				{children}
			</Animated.View>
		</LinearGradient>
	);
};
