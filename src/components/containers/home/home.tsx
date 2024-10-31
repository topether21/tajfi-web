'use client'

import { useRef } from 'react'
import { Github } from 'lucide-react'
import { APP_DESCRIPTION, APP_FOOTER_DESCRIPTION, APP_NAME, HOME_HERO_DESCRIPTION } from '@/lib/constants'
import { AnimatedBackground } from './animated-background'
import { DesktopHeader } from '../layout/header'
import { ConnectWalletModal } from './connect-wallet'
import { WalletAnimation } from './wallet-animation'
import { MotionDiv } from '../shared'
export const HomeContainer = () => {
  const sceneRef = useRef(null)
  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary text-foreground overflow-hidden">
      <AnimatedBackground />
      <div ref={sceneRef} className="absolute inset-0 z-0" />
      <DesktopHeader />

      <main className="flex-grow flex flex-col justify-center items-center px-6 sm:px-8 lg:px-10 py-16 relative z-10">
        <div className="container mx-auto max-w-5xl flex flex-col lg:flex-row">
          <div className="lg:w-1/2 text-center lg:text-left mb-16 lg:mb-0">
            <MotionDiv
              className="text-6xl sm:text-7xl md:text-8xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {APP_NAME}
            </MotionDiv>
            <MotionDiv
              className="max-w-2xl mx-auto lg:mx-0 text-2xl text-muted-foreground mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              {APP_DESCRIPTION}
            </MotionDiv>
            <MotionDiv
              className="max-w-2xl mx-auto lg:mx-0 text-lg text-secondary-foreground mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {HOME_HERO_DESCRIPTION}
            </MotionDiv>

            <ConnectWalletModal isHero />
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <WalletAnimation />
          </div>
        </div>
      </main>

      <footer className="bg-card bg-opacity-60 backdrop-blur-lg text-foreground py-10 px-6 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-3">{APP_NAME}</h3>
              <p className="text-base text-muted-foreground">{APP_FOOTER_DESCRIPTION}</p>
            </div>
            <div className="flex space-x-5">
              <a
                href="https://github.com/habibitcoin/tajfi-server"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-7 h-7" />
              </a>
            </div>
          </div>
          {/* <div className="mt-10 text-center text-base text-muted-foreground">
            © 2024 Asset Market. All rights reserved.
          </div> */}
        </div>
      </footer>
    </div>
  )
}
