'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Github } from 'lucide-react'
import { APP_DESCRIPTION, APP_NAME, HOME_FEATURED_COLLECTIONS_DESCRIPTION } from '@/lib/constants'
import { AnimatedBackground } from './animated-background'
import { DesktopHeader } from '../layout/header'
import { ConnectWalletButton } from './connect-wallet'
import { WalletAnimation } from './wallet-animation'

export const HomeContainer = () => {
  const sceneRef = useRef(null)
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <AnimatedBackground />
      <div ref={sceneRef} className="absolute inset-0 z-0" />
      <DesktopHeader />

      <main className="flex-grow flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row">
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-destructive"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {APP_NAME}
            </motion.h1>
            <motion.p
              className="max-w-2xl mx-auto lg:mx-0 text-xl text-muted-foreground mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {APP_DESCRIPTION}
            </motion.p>
            <motion.p
              className="max-w-2xl mx-auto lg:mx-0 text-md text-secondary-foreground mb-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {HOME_FEATURED_COLLECTIONS_DESCRIPTION}
            </motion.p>

            <ConnectWalletButton isHero />
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <WalletAnimation />
          </div>
        </div>
      </main>

      <footer className="bg-card bg-opacity-50 backdrop-blur-md text-foreground py-8 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">{APP_NAME}</h3>
              <p className="text-sm text-muted-foreground">{APP_DESCRIPTION}</p>
            </div>
            <div className="flex space-x-4">
              <a
                href="https://github.com/habibitcoin/tajfi-server"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              {/* <a
                href="https://twitter.com/taproot_assets"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a> */}
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © 2024 Asset Market. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
