import { Text } from "@/components/ui/text";
import { useWindowDimensions } from "@/hooks/use-window-dimensions";
import LottieView from "lottie-react-native";
import React from "react";
import { type FlatList, View, type ViewToken } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedScrollHandler,
	useAnimatedRef,
	useAnimatedStyle,
	interpolate,
	Extrapolation,
	type SharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { onboardingData } from "./data.native";
import { OnboardingButton } from "./onboarding-button";
import { OnboardingPagination } from "./onboarding-pagination";
import { onboardingStyles } from "./styles";
import type { OnboardingItem } from "./types";

const RenderAnimatedItem = ({
	item,
	index,
	screenWidth,
	x,
}: {
	item: (typeof onboardingData)[0];
	index: number;
	screenWidth: number;
	x: SharedValue<number>;
}) => {
	const imageAnimationStyle = useAnimatedStyle(() => {
		const opacityAnimation = interpolate(
			x.value,
			[
				(index - 1) * screenWidth,
				index * screenWidth,
				(index + 1) * screenWidth,
			],
			[0, 1, 0],
			Extrapolation.CLAMP,
		);
		const translateYAnimation = interpolate(
			x.value,
			[
				(index - 1) * screenWidth,
				index * screenWidth,
				(index + 1) * screenWidth,
			],
			[100, 0, 100],
			Extrapolation.CLAMP,
		);
		return {
			opacity: opacityAnimation,
			width: screenWidth * 0.8,
			height: screenWidth * 0.8,
			transform: [{ translateY: translateYAnimation }],
		};
	});

	const textAnimationStyle = useAnimatedStyle(() => {
		const opacityAnimation = interpolate(
			x.value,
			[
				(index - 1) * screenWidth,
				index * screenWidth,
				(index + 1) * screenWidth,
			],
			[0, 1, 0],
			Extrapolation.CLAMP,
		);
		const translateYAnimation = interpolate(
			x.value,
			[
				(index - 1) * screenWidth,
				index * screenWidth,
				(index + 1) * screenWidth,
			],
			[100, 0, 100],
			Extrapolation.CLAMP,
		);

		return {
			opacity: opacityAnimation,
			transform: [{ translateY: translateYAnimation }],
		};
	});

	return (
		<View style={[onboardingStyles.itemContainer, { width: screenWidth }]}>
			<Animated.View style={imageAnimationStyle}>
				<LottieView
					style={{
						backgroundColor: "transparent",
						width: screenWidth * 0.8,
						height: screenWidth * 0.8,
					}}
					source={item.asset}
				/>
			</Animated.View>
			<Animated.View style={textAnimationStyle}>
				<View>
					<Text size="xl" bold className="text-center">
						{item.title}
					</Text>
					<Text size="lg" className="text-center">
						{item.text}
					</Text>
				</View>
			</Animated.View>
		</View>
	);
};

export const OnboardingScreen = () => {
	const { width: SCREEN_WIDTH } = useWindowDimensions();
	const flatListRef = useAnimatedRef<FlatList<OnboardingItem>>();
	const x = useSharedValue(0);
	const flatListIndex = useSharedValue(0);

	const onViewableItemsChanged = ({
		viewableItems,
	}: { viewableItems: ViewToken[] }) => {
		if (viewableItems[0].index !== null) {
			flatListIndex.value = viewableItems[0].index;
		}
	};

	const onScroll = useAnimatedScrollHandler({
		onScroll: (event) => {
			x.value = event.contentOffset.x;
		},
	});

	return (
		<SafeAreaView style={[onboardingStyles.container]}>
			<Animated.FlatList
				ref={flatListRef}
				onScroll={onScroll}
				data={onboardingData}
				renderItem={({ item, index }) => {
					return (
						<RenderAnimatedItem
							item={item}
							index={index}
							screenWidth={SCREEN_WIDTH}
							x={x}
						/>
					);
				}}
				keyExtractor={(item) => item.id.toString()}
				scrollEventThrottle={16}
				horizontal={true}
				bounces={false}
				pagingEnabled={true}
				showsHorizontalScrollIndicator={false}
				viewabilityConfig={{
					minimumViewTime: 300,
					viewAreaCoveragePercentThreshold: 10,
				}}
				onViewableItemsChanged={onViewableItemsChanged}
			/>
			<View style={onboardingStyles.bottomContainer}>
				<OnboardingPagination
					data={onboardingData}
					x={x}
					screenWidth={SCREEN_WIDTH}
				/>
				<OnboardingButton
					flatListRef={flatListRef}
					flatListIndex={flatListIndex}
					dataLength={onboardingData.length}
				/>
			</View>
		</SafeAreaView>
	);
};
