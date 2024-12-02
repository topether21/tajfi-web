import {
	Actionsheet,
	ActionsheetBackdrop,
	ActionsheetContent,
	ActionsheetDragIndicator,
	ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Button, ButtonText } from "@/components/ui/button";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
	useCameraPermissions,
} from "expo-camera";
import {
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export const ScannerModal = ({
	showScanner,
	handleClose,
	onQr,
}: {
	showScanner: boolean;
	handleClose: () => void;
	onQr: (data: string) => void;
}) => {
	return (
		<>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				style={styles.modalContainer}
			>
				<Actionsheet isOpen={showScanner} onClose={handleClose}>
					<ActionsheetBackdrop />
					<ActionsheetContent className="bg-background-0">
						<ActionsheetDragIndicatorWrapper>
							<ActionsheetDragIndicator />
						</ActionsheetDragIndicatorWrapper>

						<QrScanner handleClose={handleClose} onQr={onQr} />
					</ActionsheetContent>
				</Actionsheet>
			</KeyboardAvoidingView>
		</>
	);
};

export const QrScanner = ({
	handleClose,
	onQr,
}: {
	handleClose: () => void;
	onQr: (data: string) => void;
}) => {
	const [permission, requestPermission] = useCameraPermissions();

	if (!permission) {
		// Camera permissions are still loading.
		return <View />;
	}

	if (!permission.granted) {
		// Camera permissions are not granted yet.
		return (
			<View style={styles.container}>
				<Text style={styles.message}>
					We need your permission to show the camera
				</Text>
				<Button onPress={requestPermission}>
					<ButtonText>Grant permission to use camera</ButtonText>
				</Button>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.button}
				onPress={handleClose}
				className="self-end"
			>
				<Icon as={CloseIcon} size="xl" color="black" />
			</TouchableOpacity>
			<Scanner
				constraints={{
					aspectRatio: 1,
				}}
				onScan={(result) => onQr(result[0]?.rawValue ?? "")}
				styles={{
					container: {
						flex: 1,
						justifyContent: "flex-start",
						borderRadius: 30,
					},
					video: {
						borderRadius: 30,
						backgroundColor: "red",
						flex: 1,
						justifyContent: "flex-start",
					},
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
	},
	container: {
		flex: 1,
	},
	message: {
		textAlign: "center",
		paddingBottom: 10,
	},
	camera: {
		flex: 1,
	},
	buttonContainer: {
		padding: 16,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	button: {
		alignItems: "flex-end",
	},
	text: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
});
