"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet } from 'lucide-react'
import { Button } from "@/components/ui/button"

export const ConnectWalletButton = () => {
    const [isConnecting, setIsConnecting] = useState(false)

    const handleConnectWallet = () => {
        setIsConnecting(true)
        setTimeout(() => {
            setIsConnecting(false)
            console.log('Wallet connected!')
        }, 2000)
    }

    return (
        <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            onClick={handleConnectWallet}
            disabled={isConnecting}
        >
            {isConnecting ? (
                <>
                    <motion.div
                        className="w-4 h-4 border-t-2 border-r-2 border-white rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                    Connecting...
                </>
            ) : (
                <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                </>
            )}
        </Button>
    )
}

