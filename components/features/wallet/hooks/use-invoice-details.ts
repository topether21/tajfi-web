import { decodeInvoice } from "@/libs/wallet/api";
import { useState } from "react";
import { useAsyncFn } from "react-use";

export const useInvoiceDetails = () => {
	const [errorMessage, setErrorMessage] = useState("");
	const [{ loading, error, value }, fetchInvoiceDetails] = useAsyncFn(
		async (newInvoice: string) => {
			setErrorMessage("");
			if (!newInvoice.trim()) return null;
			try {
				const res = await decodeInvoice({ address: newInvoice });
				return {
					amount: Number(res.amount),
					assetId: res.asset_id,
					assetType: res.asset_type,
				};
			} catch (e) {
				setErrorMessage("Invalid invoice");
				return null;
			}
		},
	);
	const reset = () => {
		setErrorMessage("");
		fetchInvoiceDetails("");
	};
	return {
		isLoading: loading,
		error: errorMessage || error?.message,
		invoiceDetails: value ?? null,
		fetchInvoiceDetails,
		reset,
	};
};
