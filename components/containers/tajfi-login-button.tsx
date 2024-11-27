import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import type { WalletKeys } from "@/libs/wallet/types";

export const TajfiLoginButton = ({
	profile,
	logout,
	loginButtonText,
	setShowModal,
	isLoading,
}: {
	profile: WalletKeys | null;
	logout?: () => void;
	loginButtonText: string;
	setShowModal: (show: boolean) => void;
	isLoading: boolean;
}) => {
	return (
		<Box className="justify-center flex-1 items-end">
			<Button
				size="xl"
				variant="solid"
				action="primary"
				className="rounded-full"
				onPress={
					profile
						? (logout || (() => { }))
						: () => setShowModal(true)
				}
				accessibilityLabel={profile ? "Logout" : loginButtonText}
				disabled={isLoading}
			>
				<ButtonText>{isLoading ? "Please wait..." : (profile ? "Logout" : loginButtonText)}</ButtonText>
			</Button>
		</Box>
	);
};
