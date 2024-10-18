"use client"
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bitcoin, ChevronRight, Github, Twitter, Home, ShoppingBag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ConnectWalletButton } from './connect-wallet'
import { topCollections } from './home-data'
import Image from 'next/image'
import Link from 'next/link'
import { APP_DESCRIPTION, APP_NAME, HOME_FEATURED_COLLECTIONS_DESCRIPTION } from '@/lib/constants'

export const ModernAssetMarketplace = () => {
    const sceneRef = useRef(null)
    const [animatedDots, setAnimatedDots] = useState<{ id: string, x: number, y: number }[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const dots = Array.from({ length: 20 }, (_, index) => ({
                id: `dot-${index}-${Date.now()}-${Math.random()}`,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
            }));
            setAnimatedDots(dots);
        }
    }, []);

    return (
        <div className="relative min-h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
            {/* Animated background elements */}
            {animatedDots.map((dot) => (
                <motion.div
                    key={dot.id}
                    className="absolute w-2 h-2 bg-orange-500 rounded-full opacity-50"
                    animate={{
                        x: [dot.x, Math.random() * window.innerWidth],
                        y: [dot.y, Math.random() * window.innerHeight],
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
                        <span className="font-bold text-xl">{APP_NAME}</span>
                    </div>
                    <nav className="hidden md:flex space-x-4">
                        <Link href="/marketplace" className="flex items-center text-white hover:text-orange-500">
                            Marketplace
                        </Link>
                    </nav>
                </div>
                <ConnectWalletButton />
            </header>

            <main className="flex-grow flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row">
                    <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
                        <motion.h1
                            className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-600"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {APP_NAME}
                        </motion.h1>
                        <motion.p
                            className="max-w-2xl mx-auto lg:mx-0 text-xl text-gray-300 mb-6"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {APP_DESCRIPTION}
                        </motion.p>
                        <motion.p
                            className="max-w-2xl mx-auto lg:mx-0 text-md text-gray-400 mb-10"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            {HOME_FEATURED_COLLECTIONS_DESCRIPTION}
                        </motion.p>
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
                    </div>
                    <motion.div
                        className="lg:w-1/2 flex justify-center"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <Image
                            src="https://img.itch.zone/aW1hZ2UvMTQ0NDQxMi84NDMxMzY1LnBuZw==/original/UHgZYq.png"
                            alt="Hero Image"
                            width={500}
                            height={500}
                            className="rounded-lg shadow-lg"
                        />
                    </motion.div>
                </div>
            </main>

            <footer className="bg-black bg-opacity-50 backdrop-blur-md text-white py-8 px-4 relative z-10">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-xl font-bold mb-2">{APP_NAME}</h3>
                            <p className="text-sm text-gray-400">{APP_DESCRIPTION}</p>
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
                </div>
            </footer>
        </div>
    )
}
