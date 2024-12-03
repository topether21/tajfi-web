import { BottomTabBar } from "@/components/containers/tab-bar/tab-bar";
import { DesktopHeader } from "@/components/features/home/desktop-header";
import { UserBalance } from "@/components/features/wallet/layout/user-balance";
import { useSizes } from "@/hooks/useSizes";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useWindowDimensions } from "@/hooks/use-window-dimensions";
import { Box } from "@/components/ui/box";

const TabsLayout = () => {
	const { isSmall } = useSizes();
	const { width } = useWindowDimensions();
	return (
		<Box className="flex-1 bg-background-tajfi-white">
			<DesktopHeader />
			<View
				className={isSmall ? "" : "relative flex justify-center"}
				style={
					isSmall
						? styles.mobileContainer
						: [styles.desktopContainer, { width }]
				}
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
						name="marketplace"
						getId={
							() => String(Date.now())
						}
						options={{ title: "Marketplace", headerShown: false }}
					/>
					<Tabs.Screen
						name="history"
						options={{ title: "History", headerShown: false }}
					/>
				</Tabs>
			</View>
		</Box>
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
		overflow: "hidden",
		alignSelf: "center",
		marginTop: "auto",
		marginBottom: "auto",
	},
});

export default TabsLayout;
