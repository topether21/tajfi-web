import { Image, type ImageContentFit } from "expo-image";

export const TajfiNameLogo = ({
	width = 133,
	height = 111,
	contentFit = "contain",
}: { width?: number; height?: number; contentFit?: ImageContentFit }) => {
	return (
		<Image
			source={require("./assets/tajfi-name-logo.svg")}
			alt="Tajfi Logo"
			style={{ width, height }}
			contentFit={contentFit}
		/>
	);
};
