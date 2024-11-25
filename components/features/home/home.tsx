import { useRef } from 'react'
import { Github } from 'lucide-react-native'
import { AnimatedBackground } from './animated-background'

import { WalletAnimation } from './wallet-animation'
import { MotionDiv } from './motion'
import { DesktopHeader } from './desktop-header'
import clsx from 'clsx'
import { Box } from '@/components/ui/box'

import { ConnectWalletModal } from '../wallet/connect-wallet'
import { Button, ButtonText } from '@/components/ui/button'
import { TAB_BAR_ACTIVE_BACKGROUND_COLOR } from '@/components/containers/tab-bar/colors'
import { useHomeLogin } from './use-home-login'
import { Text } from '@/components/ui/text'
import { APP_DESCRIPTION, APP_FOOTER_DESCRIPTION, HOME_HERO_DESCRIPTION, APP_NAME } from '@/libs/constants'
import { TajfiLogo } from '@/components/containers/tajfi-logos/tajfi-logo'

export const HomeContainer = () => {
  const sceneRef = useRef(null)
  const { showModal, setShowModal, wallets, loginButtonText, login } = useHomeLogin()

  return (

    <Box className={clsx("relative min-h-screen flex overflow-hidden text-white")}>
      <Box ref={sceneRef} className="absolute inset-0 z-0" />
      <DesktopHeader />

      <Box className="flex-grow flex justify-center items-center px-6 sm:px-8 lg:px-10 py-16 relative z-10">
        <Box className="container mx-auto max-w-5xl flex lg:flex-row">
          <Box className="lg:w-1/2 text-center lg:text-left mb-16 lg:mb-0">
            <MotionDiv
              className="text-6xl sm:text-7xl md:text-8xl font-extrabold mb-8 bg-clip-text"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Text size="xl">{APP_NAME}</Text>
            </MotionDiv>
            <MotionDiv
              className="max-w-2xl mx-auto lg:mx-0 text-2xl text-white mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <Text>{APP_DESCRIPTION}</Text>
            </MotionDiv>
            <MotionDiv
              className="max-w-2xl mx-auto lg:mx-0 text-lg text-white mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <Text>{HOME_HERO_DESCRIPTION}</Text>
            </MotionDiv>

            <ConnectWalletModal
              showModal={showModal}
              onClose={() => setShowModal(false)}
              wallets={wallets}
              login={login}
            />
            <Box className="justify-center flex-1 items-center" >
              <Button onPress={() => setShowModal(true)} style={{ backgroundColor: TAB_BAR_ACTIVE_BACKGROUND_COLOR, maxWidth: 200 }}>
                <ButtonText>{loginButtonText}</ButtonText>
              </Button>
            </Box>
          </Box>
          <Box className="lg:w-1/2 flex justify-center">
            <TajfiLogo />
          </Box>
        </Box>
      </Box>

      <Box className="bg-card bg-opacity-60 backdrop-blur-lg text-white py-10 px-6 relative z-10">
        <Box className="container mx-auto max-w-5xl">
          <Box className="flex flex-col md:flex-row justify-between items-center">
            <Box className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-3">{APP_NAME}</h3>
              <p className="text-base text-muted-foreground">{APP_FOOTER_DESCRIPTION}</p>
            </Box>
            <Box className="flex space-x-5">
              <a
                href="https://github.com/habibitcoin/tajfi-server"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-7 h-7" />
              </a>
            </Box>
          </Box>
          {/* <Box className="mt-10 text-center text-base text-muted-foreground">
            © 2024 Asset Market. All rights reserved.
          </Box> */}
        </Box>
      </Box>
    </Box>
  )
}
