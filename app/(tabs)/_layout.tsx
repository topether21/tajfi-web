import { GLOBAL_BACKGROUND_COLOR } from "@/components/containers/tab-bar/colors";
import { BottomTabBar } from "@/components/containers/tab-bar/tab-bar";
import { DesktopHeader } from "@/components/features/home/desktop-header";
import { UserBalance } from "@/components/features/wallet/layout/user-balance";
import { useSizes } from "@/hooks/useSizes";
import { Tabs } from "expo-router";
import { StyleSheet, useWindowDimensions, View } from "react-native";

const TabsLayout = () => {
	const { isMobile } = useSizes();
	const { width } = useWindowDimensions();
	return (
		<View style={{ flex: 1, backgroundColor: GLOBAL_BACKGROUND_COLOR }}>
			<DesktopHeader />
			<View
				className={
					isMobile
						? ""
						: "relative flex justify-center border-4 border-black rounded-2xl"
				}
				style={isMobile ? styles.mobileContainer : [styles.desktopContainer, { width }]}
			>
				<UserBalance />
				<Tabs tabBar={(props) => <BottomTabBar {...props} />}>
					<Tabs.Screen
						name="send"
						options={{ title: "Send", headerShown: false }}
					/>
					<Tabs.Screen
						name="receive"
						options={{ title: "Receive", headerShown: false }}
					/>
					<Tabs.Screen
						name="history"
						options={{ title: "History", headerShown: false }}
					/>
				</Tabs>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	mobileContainer: {
		flex: 1,
	},
	desktopContainer: {
		maxWidth: 1024,
		minWidth: 481,
		height: 932,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 20,
		overflow: "hidden",
		alignSelf: "center",
		marginTop: "auto",
		marginBottom: "auto",
		// boxShadow: "10px 10px 5px 12px rgb(209, 218, 218)",
	},
});

export default TabsLayout;
