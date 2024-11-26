import { useSizes } from "@/hooks/useSizes";
import { router } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { ConnectWalletModal } from "../wallet/connect-wallet";
import { useHomeLogin } from "../home/use-home-login";

import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { TajfiNameLogo } from "@/components/containers/tajfi-logos/tajfi-name-logo";
import { TajfiLogo } from "@/components/containers/tajfi-logos/tajfi-logo";
import { useRendersCount } from "react-use/lib/useRendersCount";
import type { WalletProvider } from "@/libs/wallet/types";
import { TajfiGradient } from "@/components/containers/tajfi-gradient";

const MobileHomeView = ({
	wallets,
	showModal,
	setShowModal,
	login,
	loginButtonText,
}: {
	wallets: WalletProvider[];
	showModal: boolean;
	setShowModal: (show: boolean) => void;
	login: (wallet: WalletProvider) => Promise<void>;
	loginButtonText: string;
}) => (
	<SafeAreaView className="w-full h-full items-center flex flex-col p-10">
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
			<Button
				size="xl"
				variant="solid"
				action="primary"
				className="rounded-full"
				onPress={() => {
					if (wallets?.length > 1) {
						setShowModal(true);
					} else {
						login(wallets?.[0]);
					}
				}}
			>
				<ButtonText>{loginButtonText}</ButtonText>
			</Button>
		</Box>
		<ConnectWalletModal
			showModal={showModal}
			onClose={() => setShowModal(false)}
			wallets={wallets}
			login={login}
		/>
	</SafeAreaView>
);

export const OnboardingScreen = () => {
	const rendersCount = useRendersCount();
	console.log("rendersCount", rendersCount);

	const {
		wallets,
		loginButtonText,
		profile,
		showModal,
		setShowModal,
		login,
		isLoading,
	} = useHomeLogin();
	const { isSmall } = useSizes();

	useEffect(() => {
		if (profile) {
			router.replace("/(tabs)/send");
		}
	}, [profile]);

	if (isLoading || profile) {
		return <TajfiGradient />;
	}

	return (
		<TajfiGradient>
			{isSmall ? (
				<MobileHomeView
					wallets={wallets}
					showModal={showModal}
					setShowModal={setShowModal}
					login={login}
					loginButtonText={loginButtonText}
				/>
			) : (
				<Box className="w-full h-full flex-1 flex-row bg-fuchsia-800"></Box>
			)}
		</TajfiGradient>
	);
};
