"use client"
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Bitcoin, ChevronRight, Github, Twitter, Home, ShoppingBag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ConnectWalletButton } from './connect-wallet'
import { topCollections } from './home-data'
import Image from 'next/image'
import Link from 'next/link'

const animatedDots = Array.from({ length: 20 }, (_, index) => ({
    id: `dot-${index}-${Date.now()}-${Math.random()}`,
}));

export const ModernAssetMarketplace = () => {
    const sceneRef = useRef(null)

    return (
        <div className="relative min-h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
            {/* Animated background elements */}
            {animatedDots.map((dot) => (
                <motion.div
                    key={dot.id}
                    className="absolute w-2 h-2 bg-orange-500 rounded-full opacity-50"
                    animate={{
                        x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                        y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                />
            ))}

            <div ref={sceneRef} className="absolute inset-0 z-0" />

            <header className="bg-black bg-opacity-50 backdrop-blur-md py-4 px-6 flex justify-between items-center z-20 relative">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <Bitcoin className="w-8 h-8 text-orange-500" />
                        <span className="font-bold text-xl">Taproot Assets Market</span>
                    </div>
                    <nav className="hidden md:flex space-x-4">
                        <Button variant="ghost" className="text-white hover:text-orange-500">
                            <Home className="w-4 h-4 mr-2" />
                            Home
                        </Button>
                        <Link href="/marketplace" className="flex items-center text-white hover:text-orange-500">
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Marketplace
                        </Link>
                    </nav>
                </div>
                <ConnectWalletButton />
            </header>

            <main className="flex-grow flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <div className="text-center mb-12">
                    <motion.h1
                        className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-600"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Taproot Assets Market
                    </motion.h1>
                    <motion.p
                        className="max-w-2xl mx-auto text-xl text-gray-300 mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Explore the future of digital asset trading with Taproot Assets.
                    </motion.p>
                    <motion.p
                        className="max-w-2xl mx-auto text-md text-gray-400 mb-10"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Discover, trade, and own unique digital artifacts inscribed on individual satoshis with Taproot.
                    </motion.p>
                </div>

                <motion.div
                    className="max-w-5xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-600">Featured Collections</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topCollections.map((collection) => (
                            <Card key={collection.id} className="bg-black bg-opacity-50 backdrop-blur-md border-gray-700 hover:border-orange-500 transition-all duration-300 transform hover:scale-105">
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-4">
                                        <Image
                                            src={collection.image}
                                            alt={collection.name}
                                            width={64}
                                            height={64}
                                            className="rounded-full ring-2 ring-orange-500"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-white">{collection.name}</h3>
                                            <p className="text-sm text-gray-400">Items: {collection.items}</p>
                                            <p className="text-sm text-orange-400">Floor: {collection.floorPrice} BTC</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-orange-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>
            </main>

            <footer className="bg-black bg-opacity-50 backdrop-blur-md text-white py-8 px-4 relative z-10">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-xl font-bold mb-2">Taproot Assets Market</h3>
                        <p className="text-sm text-gray-400">The premier marketplace for modern Taproot Assets</p>
                    </div>
                    <div className="flex space-x-4">
                        <a href="https://github.com/taproot-assets" className="text-gray-400 hover:text-orange-500 transition-colors">
                            <Github className="w-6 h-6" />
                        </a>
                        <a href="https://twitter.com/taproot_assets" className="text-gray-400 hover:text-orange-500 transition-colors">
                            <Twitter className="w-6 h-6" />
                        </a>
                    </div>
                </div>
                <div className="mt-8 text-center text-sm text-gray-400">
                    © 2024 Asset Market. All rights reserved.
                </div>
            </footer>
        </div>
    )
}
