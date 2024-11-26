import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
	useSharedValue,
	withSpring,
	useAnimatedStyle,
	interpolate,
} from "react-native-reanimated";
import {
	TAB_BAR_ACTIVE_ICON_COLOR,
	TAB_BAR_ACTIVE_LABEL_COLOR,
	TAB_BAR_ICON_COLOR,
	TAB_BAR_LABEL_COLOR,
} from "./colors";
import { HEX_COLORS } from "@/components/ui/gluestack-ui-provider/config";

type FeatherIconProps = {
	color?: string;
	size?: number;
};

const icons = {
	send: (props: FeatherIconProps) => (
		<Feather name="send" size={24} color="black" {...props} />
	),
	receive: (props: FeatherIconProps) => (
		<Feather name="download" size={24} color="black" {...props} />
	),
	history: (props: FeatherIconProps) => (
		<Entypo name="back-in-time" size={24} color="black" {...props} />
	),
};

export const TabBarButton = ({
	options,
	onPress,
	onLongPress,
	isFocused,
	label,
	routeName,
	href,
}: {
	options: BottomTabNavigationOptions;
	onPress: () => void;
	onLongPress: () => void;
	isFocused: boolean;
	label: string;
	routeName: string;
	href: string | undefined;
}) => {
	const scale = useSharedValue(0);

	const animatedTextStyle = useAnimatedStyle(() => {
		return {
			opacity: scale.value,
		};
	});

	const animatedIconStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: interpolate(scale.value, [0, 1], [1.2, 1]) }],
			top: interpolate(scale.value, [0, 1], [12, 0]),
		};
	});

	useEffect(() => {
		scale.value = isFocused
			? withSpring(0, { duration: 350 })
			: withSpring(1, { duration: 350 });
	}, [isFocused, scale]);

	return (
		<PlatformPressable
			accessibilityState={isFocused ? { selected: true } : {}}
			accessibilityLabel={options.tabBarAccessibilityLabel}
			testID={options.tabBarButtonTestID}
			onPress={onPress}
			onLongPress={onLongPress}
			style={styles.tabBarItem}
			href={href}
		>
			<Animated.View style={animatedIconStyle}>
				{icons[routeName as keyof typeof icons]({
					color: isFocused ? HEX_COLORS.tajfiWhite : HEX_COLORS.tajfiWhite,
				})}
			</Animated.View>
			<Animated.Text
				style={[
					{
						color: isFocused ? HEX_COLORS.tajfiDeepBlue : HEX_COLORS.tajfiWhite,
					},
					animatedTextStyle,
				]}
			>
				{label}
			</Animated.Text>
		</PlatformPressable>
	);
};

const styles = StyleSheet.create({
	tabBarItem: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 5,
	},
});
