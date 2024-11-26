import LottieView from "lottie-react-native";

export const WalletAnimation = () => {
	return (
		<LottieView
			loop
			autoPlay
			style={{
				backgroundColor: "transparent",
				width: "100%",
				height: "100%",
			}}
			source={require("./wallet-animation.json")}
		/>
	);
};
