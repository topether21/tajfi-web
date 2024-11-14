import { Stack } from "expo-router";
import "@/global.css";
import { TabBarVisibilityProvider } from "@/components/containers/tab-bar/ tab-bar-visibility-context";
import { AuthProvider } from "@/components/features/wallet/connect-wallet/auth-context";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
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
