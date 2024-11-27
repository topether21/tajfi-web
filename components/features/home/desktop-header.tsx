import { ConnectWalletModal } from "../wallet/connect-wallet";
import { useHomeLogin } from "./use-home-login";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { useSizes } from "@/hooks/useSizes";
import { TajfiNameLogo } from "@/components/containers/tajfi-logos/tajfi-name-logo";
import { clsx } from "clsx";
import { TajfiLoginButton } from "@/components/containers/tajfi-login-button";

export const DesktopHeader = () => {
	const { isMobile } = useSizes();
	const {
		showModal,
		setShowModal,
		wallets,
		loginButtonText,
		login,
		profile,
		logout,
		isLoading,
	} = useHomeLogin();
	if (isMobile) return null;
	return (
		<Box
			className={clsx(
				"backdrop-blur-md py-4 px-6 flex flex-row justify-between items-center z-20 relative",
				profile ? "bg-background-tajfi-light-blue" : "bg-transparent",
			)}
		>
			<TajfiNameLogo width={53} height={44} />
			<ConnectWalletModal
				showModal={showModal}
				onClose={() => setShowModal(false)}
				wallets={wallets}
				login={login}
			/>
			<TajfiLoginButton
				profile={profile}
				logout={logout}
				loginButtonText={loginButtonText}
				setShowModal={setShowModal}
				isLoading={isLoading}
			/>
		</Box>
	);
};
