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
			role="img"
			aria-label="Tajfi Company Logo"
			onError={(error) => console.error("Failed to load Tajfi logo:", error)}
		/>
	);
};
