import { BACKGROUND_COLOR } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const onboardingStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: BACKGROUND_COLOR,
	},
	itemContainer: {
		flex: 1,
		justifyContent: "space-around",
		alignItems: "center",
		backgroundColor: BACKGROUND_COLOR,
	},
	itemTitle: {
		textAlign: "center",
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 10,
		color: "black",
	},
	itemText: {
		textAlign: "center",
		marginHorizontal: 35,
		color: "black",
		lineHeight: 20,
	},
	bottomContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginHorizontal: 20,
		paddingVertical: 20,
	},
});
