"use client"

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Github, Twitter } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { topCollections } from './home-data'
import Image from 'next/image'
import { APP_DESCRIPTION, APP_NAME, HOME_FEATURED_COLLECTIONS_DESCRIPTION } from '@/lib/constants'
import { AnimatedBackground } from './animated-background'
import { Header } from '../layout/header'
import { MobileNavbar } from '../layout/mobile-navbar'

export const ModernAssetMarketplace = () => {
    const sceneRef = useRef(null)
    return (
        <div className="relative min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
            <AnimatedBackground />
            <div ref={sceneRef} className="absolute inset-0 z-0" />
            <Header />

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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topCollections.map((collection) => (
                                <Card key={collection.id} className="bg-card bg-opacity-50 backdrop-blur-md border-border hover:border-primary transition-all duration-300 transform hover:scale-105">
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-4">
                                            <Image
                                                src={collection.image}
                                                alt={collection.name}
                                                width={64}
                                                height={64}
                                                className="rounded-full ring-2 ring-primary"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-foreground">{collection.name}</h3>
                                                <p className="text-sm text-muted-foreground">Items: {collection.items}</p>
                                                <p className="text-sm text-primary">Floor: {collection.floorPrice} BTC</p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-primary" />
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

            <footer className="bg-card bg-opacity-50 backdrop-blur-md text-foreground py-8 px-4 relative z-10">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-xl font-bold mb-2">{APP_NAME}</h3>
                            <p className="text-sm text-muted-foreground">{APP_DESCRIPTION}</p>
                        </div>
                        <div className="flex space-x-4">
                            <a href="https://github.com/taproot-assets" className="text-muted-foreground hover:text-primary transition-colors">
                                <Github className="w-6 h-6" />
                            </a>
                            <a href="https://twitter.com/taproot_assets" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                    <div className="mt-8 text-center text-sm text-muted-foreground">
                        © 2024 Asset Market. All rights reserved.
                    </div>
                </div>
            </footer>
            <MobileNavbar />
        </div>
    )
}
