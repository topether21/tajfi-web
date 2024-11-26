import { Stack } from "expo-router";
import "react-native-reanimated";
import "@/global.css";
import { TabBarVisibilityProvider } from "@/components/containers/tab-bar/ tab-bar-visibility-context";
import { AuthProvider } from "@/components/features/wallet/connect-wallet/auth-context";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded] = useFonts({
		PoppinsBlack: require("../assets/fonts/Poppins-Black.ttf"),
		PoppinsBlackItalic: require("../assets/fonts/Poppins-BlackItalic.ttf"),
		PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
		PoppinsBoldItalic: require("../assets/fonts/Poppins-BoldItalic.ttf"),
		PoppinsExtraBold: require("../assets/fonts/Poppins-ExtraBold.ttf"),
		PoppinsExtraBoldItalic: require("../assets/fonts/Poppins-ExtraBoldItalic.ttf"),
		PoppinsExtraLight: require("../assets/fonts/Poppins-ExtraLight.ttf"),
		PoppinsExtraLightItalic: require("../assets/fonts/Poppins-ExtraLightItalic.ttf"),
		PoppinsItalic: require("../assets/fonts/Poppins-Italic.ttf"),
		PoppinsLight: require("../assets/fonts/Poppins-Light.ttf"),
		PoppinsLightItalic: require("../assets/fonts/Poppins-LightItalic.ttf"),
		PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
		PoppinsMediumItalic: require("../assets/fonts/Poppins-MediumItalic.ttf"),
		PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
		PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
		PoppinsSemiBoldItalic: require("../assets/fonts/Poppins-SemiBoldItalic.ttf"),
		PoppinsThin: require("../assets/fonts/Poppins-Thin.ttf"),
		PoppinsThinItalic: require("../assets/fonts/Poppins-ThinItalic.ttf"),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}
	return (
		<AuthProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<ActionSheetProvider>
					<TabBarVisibilityProvider>
						<GluestackUIProvider mode="light">
							<Stack screenOptions={{ headerShown: false }} />
						</GluestackUIProvider>
					</TabBarVisibilityProvider>
				</ActionSheetProvider>
			</GestureHandlerRootView>
		</AuthProvider>
	);
}
