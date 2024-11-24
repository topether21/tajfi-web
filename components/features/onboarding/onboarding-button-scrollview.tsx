import type { WalletProvider } from "@/libs/wallet/types";
import type React from "react";
import {
	type ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
} from "react-native";
import Animated, {
	type SharedValue,
	useAnimatedStyle,
	withSpring,
	withTiming,
} from "react-native-reanimated";

const ARROW_ICON = require("@/assets/icons/ArrowIcon.png");

export const OnboardingButtonScrollView = ({
	scrollViewRef,
	isAtEnd,
	showModal,
	isLoading,
	loginButtonText,
	login,
	shouldShowModal,
	defaultWalletProvider,
}: {
	scrollViewRef: React.RefObject<ScrollView>;
	isAtEnd: SharedValue<boolean>;
	showModal: () => void;
	isLoading: boolean;
	loginButtonText: string;
	login: (provider: WalletProvider) => Promise<void>;
	shouldShowModal: boolean;
	defaultWalletProvider: WalletProvider | null;
}) => {
	const buttonAnimationStyle = useAnimatedStyle(() => {
		return {
			width: isAtEnd.value ? withSpring(140) : withSpring(60),
			height: 60,
		};
	});
	const arrowAnimationStyle = useAnimatedStyle(() => {
		return {
			width: 30,
			height: 30,
			opacity: isAtEnd.value ? withTiming(0) : withTiming(1),
			transform: [
				{
					translateX: isAtEnd.value ? withTiming(100) : withTiming(0),
				},
			],
		};
	});
	const textAnimationStyle = useAnimatedStyle(() => {
		return {
			opacity: isAtEnd.value ? withTiming(1) : withTiming(0),
			transform: [
				{
					translateX: isAtEnd.value ? withTiming(0) : withTiming(-100),
				},
			],
		};
	});

	return (
		<TouchableWithoutFeedback
			onPress={() => {
				if (!isAtEnd.value) {
					scrollViewRef.current?.scrollToEnd({ animated: true });
				} else {
					if (shouldShowModal) {
						showModal();
					} else {
						if (!defaultWalletProvider) return;
						login(defaultWalletProvider);
					}
				}
			}}
		>
			<Animated.View style={[styles.container, buttonAnimationStyle]}>
				{!isLoading && (
					<Animated.Text style={[styles.textButton, textAnimationStyle]}>
						{loginButtonText}
					</Animated.Text>
				)}
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
		cursor: "pointer",
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
