import { CurrencyLogoIcon } from "@/components/icons/currency-logo";

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
			assetId={assetId || process.env.EXPO_PUBLIC_DEFAULT_ASSET_ID}
			className="select-none h-[87%] w-full"
		/>
	);
};
