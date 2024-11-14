import { useState } from "react";
import { setAssetId } from "../hooks/asset-id-store";

export const useUserCurrencies = () => {
	const [isOpen, setIsOpen] = useState(false);
	const handleClose = (assetId?: string) => {
		setIsOpen(false);
		if (assetId) {
			setAssetId(assetId);
		}
	};
	const handleOpen = () => setIsOpen(true);
	return { isOpen, handleClose, handleOpen };
};
