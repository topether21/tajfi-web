"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

interface ConnectWalletButtonProps {
    size?: 'default' | 'sm' | 'lg' | 'icon';
    variant?: 'primary' | 'secondary';
    onClick?: () => void;
    isHero?: boolean;
}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
    size = 'default',
    onClick,
    isHero = false,
}) => {
    const [isConnecting, setIsConnecting] = useState(false)
    const { profile, login, logout } = useAuth();
    const router = useRouter()

    const handleConnectWallet = () => {
        setIsConnecting(true)
        setTimeout(() => {
            setIsConnecting(false)
            console.log('Wallet connected!')
            login({ address: '1234567890' })
            if (onClick) onClick();
            router.push('/wallet')
        }, 2000)
    }

    const handleLogout = () => {
        logout();
        console.log('Logged out!')
        router.push('/')
    }

    return (
        <>
            {!profile && (
                <Button
                    size={isHero ? 'lg' : size}
                    onClick={handleConnectWallet}
                    disabled={isConnecting}
                    className={cn(
                        isHero
                            ? "mt-8 px-10 py-5 bg-primary text-white text-xl font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-primary-dark hover:shadow-xl"
                            : ""
                    )}
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
                            {!isHero && <Wallet className="w-4 h-4 mr-2" />}
                            Connect Wallet
                        </>
                    )}
                </Button>
            )}
            {profile && (
                <Button
                    size={isHero ? 'lg' : size}
                    onClick={handleLogout}
                    className={cn(
                        isHero
                            ? "mt-8 px-10 py-5 bg-primary text-white text-xl font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-primary-dark hover:shadow-xl"
                            : ""
                    )}
                >
                    Logout
                </Button>
            )}
        </>
    )
}
