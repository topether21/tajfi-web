import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import type { WalletKeys } from "@/libs/wallet/types";

export const TajfiLoginButton = ({
	profile,
	logout,
	loginButtonText,
	setShowModal,
}: {
	profile: WalletKeys | null;
	logout?: () => void;
	loginButtonText: string;
	setShowModal: (show: boolean) => void;
}) => {
	return (
		<Box className="justify-center flex-1 items-end">
			<Button
				size="xl"
				variant="solid"
				action="primary"
				className="rounded-full"
				onPress={profile ? logout : () => setShowModal(true)}
			>
				<ButtonText>{profile ? "Logout" : loginButtonText}</ButtonText>
			</Button>
		</Box>
	);
};
