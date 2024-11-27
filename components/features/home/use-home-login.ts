import useAsync from "react-use/lib/useAsync";

import { useState } from "react";
import { useWalletAuth } from "../wallet/connect-wallet/use-connect-wallet";
import { getEnabledProviders } from "@/libs/wallet/providers";
import type { WalletProvider } from "@/libs/wallet/types";

export const useHomeLogin = () => {
	const [showModal, setShowModal] = useState(false);
	const {
		handleConnectWallet,
		profile,
		handleLogout: logout,
	} = useWalletAuth({});

	const state = useAsync(getEnabledProviders);
	const wallets: WalletProvider[] = state.value || [];
	const shouldShowModal = state.value && state.value?.length > 1;
	const loginButtonText = shouldShowModal ? "Connect Wallet" : "Login";

	const login = async (walletProvider: WalletProvider) => {
		try {
			await handleConnectWallet(walletProvider);
			setShowModal(false);
		} catch (error) {
			// TODO: show error toast
			console.error(error);
		}
	};

	const isLoading = state.loading;

	return {
		showModal,
		setShowModal,
		wallets,
		loginButtonText,
		login,
		profile,
		logout,
		isLoading,
	};
};
