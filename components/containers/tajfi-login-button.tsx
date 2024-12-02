import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import type { WalletKeys, WalletProvider } from "@/libs/wallet/types";

export const TajfiLoginButton = ({
	profile,
	logout,
	loginButtonText,
	setShowModal,
	isLoading,
	wallets,
	login,
}: {
	profile: WalletKeys | null;
	logout?: () => void;
	loginButtonText: string;
	setShowModal: (show: boolean) => void;
	isLoading: boolean;
	wallets: WalletProvider[];
	login: (provider: WalletProvider) => Promise<void>;
}) => {
	const onlyOneWallet = wallets.length === 1;
	const handleLoginAction = () => {
		if (profile) return logout?.();
		if (onlyOneWallet) return login(wallets[0]);
		setShowModal(true);
	};
	return (
		<Box className="justify-center flex-1 items-end">
			<Button
				size="xl"
				variant="solid"
				action="primary"
				className="rounded-full"
				onPress={handleLoginAction}
				accessibilityLabel={profile ? "Logout" : loginButtonText}
				disabled={isLoading}
			>
				<ButtonText>{isLoading ? "Please wait..." : (profile ? "Logout" : loginButtonText)}</ButtonText>
			</Button>
		</Box>
	);
};
