import { AlbyIcon } from "@/components/icons/alby";
import { OneKeyIcon } from "@/components/icons/onekey";
import { TajfiIcon } from "@/components/icons/tajfi";
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

const getIcon = (wallet: WalletProvider) => {
	switch (wallet) {
		case "webAuthn":
			return TajfiIcon;
		case "oneKey":
			return OneKeyIcon;
		case "alby":
			return AlbyIcon;
	}
};

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
					<Box className="grid grid-cols-2 gap-4 sm:grid-cols-3 p-4">
						{wallets.map((wallet) => {
							const IconComponent = getIcon(wallet);
							return (
								<TouchableOpacity
									key={wallet}
									className="flex flex-col items-center justify-center gap-2 h-24 hover:bg-primary/5 ring-1 ring-inset ring-background-200 rounded-lg"
									onPress={() => {
										login(wallet);
									}}
								>
									<Box className="rounded-full  flex items-center justify-center">
										<Icon
											as={IconComponent}
											style={{ height: 45, width: 45 }}
										/>
									</Box>
									<Text className="text-sm font-medium">{wallet}</Text>
								</TouchableOpacity>
							);
						})}
					</Box>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
