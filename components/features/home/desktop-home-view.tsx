import { Github } from "lucide-react-native";
import { MotionDiv } from "./motion";
import clsx from "clsx";
import { Box } from "@/components/ui/box";

import { ConnectWalletModal } from "../wallet/connect-wallet";
import { useHomeLogin } from "./use-home-login";
import { Text } from "@/components/ui/text";
import {
	APP_DESCRIPTION,
	APP_FOOTER_DESCRIPTION,
	HOME_HERO_DESCRIPTION,
	APP_NAME,
} from "@/libs/constants";
import { TajfiLoginButton } from "@/components/containers/tajfi-login-button";
import { TajfiNameLogo } from "@/components/containers/tajfi-logos/tajfi-name-logo";
import { Heading } from "@/components/ui/heading";
import { HEX_COLORS } from "@/components/ui/gluestack-ui-provider/config";
import { VStack } from "@/components/ui/vstack";

export const DesktopHomeView = () => {
	const { showModal, setShowModal, wallets, loginButtonText, login, profile, logout } =
		useHomeLogin();

	return (
		<Box
			className={clsx("relative min-h-screen flex-1 flex-row overflow-hidden w-full")}
		>
			<VStack className="flex-1 w-full">
				<Box className="flex-grow flex justify-center px-6 sm:px-8 lg:px-10 py-16 relative z-10 w-full">
					<Box className="flex lg:flex-row">
						<Box className="lg:w-1/2 text-center lg:text-left mb-16 lg:mb-0">
							<MotionDiv
								className="text-6xl sm:text-7xl md:text-8xl font-extrabold mb-8 bg-clip-text"
								initial={{ opacity: 0, y: -30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 1 }}
							>
								<Heading size="4xl" className="text-background-tajfi-white">
									{APP_NAME}
								</Heading>
							</MotionDiv>
							<MotionDiv
								className="max-w-2xl mx-auto lg:mx-0 text-2xl mb-8"
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 1, delay: 0.3 }}
							>
								<Heading size="xl" className="text-background-tajfi-white">{APP_DESCRIPTION}</Heading>
							</MotionDiv>
							<MotionDiv
								className="max-w-2xl mx-auto lg:mx-0 text-lg mb-12"
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 1, delay: 0.5 }}
							>
								<Heading size="xl" className="text-background-tajfi-white" bold={false}>
									{HOME_HERO_DESCRIPTION}
								</Heading>
							</MotionDiv>

							<ConnectWalletModal
								showModal={showModal}
								onClose={() => setShowModal(false)}
								wallets={wallets}
								login={login}
							/>
							<TajfiLoginButton
								profile={profile}
								loginButtonText={loginButtonText}
								setShowModal={setShowModal}
							/>
						</Box>
						<Box className="lg:w-1/2 flex justify-center items-center">
							<TajfiNameLogo />
						</Box>
					</Box>
				</Box>

				<Box className="bg-card bg-opacity-60 backdrop-blur-lg py-10 px-6 relative z-10 w-full">
					<Box className="w-full mx-auto">
						<Box className="flex flex-col md:flex-row justify-between items-center">
							<Box className="mb-6 md:mb-0">
								<Heading size="xl" className="text-background-tajfi-white">{APP_NAME}</Heading>
								<Text size="sm" className="text-background-tajfi-white">{APP_FOOTER_DESCRIPTION}</Text>
							</Box>
							<Box className="flex space-x-5">
								<a
									href="https://github.com/habibitcoin/tajfi-server"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									<Github className="w-7 h-7" color={HEX_COLORS.tajfiWhite} />
								</a>
							</Box>
						</Box>
						{/* <Box className="mt-10 text-center text-base text-muted-foreground">
            © 2024 Asset Market. All rights reserved.
          </Box> */}
					</Box>
				</Box>
			</VStack>
		</Box>
	);
};
