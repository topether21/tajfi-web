import { router } from "expo-router";
import type React from "react";
import {
	type FlatList,
	StyleSheet,
	TouchableWithoutFeedback,
} from "react-native";
import Animated, {
	type SharedValue,
	useAnimatedStyle,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import type { OnboardingItem } from "./types";

const ARROW_ICON = require("@/assets/icons/ArrowIcon.png");

export const OnboardingButton = ({
	flatListRef,
	flatListIndex,
	dataLength,
}: {
	flatListRef: React.RefObject<FlatList<OnboardingItem>>;
	flatListIndex: SharedValue<number>;
	dataLength: number;
}) => {
	const buttonAnimationStyle = useAnimatedStyle(() => {
		return {
			width:
				flatListIndex.value === dataLength - 1
					? withSpring(140)
					: withSpring(60),
			height: 60,
		};
	});
	const arrowAnimationStyle = useAnimatedStyle(() => {
		return {
			width: 30,
			height: 30,
			opacity:
				flatListIndex.value === dataLength - 1 ? withTiming(0) : withTiming(1),
			transform: [
				{
					translateX:
						flatListIndex.value === dataLength - 1
							? withTiming(100)
							: withTiming(0),
				},
			],
		};
	});
	const textAnimationStyle = useAnimatedStyle(() => {
		return {
			opacity:
				flatListIndex.value === dataLength - 1 ? withTiming(1) : withTiming(0),
			transform: [
				{
					translateX:
						flatListIndex.value === dataLength - 1
							? withTiming(0)
							: withTiming(-100),
				},
			],
		};
	});
	return (
		<TouchableWithoutFeedback
			onPress={() => {
				if (flatListIndex.value < dataLength - 1) {
					flatListRef.current?.scrollToIndex({
						index: flatListIndex.value + 1,
					});
				} else {
					router.push("/(tabs)/send");
				}
			}}
		>
			<Animated.View style={[styles.container, buttonAnimationStyle]}>
				<Animated.Text style={[styles.textButton, textAnimationStyle]}>
					Start
				</Animated.Text>
				<Animated.Image
					source={ARROW_ICON}
					style={[styles.arrow, arrowAnimationStyle]}
				/>
			</Animated.View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "orange",
		padding: 10,
		borderRadius: 100,
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
	},
	arrow: {
		position: "absolute",
	},
	textButton: { color: "white", fontSize: 16, position: "absolute" },
});
