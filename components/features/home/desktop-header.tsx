import { TajfiLoginButton } from "@/components/containers/tajfi-login-button";
import { TajfiNameLogo } from "@/components/containers/tajfi-logos/tajfi-name-logo";
import { Box } from "@/components/ui/box";
import { useSizes } from "@/hooks/useSizes";
import { clsx } from "clsx";
import { ConnectWalletModal } from "../wallet/connect-wallet";
import { useHomeLogin } from "./use-home-login";

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
				"backdrop-blur-md py-4 px-6 flex flex-row justify-between items-center z-20 relative min-h-fit",
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
				wallets={wallets}
				login={login}
			/>
		</Box>
	);
};
