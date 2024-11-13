import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	interpolate,
	Extrapolation,
	type SharedValue,
} from "react-native-reanimated";
import type { OnboardingItem } from "./types";

const PaginationComp = ({
	i,
	x,
	screenWidth,
}: { i: number; x: SharedValue<number>; screenWidth: number }) => {
	const animatedDotStyle = useAnimatedStyle(() => {
		const widthAnimation = interpolate(
			x.value,
			[(i - 1) * screenWidth, i * screenWidth, (i + 1) * screenWidth],
			[10, 20, 10],
			Extrapolation.CLAMP,
		);
		const opacityAnimation = interpolate(
			x.value,
			[(i - 1) * screenWidth, i * screenWidth, (i + 1) * screenWidth],
			[0.5, 1, 0.5],
			Extrapolation.CLAMP,
		);
		return {
			width: widthAnimation,
			opacity: opacityAnimation,
		};
	});
	return <Animated.View style={[styles.dots, animatedDotStyle]} />;
};

export const OnboardingPagination = ({
	data,
	x,
	screenWidth,
}: {
	data: OnboardingItem[];
	x: SharedValue<number>;
	screenWidth: number;
}) => {
	return (
		<View style={styles.paginationContainer}>
			{data.map((item, i) => {
				return (
					<PaginationComp i={i} key={item.id} x={x} screenWidth={screenWidth} />
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	paginationContainer: {
		flexDirection: "row",
		height: 40,
		justifyContent: "center",
		alignItems: "center",
	},
	dots: {
		height: 10,
		backgroundColor: "orange",
		marginHorizontal: 10,
		borderRadius: 5,
	},
});
