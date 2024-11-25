import { useSizes } from "@/hooks/useSizes";
import { clsx } from "clsx";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { ConnectWalletModal } from "../wallet/connect-wallet";

import { onboardingStyles } from "./styles";
import { HomeContainer } from "../home/home";
import { useHomeLogin } from "../home/use-home-login";


export const OnboardingScreen = () => {
	const { wallets, loginButtonText, profile, showModal, setShowModal, login, isLoading } = useHomeLogin();
	const { isMobile, isTablet, isSmallScreen, isLargeScreen } = useSizes();

	const isMobileOrTablet = isMobile || isTablet;

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

	if (!isMobileOrTablet) {
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

		</SafeAreaView>
	);
};
