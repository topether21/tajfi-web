import { CurrencyLogoIcon } from "@/components/icons/currency-logo";
import { DEFAULT_ASSET_ID } from "@/libs/constants";

// TODO: uncomment this when we have a real image for the asset
// import { Image } from "expo-image";
// export const AssetImage = ({ source, alt }: { source: string; alt: string }) => {
//     return <Image
//         source={source}
//         alt={alt}
//         contentFit="contain"
//         className="select-none h-[87%] w-full"
//         transition={500}
//     />
// };

export const AssetImage = ({ assetId }: { assetId: string }) => {
	return (
		<CurrencyLogoIcon
			assetId={assetId || DEFAULT_ASSET_ID}
			className="select-none h-[87%] w-full"
		/>
	);
};
