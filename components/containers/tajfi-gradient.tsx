import type { ReactNode } from "react";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { HEX_COLORS } from "@/components/ui/gluestack-ui-provider/config";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import clsx from "clsx";

export const TajfiGradient = ({
	children,
	className,
}: { children?: ReactNode; className?: string }) => {
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
				{children}
			</Animated.View>
		</LinearGradient>
	);
};
