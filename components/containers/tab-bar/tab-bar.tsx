import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useLinkBuilder } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { type LayoutChangeEvent, StyleSheet } from "react-native";
import Animated, {
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";

import { TabBarButton } from "./tab-bar-button";
import { useTabBarVisibility } from "./ tab-bar-visibility-context";
import { HEX_COLORS } from "@/components/ui/gluestack-ui-provider/config";
import { useSizes } from "@/hooks/useSizes";

const TAB_BAR_HORIZONTAL_PADDING = 12;

export const BottomTabBar = ({
	state,
	descriptors,
	navigation,
}: BottomTabBarProps) => {
	const { isMobile, isTablet } = useSizes();
	const opacity = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	const { buildHref } = useLinkBuilder();
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const buttonWidth = dimensions.width / (state.routes.length || 1);

	console.log("dimensions", dimensions, buttonWidth);

	const onTabBarLayout = (event: LayoutChangeEvent) => {
		setDimensions({
			width: event.nativeEvent.layout.width,
			height: event.nativeEvent.layout.height,
		});
	};

	const tabPositionX = useSharedValue(0);
	const animatedBackgroundStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: tabPositionX.value }],
		};
	});

	const circleSize = Math.min(dimensions.height - 15, buttonWidth - 25);

	useEffect(() => {
		console.log("----> state.index", state.index, buttonWidth);
		tabPositionX.value = withSpring(
			buttonWidth * state.index + buttonWidth / 2 - circleSize / 2 - TAB_BAR_HORIZONTAL_PADDING,
			{
				duration: 1500,
			}
		);
	}, [state.index, buttonWidth, tabPositionX, circleSize]);

	const { isVisible } = useTabBarVisibility();

	useEffect(() => {
		opacity.value = withTiming(isVisible ? 1 : 0, { duration: 300 });
	}, [isVisible, opacity]);

	const isMobileOrTablet = isMobile || isTablet;


	// useAnimatedReaction(
	// 	() => {
	// 		return tabPositionX.value;
	// 	},
	// 	(currentValue, previousValue) => {
	// 		if (currentValue !== previousValue) {
	// 			console.log("----> currentValue", currentValue);
	// 		}
	// 	}
	// );

	return (
		<Animated.View
			style={[
				styles.tabBar,
				animatedStyle,
				{ maxWidth: isMobileOrTablet ? "100%" : 270 },
				{ borderRadius: isMobileOrTablet ? 0 : 35 },
				{ bottom: isMobileOrTablet ? 0 : 20 },
			]}
			onLayout={onTabBarLayout}
		>
			<Animated.View
				data-id="tab-bar-background"

				style={[
					animatedBackgroundStyle,
					{
						position: "absolute",
						borderRadius: circleSize / 2,
						backgroundColor: HEX_COLORS.tajfiBlue,
						marginHorizontal: TAB_BAR_HORIZONTAL_PADDING,
						height: circleSize,
						width: circleSize,
					},
				]}
			/>
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key];
				const label =
					options.tabBarLabel !== undefined
						? options.tabBarLabel
						: options.title !== undefined
							? options.title
							: route.name;

				const isFocused = state.index === index;

				const onPress = () => {
					tabPositionX.value = withSpring(buttonWidth * index + buttonWidth / 2 - circleSize / 2 - TAB_BAR_HORIZONTAL_PADDING, {
						duration: 1500,
					});
					const event = navigation.emit({
						type: "tabPress",
						target: route.key,
						canPreventDefault: true,
					});

					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name, route.params);
					}
				};

				const onLongPress = () => {
					navigation.emit({
						type: "tabLongPress",
						target: route.key,
					});
				};

				const href = buildHref(route.name, route.params);

				return (
					<TabBarButton
						key={route.name}
						options={options}
						onPress={onPress}
						onLongPress={onLongPress}
						isFocused={isFocused}
						label={label as string}
						routeName={route.name}
						href={href}
					/>
				);
			})}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	tabBar: {
		flexDirection: "row",
		position: "absolute",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: HEX_COLORS.tajfiDeepBlue,
		marginHorizontal: "auto",
		width: "100%",
		paddingVertical: 15,
		boxShadow: "0 10px 10px rgba(0, 0, 0, 0.1)",
		elevation: 1,
		alignSelf: "center",
	},
});

// ref: https://www.youtube.com/watch?v=GrLCS5ww030
