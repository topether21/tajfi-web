import {
	Actionsheet,
	ActionsheetBackdrop,
	ActionsheetContent,
	ActionsheetDragIndicator,
	ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Button, ButtonText } from "@/components/ui/button";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { type CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { SwitchCamera } from "lucide-react-native";
import { useState } from "react";
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
				<Actionsheet
					isOpen={showScanner}
					onClose={handleClose}
					snapPoints={[90]}
				>
					<ActionsheetBackdrop />
					<ActionsheetContent className="h-full w-full">
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
	const [facing, setFacing] = useState<CameraType>("back");
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

	function toggleCameraFacing() {
		setFacing((current) => (current === "back" ? "front" : "back"));
	}

	return (
		<View style={styles.container}>
			<CameraView
				style={styles.camera}
				facing={facing}
				barcodeScannerSettings={{
					barcodeTypes: [
						"qr",
						"aztec",
						"ean13",
						"ean8",
						"pdf417",
						"upc_e",
						"datamatrix",
						"code39",
						"code93",
						"itf14",
						"codabar",
						"code128",
						"upc_a",
					],
				}}
				onBarcodeScanned={(data) => onQr(data.data)}
			>
				<TouchableOpacity
					style={styles.button}
					onPress={handleClose}
					className="self-end"
				>
					<Icon as={CloseIcon} size="xl" className="stroke-background-tajfi-white" />
				</TouchableOpacity>
				<TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
					<Icon as={SwitchCamera} size="xl" className="stroke-background-tajfi-white" />
				</TouchableOpacity>
			</CameraView>
		</View>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
	},
	container: {
		flex: 1,
		height: "100%",
		width: "100%",
	},
	message: {
		textAlign: "center",
		paddingBottom: 10,
	},
	camera: {
		flex: 1,
		height: "100%",
	},
	buttonContainer: {
		padding: 16,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	button: {
		alignItems: "flex-end",
		padding: 12,
	},
	text: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
});
