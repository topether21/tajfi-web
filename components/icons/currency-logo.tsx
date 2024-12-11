import type { SvgProps } from "react-native-svg";
import { TetherUSDT } from "./tether";
import { UnknownLogo } from "./unknown";
import { DEFAULT_ASSET_ID } from "@/libs/constants";

export const CurrencyLogoIcon = ({
	assetId,
	name,
	...props
}: SvgProps & { assetId?: string; name?: string }) => {
	if (!name && !assetId) {
		throw new Error("Either name or assetId must be provided");
	}
	switch (name) {
		case "USDT":
			return <TetherUSDT {...props} />;
	}
	switch (assetId) {
		case DEFAULT_ASSET_ID:
			return <TetherUSDT {...props} />;
		default:
			return <UnknownLogo name={assetId ?? ""} {...props} />;
	}
};
