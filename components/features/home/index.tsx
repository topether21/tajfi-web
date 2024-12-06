import { useState, useEffect } from "react";
import { TajfiLogo } from "@/components/containers/tajfi-logos/tajfi-logo";
import { TajfiNameLogo } from "@/components/containers/tajfi-logos/tajfi-name-logo";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { useSizes } from "@/hooks/useSizes";
import { SafeAreaView } from "react-native";
import { ConnectWalletModal } from "../wallet/connect-wallet";
import { useHomeLogin } from "./use-home-login";

import { TajfiGradient } from "@/components/containers/tajfi-gradient";
import { TajfiLoginButton } from "@/components/containers/tajfi-login-button";
import { HEX_COLORS } from "@/components/ui/gluestack-ui-provider/config";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { APP_FOOTER_DESCRIPTION } from "@/libs/constants";
import { isWebView } from "@/libs/utils";
import type { WalletKeys, WalletProvider } from "@/libs/wallet/types";
import clsx from "clsx";
import { Redirect } from "expo-router";
import { Github } from "lucide-react-native";

export const Footer = () => (
	<HStack className="w-full justify-between items-center p-6 bg-background-tajfi-dark">
		<Text size="sm" className="text-background-tajfi-white">
			{APP_FOOTER_DESCRIPTION}
		</Text>

		<Box className="flex space-x-5">
			<a
				href="https://github.com/habibitcoin/tajfi-server"
				className="text-muted-foreground hover:text-primary transition-colors"
				rel="noopener noreferrer"
				target="_blank"
			>
				<Github className="w-7 h-7" color={HEX_COLORS.tajfiWhite} />
			</a>
		</Box>
	</HStack>
);

type HomeViewProps = {
	wallets: WalletProvider[];
	showModal: boolean;
	setShowModal: (show: boolean) => void;
	login: (wallet: WalletProvider) => Promise<void>;
	loginButtonText: string;
	profile: WalletKeys | null;
	logout: () => void;
	isLoading: boolean;
};

const MobileHomeView = ({
	wallets,
	showModal,
	setShowModal,
	login,
	loginButtonText,
	profile,
	logout,
	isLoading,
}: HomeViewProps) => (
	<SafeAreaView
		className={clsx(
			"w-full h-full items-center flex flex-col",
			isWebView() ? "p-4" : "p-10",
		)}
	>
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
			<Box className={clsx(isWebView() && "pb-11")}>
				<TajfiLoginButton
					profile={profile}
					logout={logout}
					loginButtonText={loginButtonText}
					setShowModal={setShowModal}
					isLoading={isLoading}
					wallets={wallets}
					login={login}
				/>
			</Box>
		</Box>
		<ConnectWalletModal
			showModal={showModal}
			onClose={() => setShowModal(false)}
			wallets={wallets}
			login={login}
		/>
	</SafeAreaView>
);

const DesktopHomeHero = ({
	setShowModal,
	loginButtonText,
	profile,
	logout,
	showModal,
	wallets,
	login,
	isLoading,
}: HomeViewProps) => (
	<VStack className="w-full min-h-screen flex flex-col justify-between container mx-auto">
		{/* Hero Section */}
		<HStack className="w-full flex-1 items-center py-12">
			<Box className="flex-1 p-6">
				<TajfiNameLogo />
				<Heading size="xl" className="text-white text-start mt-10" bold>
					A secure, privacy-first digital wallet using Taproot Assets.
				</Heading>
				<Box className="pt-11">
					<TajfiLoginButton
						profile={profile}
						logout={logout}
						loginButtonText={loginButtonText}
						setShowModal={setShowModal}
						isLoading={isLoading}
						wallets={wallets}
						login={login}
					/>
				</Box>
			</Box>
			<Box className="flex-1 p-6 flex justify-center items-center">
				<TajfiLogo />
			</Box>
		</HStack>

		{/* Footer Section */}
		<Footer />

		{/* Connect Wallet Modal */}
		<ConnectWalletModal
			showModal={showModal}
			onClose={() => setShowModal(false)}
			wallets={wallets}
			login={login}
		/>
	</VStack>
);

const RedirectToSend = () => <Redirect href="/(tabs)/send" />;

const HardRedirectToSend = () => {
	window.location.href = "/send";
	return null;
};

export const HomeScreen = () => {
	const {
		wallets,
		loginButtonText,
		profile,
		showModal,
		setShowModal,
		login,
		isLoading,
		logout,
	} = useHomeLogin();
	const { isSmall } = useSizes();

	const [redirectPath, setRedirectPath] = useState<"/send" | "/(tabs)/send" | null>(null);

	useEffect(() => {
		if (profile && !isLoading) {
			// Hack for OneKey webview
			if (isWebView()) {
				setRedirectPath("/send");
			} else {
				setRedirectPath("/(tabs)/send");
			}
		}
	}, [profile, isLoading]);

	if (redirectPath === "/(tabs)/send") {
		return <RedirectToSend />;
	}

	if (redirectPath === "/send") {
		return <HardRedirectToSend />;
	}

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
					profile={profile}
					logout={logout}
					isLoading={isLoading}
				/>
			) : (
				<SafeAreaView className="w-full h-full items-center flex-1 p-10">
					<Box className="container mx-auto">
						<DesktopHomeHero
							wallets={wallets}
							showModal={showModal}
							setShowModal={setShowModal}
							login={login}
							loginButtonText={loginButtonText}
							profile={profile}
							logout={logout}
							isLoading={isLoading}
						/>
					</Box>
				</SafeAreaView>
			)}
		</TajfiGradient>
	);
};
