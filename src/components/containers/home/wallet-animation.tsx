import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })
import walletAnimation from './wallet-animation.json'

export const WalletAnimation = () => {
  return <Lottie animationData={walletAnimation} />
}
