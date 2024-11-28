import type { WalletProvider } from "@/libs/wallet/types";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuth } from "./auth-context";
import { Platform } from "react-native";
const isWebview = require("is-ua-webview");

export const useWalletAuth = ({ onCancel }: { onCancel?: () => void }) => {
	const [isConnecting, setIsConnecting] = useState(false);
	const { profile, login, logout } = useAuth();
	const router = useRouter();

	const handleConnectWallet = async (walletProvider: WalletProvider) => {
		try {
			setIsConnecting(true);
			console.log("Wallet connected!");
			await login(walletProvider);
			setIsConnecting(false);
			router.push("/(tabs)/send");
		} catch (error) {
			console.error(error);
			router.push("/");
		} finally {
			setIsConnecting(false);
			onCancel?.();
		}
	};

	const handleLogout = () => {
		logout();
		console.log("Logged out!");

		if (Platform.OS === "web") {
			// Check if running in webview to handle redirect appropriately
			// since webview doesn't support router.push()
			const userAgent = navigator.userAgent || navigator.vendor || window.opera;
			if (isWebview(userAgent)) {
				window.location.href = "/";
			}
		}

		router.push("/");
	};

	return {
		isConnecting,
		profile,
		handleConnectWallet,
		handleLogout,
	};
};
