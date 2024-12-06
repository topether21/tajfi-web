import { AlbyIcon } from "@/components/icons/alby";
import { OneKeyIcon } from "@/components/icons/onekey";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { CloseIcon, Icon } from "@/components/ui/icon";
import {
	Modal,
	ModalBackdrop,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import type { WalletProvider } from "@/libs/wallet/types";
import { TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { TajfiNameLogoDeepBlue } from "@/components/containers/tajfi-logos/tajfi-name-logo-deep-blue";
import { clsx } from "clsx";

export const ConnectWalletModal = ({
	showModal,
	onClose,
	wallets,
	login,
}: {
	showModal: boolean;
	onClose: () => void;
	wallets: WalletProvider[];
	login: (provider: WalletProvider) => Promise<void>;
}) => {
	const walletIcon = (wallet: WalletProvider) => {
		if (wallet === "Nostr") {
			return (
				<Image
					source={require("@/assets/icons/nostr.png")}
					contentFit="cover"
					style={{ height: 45, width: 45 }}
				/>
			);
		}
		if (wallet === "webAuthn") {
			return <TajfiNameLogoDeepBlue width={45} height={45} />;
		}
		if (wallet === "OneKey") {
			return <Icon as={OneKeyIcon} style={{ height: 45, width: 45 }} />;
		}
		if (wallet === "Alby") {
			return <Icon as={AlbyIcon} style={{ height: 45, width: 45 }} />;
		}
	};

	const walletName = (wallet: WalletProvider) => {
		if (wallet !== "webAuthn") {
			return <Text className="text-sm font-medium">{wallet}</Text>;
		}
	};

	return (
		<Modal isOpen={showModal} onClose={onClose} size="md">
			<ModalBackdrop />
			<ModalContent>
				<ModalHeader>
					<Heading size="md" className="text-typography-950" />
					<ModalCloseButton>
						<Icon
							as={CloseIcon}
							size="md"
							className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
						/>
					</ModalCloseButton>
				</ModalHeader>
				<ModalBody>
					<Box
						className={clsx(
							"grid gap-4 p-4",
							wallets.length === 0 ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3",
						)}
					>
						{wallets.length === 0 && (
							<Text className="text-sm text-center">
								There are no compatible login methods installed on your
								device.
							</Text>
						)}
						{wallets.map((wallet) => {
							return (
								<TouchableOpacity
									key={wallet}
									className="flex flex-col items-center justify-center gap-2 h-24 hover:bg-primary/5 ring-1 ring-inset ring-background-200 rounded-lg"
									onPress={() => {
										login(wallet);
									}}
								>
									<Box className="rounded-full flex items-center justify-center">
										{walletIcon(wallet)}
									</Box>
									{walletName(wallet)}
								</TouchableOpacity>
							);
						})}
					</Box>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
