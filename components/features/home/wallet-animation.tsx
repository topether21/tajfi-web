import LottieView from "lottie-react-native";
import walletAnimation from './wallet-animation.json'

export const WalletAnimation = () => {
  return <LottieView
    loop
    autoPlay
    style={{
      backgroundColor: "transparent",
      width: "100%",
      height: "100%",
    }}
    source={walletAnimation}
  />
}
