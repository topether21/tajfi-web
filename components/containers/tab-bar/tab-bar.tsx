import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useLinkBuilder } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { type LayoutChangeEvent, Platform, StyleSheet } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";

import { TabBarButton } from "./tab-bar-button";
import { useTabBarVisibility } from "./tab-bar-visibility-context";
import { HEX_COLORS } from "@/components/ui/gluestack-ui-provider/config";
import { useSizes } from "@/hooks/useSizes";
import useEffectOnce from "react-use/lib/useEffectOnce";

const TAB_BAR_HORIZONTAL_PADDING = 12;

export const BottomTabBar = ({
	state,
	descriptors,
	navigation,
}: BottomTabBarProps) => {
	const { isSmall } = useSizes();
	const opacity = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	const { buildHref } = useLinkBuilder();
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const buttonWidth = dimensions.width / (state.routes.length || 1);

	const onTabBarLayout = (event: LayoutChangeEvent) => {
		console.log("onTabBarLayout", event.nativeEvent.layout);
		setDimensions({
			width: event.nativeEvent.layout.width,
			height: event.nativeEvent.layout.height,
		});
	};

	const calculateTabPositionX = (index: number) => {
		console.log("calculateTabPositionX", { index, buttonWidth, circleSize, TAB_BAR_HORIZONTAL_PADDING });
		return buttonWidth * index + buttonWidth / 2 - circleSize / 2 - TAB_BAR_HORIZONTAL_PADDING;
	};

	const updateTabPositionX = () => {
		console.log("updateTabPositionX", state.index);
		tabPositionX.value = withSpring(
			calculateTabPositionX(state.index),
			{
				duration: 1500,
			},
		);
	};

	const tabPositionX = useSharedValue(0);
	const animatedBackgroundStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: tabPositionX.value }],
		};
	});

	const circleSize = Math.min(dimensions.height - 15, buttonWidth - 25);

	// biome-ignore lint/correctness/useExhaustiveDependencies: only depends on state.index
	useEffect(() => {
		updateTabPositionX();
	}, [state.index, dimensions]);

	console.log("dimensions", dimensions);

	return (
		<Animated.View
			style={[
				styles.tabBar,
				animatedStyle,
				{ maxWidth: isSmall ? "100%" : 270 },
				{ borderRadius: isSmall ? 0 : 35 },
				{ bottom: isSmall ? 0 : 20 },
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
					updateTabPositionX();
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
		...Platform.select({
			ios: {
				shadowColor: "rgba(0, 0, 0, 0.1)",
				shadowOffset: { width: 0, height: 10 },
				shadowOpacity: 1,
				shadowRadius: 10,
			},
			android: {
				elevation: 10,
			},
			web: {
				boxShadow: "0 10px 10px rgba(0, 0, 0, 0.1)",
			},
		}),
		alignSelf: "center",
	},
});

// ref: https://www.youtube.com/watch?v=GrLCS5ww030
