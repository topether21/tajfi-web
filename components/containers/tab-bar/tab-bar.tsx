import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useLinkBuilder } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { type LayoutChangeEvent, StyleSheet } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import {
	TAB_BAR_ACTIVE_BACKGROUND_COLOR,
	TAB_BAR_BACKGROUND_COLOR,
} from "./colors";
import { TabBarButton } from "./tab-bar-button";
import { useTabBarVisibility } from "./ tab-bar-visibility-context";
import { useSizes } from "@/hooks/useSizes";

export const BottomTabBar = ({
	state,
	descriptors,
	navigation,
}: BottomTabBarProps) => {
	const { isMobile } = useSizes();
	const opacity = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	const { buildHref } = useLinkBuilder();
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const buttonWidth = dimensions.width / (state.routes.length || 1);

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

	useEffect(() => {
		tabPositionX.value = withSpring(buttonWidth * state.index, {
			duration: 1500,
		});
	}, [state.index, buttonWidth, tabPositionX]);

	const circleSize = Math.min(dimensions.height - 15, buttonWidth - 25);

	const { isVisible } = useTabBarVisibility();

	useEffect(() => {
		opacity.value = withTiming(isVisible ? 1 : 0, { duration: 300 });
	}, [isVisible, opacity]);

	return (
		<Animated.View
			style={[styles.tabBar, animatedStyle]}
			onLayout={onTabBarLayout}
		>
			<Animated.View
				data-id="tab-bar-background"
				style={[
					animatedBackgroundStyle,
					{
						position: "absolute",
						backgroundColor: TAB_BAR_ACTIVE_BACKGROUND_COLOR,
						borderRadius: circleSize / 2,
						marginHorizontal: 12,
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
					tabPositionX.value = withSpring(buttonWidth * index, {
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
		bottom: 20,
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: TAB_BAR_BACKGROUND_COLOR,
		marginHorizontal: "auto",
		maxWidth: 270,
		width: "100%",
		paddingVertical: 15,
		borderRadius: 35,
		boxShadow: "0 10px 10px rgba(0, 0, 0, 0.1)",
		elevation: 1,
		alignSelf: "center",
	},
});

// ref: https://www.youtube.com/watch?v=GrLCS5ww030
