import {
	connectWallet,
	disconnectWallet,
	isSessionActive,
} from "@/libs/wallet/auth";
import type { WalletKeys } from "@/libs/wallet/types";
import type { WalletProvider } from "@/libs/wallet/types";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import useEffectOnce from "react-use/lib/useEffectOnce";

interface AuthContextType {
	profile: WalletKeys | null;
	login: (provider?: WalletProvider) => Promise<void>;
	logout: () => void;
	error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [profile, setProfile] = useState<WalletKeys | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffectOnce(() => {
		const initSession = async () => {
			const prevProfile = await isSessionActive();
			if (prevProfile) {
				setProfile(prevProfile);
				setError(null);
			} else {
				router.replace("/");
			}
		};
		initSession().catch(console.error);
	});

	const login = async (provider?: WalletProvider) => {
		try {
			if (!provider) throw new Error("No provider provided");
			const profile = await connectWallet(provider);
			setProfile(profile);
			setError(null);
		} catch (err) {
			const message = (err as Error).message;
			if (message.includes("Nostr key")) {
				setError("nostrKeyError");
			} else if (message.includes("is not defined")) {
				setError("unsupportedWalletError");
			} else {
				setError("genericError");
			}
			console.error("Error connecting wallet", err);
			throw err;
		}
	};

	const logout = () => {
		setProfile(null);
		disconnectWallet();
	};

	const auth: AuthContextType = { profile, login, logout, error };

	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
