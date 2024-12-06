import { sendComplete, sendStart } from "@/libs/wallet/api";
import { getProviderStrategy } from "@/libs/wallet/providers";
import type { WalletProvider } from "@/libs/wallet/types";
import { useCallback, useState } from "react";
import { useAsyncFn } from "react-use";

export const useSendFunds = () => {
	const [error, setError] = useState<string | null>(null);

	const [{ loading: loadingStart, value: preSignedData }, sendFundsStart] =
		useAsyncFn(async (invoice: string) => {
			setError(null);
			if (!invoice.trim()) return null;
			try {
				const res = await sendStart({ invoice });
				return {
					fundedPsbt: res.funded_psbt,
					sighashHexToSign: res.sighash_hex_to_sign,
				};
			} catch (e) {
				const message = (e as Error).message || "Unknown error";
				setError(message);
				return null;
			}
		}, []);

	const [{ loading: loadingComplete, value: isSent }, sendFundsComplete] =
		useAsyncFn(
			async ({
				sighashHexToSign,
				providerName,
				tapasAddress,
				fundedPsbt,
			}: {
				sighashHexToSign: string;
				providerName: WalletProvider;
				tapasAddress: string;
				fundedPsbt: string;
			}) => {
				setError(null);
				if (!sighashHexToSign) return false;
				try {
					const walletProvider = getProviderStrategy(providerName);
					const signatureHex = await walletProvider.signTx(sighashHexToSign, {
						address: tapasAddress,
					});
					await sendComplete({
						psbt: fundedPsbt,
						signature_hex: signatureHex,
						sighash: sighashHexToSign,
					});
					return true;
				} catch (e) {
					const message = (e as Error).message || "Unknown error";
					setError(message);
					return false;
				}
			},
			[],
		);

	const reset = useCallback(() => {
		setError(null);
		sendFundsStart("");
		sendFundsComplete({
			sighashHexToSign: "",
			providerName: "none",
			tapasAddress: "",
			fundedPsbt: "",
		});
	}, [sendFundsStart, sendFundsComplete]);

	return {
		loading: loadingStart || loadingComplete,
		error,
		preSignedData: preSignedData ?? null,
		isSent: isSent ?? false,
		sendFundsStart,
		sendFundsComplete,
		reset,
	};
};
