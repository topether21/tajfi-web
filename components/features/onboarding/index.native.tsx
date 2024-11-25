import { Center } from "@/components/ui/center";
import { useWindowDimensions } from "@/hooks/use-window-dimensions";
import { useSizes } from "@/hooks/useSizes";
import { clsx } from "clsx";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { ConnectWalletModal } from "../wallet/connect-wallet";
import { onboardingData } from "./data.web";
import { OnboardingButtonScrollView } from "./onboarding-button-scrollview";
import { onboardingStyles } from "./styles";
import { HomeContainer } from "../home/home";
import { useHomeLogin } from "../home/use-home-login";

const RenderStaticItem = ({
	item,
	screenWidth,
	isMobile,
	isTablet,
	isSmallScreen,
	isLargeScreen,
}: {
	item: (typeof onboardingData)[0];
	screenWidth: number;
	isMobile: boolean;
	isTablet: boolean;
	isSmallScreen: boolean;
	isLargeScreen: boolean;
}) => {
	const width = isMobile
		? screenWidth * 0.6
		: isTablet
			? screenWidth * 0.7
			: isSmallScreen
				? screenWidth * 0.4
				: isLargeScreen
					? screenWidth * 0.3
					: screenWidth;
	const height = width;
	return (
		<View style={[onboardingStyles.itemContainer, { width, height }]}>
			{item.asset && (
				<LottieView
					loop
					autoPlay
					style={{
						backgroundColor: "transparent",
						width,
						height,
					}}
					source={item.asset}
				/>
			)}
			<View>
				<Text
					className="text-center text-white"
					style={{
						fontSize: 82,
					}}
				>
					{item.title}
				</Text>
				<Text className="text-center text-xl py-4 text-white">
					{item.text1}
				</Text>

				{!isMobile && (
					<Text className="text-center text-xl py-4 text-white">
						{item.text2}
					</Text>
				)}
			</View>
		</View>
	);
};

export const OnboardingScreen = () => {
	const { wallets, loginButtonText, profile, showModal, setShowModal, login, isLoading } = useHomeLogin();
	const { isMobile, isTablet, isSmallScreen, isLargeScreen } = useSizes();
	const { width: SCREEN_WIDTH } = useWindowDimensions();
	const scrollViewRef = useRef<ScrollView>(null);
	// It is used to animate the button scrollview, but it is disabled for now
	const isAtEnd = useSharedValue(true);

	useEffect(() => {
		if (profile) {
			router.replace("/(tabs)/send");
		}
	}, [profile]);

	// TODO: add a loading state??
	if (profile)
		return (
			<SafeAreaView
				style={onboardingStyles.container}
				className={clsx("py-10", isMobile && "py-5")}
			/>
		);

	if (!isMobile) {
		return <HomeContainer />
	}

	return (
		<SafeAreaView
			style={onboardingStyles.container}
			className={clsx("py-10", isMobile && "py-5")}
		>
			<ConnectWalletModal
				showModal={showModal}
				onClose={() => setShowModal(false)}
				wallets={wallets}
				login={login}
			/>
			<ScrollView
				ref={scrollViewRef}
				scrollEventThrottle={16}
				className="flex-1 items-center justify-center"
			>
				{onboardingData.map((item) => (
					<RenderStaticItem
						key={item.id}
						item={item}
						screenWidth={SCREEN_WIDTH}
						isMobile={isMobile}
						isTablet={isTablet}
						isSmallScreen={isSmallScreen}
						isLargeScreen={isLargeScreen}
					/>
				))}
			</ScrollView>
			<Center
				className={clsx(
					"mt-10",
					isMobile && "mt-5",
					isTablet || isSmallScreen || (isLargeScreen && "mb-20"),
				)}
			>
				<OnboardingButtonScrollView
					scrollViewRef={scrollViewRef}
					isAtEnd={isAtEnd}
					showModal={() => setShowModal(true)}
					isLoading={isLoading}
					loginButtonText={loginButtonText}
					login={login}
					shouldShowModal={showModal}
					defaultWalletProvider={wallets?.[0]}
				/>
			</Center>
		</SafeAreaView>
	);
};
