import { sendComplete, sendStart } from "@/libs/wallet/api";
import { getProviderStrategy } from "@/libs/wallet/providers";
import type { WalletProvider } from "@/libs/wallet/types";
import { useState } from "react";
import { useAsyncFn } from "react-use";

export const useSendFunds = () => {
	const [errorMessage, setErrorMessage] = useState("");
	const [
		{ loading: loadingStart, error: errorStart, value: preSignedData },
		sendFundsStart,
	] = useAsyncFn(async (invoice: string) => {
		setErrorMessage("");
		if (!invoice.trim()) return null;
		try {
			const res = await sendStart({ invoice });
			return {
				fundedPsbt: res.funded_psbt,
				sighashHexToSign: res.sighash_hex_to_sign,
			};
		} catch (e) {
			setErrorMessage((e as Error).message);
			return null;
		}
	});

	const [
		{ loading: loadingComplete, error: errorComplete, value: isSent },
		sendFundsComplete,
	] = useAsyncFn(
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
			console.log("sending funds sendFundsComplete");
			setErrorMessage("");
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
				setErrorMessage((e as Error).message);
				return false;
			}
		},
	);

	const reset = () => {
		setErrorMessage("");
		sendFundsStart("");
		sendFundsComplete({
			sighashHexToSign: "",
			providerName: "none",
			tapasAddress: "",
			fundedPsbt: "",
		});
	};

	return {
		loading: loadingStart || loadingComplete,
		error: errorMessage || errorStart?.message || errorComplete?.message,
		preSignedData: preSignedData ?? null,
		isSent: isSent ?? false,
		sendFundsStart,
		sendFundsComplete,
		reset,
	};
};
