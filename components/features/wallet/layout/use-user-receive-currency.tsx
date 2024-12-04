import { useState } from "react";
import { setReceiveAssetId } from "../../../../store/asset-id-store";

export const useUserReceiveCurrency = () => {
	const [isOpen, setIsOpen] = useState(false);
	const handleClose = (assetId?: string) => {
		setIsOpen(false);
		if (assetId) {
			setReceiveAssetId(assetId);
		}
	};
	const handleOpen = () => setIsOpen(true);
	return { isOpen, handleClose, handleOpen };
};
