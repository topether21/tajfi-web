import type { SvgProps } from "react-native-svg";
import { TetherUSDT } from "./tether";
import { UnknownLogo } from "./unknown";

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
		case process.env.EXPO_PUBLIC_DEFAULT_ASSET_ID:
			return <TetherUSDT {...props} />;
		default:
			return <UnknownLogo name={assetId ?? ""} {...props} />;
	}
};
