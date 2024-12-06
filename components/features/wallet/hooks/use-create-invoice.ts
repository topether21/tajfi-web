import { receive } from "@/libs/wallet/api";
import { useState } from "react";
import { useAsyncFn } from "react-use";

export const useCreateInvoice = (
	amount: string,
	assetId: string | undefined,
) => {
	const [errorMessage, setErrorMessage] = useState("");
	const [{ loading, error, value }, createNewInvoice] = useAsyncFn(
		async ({ amount, assetId }: { amount: number; assetId: string }) => {
			setErrorMessage("");
			if (!amount || !assetId) return null;
			try {
				const response = await receive({ amount, assetId });
				return response;
			} catch (error) {
				console.error(error);
				setErrorMessage("Failed to create invoice");
				return null;
			}
		},
		[amount, assetId],
	);
	return {
		loading,
		error: errorMessage || error?.message,
		invoice: value ? value : null,
		createNewInvoice,
	};
};
