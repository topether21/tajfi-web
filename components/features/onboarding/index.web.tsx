import { useSizes } from "@/hooks/useSizes";
import { clsx } from "clsx";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { ConnectWalletModal } from "../wallet/connect-wallet";
import { onboardingStyles } from "./styles";
import { HomeContainer } from "../home/home";
import { useHomeLogin } from "../home/use-home-login";

import { LinearGradient } from "@/components/ui/linear-gradient"
import { HEX_COLORS } from "@/components/ui/gluestack-ui-provider/config";
import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { TajfiNameLogo } from "@/components/containers/tajfi-logos/tajfi-name-logo";
import { TajfiLogo } from "@/components/containers/tajfi-logos/tajfi-logo";


export const OnboardingScreen = () => {
	const { wallets, loginButtonText, profile, showModal, setShowModal, login, isLoading } = useHomeLogin();
	const { isMobile, isTablet, isSmallScreen, isLargeScreen } = useSizes();

	const isMobileOrTablet = isMobile || isTablet;


	useEffect(() => {
		if (profile) {
			router.replace("/(tabs)/send");
		}
	}, [profile]);

	return (
		<LinearGradient
			className="w-full items-center flex-1 justify-center"
			colors={[HEX_COLORS.tajfiDeepBlue, HEX_COLORS.tajfiBlue]}
			start={[0.5, 0]}
			end={[0.5, 1]}
		>
			{isMobileOrTablet ? <SafeAreaView className="w-full h-full items-center flex flex-col p-10">
				<Box className="w-full h-full items-center flex flex-col">
					<HStack className="items-center justify-start w-full mb-9">
						<TajfiNameLogo />
					</HStack>
					<Heading size="lg" className="text-white text-start mb-6" bold={false}>
						A secure, privacy-first digital wallet using Taproot Assets.
					</Heading>
					<Box className="pb-11">
						<TajfiLogo />
					</Box>
					<Button size="xl" variant="solid" action="primary" className="rounded-full" >
						<ButtonText>Login</ButtonText>
					</Button>
				</Box>
			</SafeAreaView> : <HomeContainer />}
		</LinearGradient>
	);
};
