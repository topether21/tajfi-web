import { Bitcoin } from 'lucide-react'

import { Link } from 'expo-router'
import { ConnectWalletModal } from '../wallet/connect-wallet'
import { useHomeLogin } from './use-home-login'
import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'
import { Button } from '@/components/ui/button'
import { useSizes } from '@/hooks/useSizes'
import { Text } from '@/components/ui/text'
import { APP_NAME } from '@/libs/constants'

export const DesktopHeader = () => {
    const { isMobile } = useSizes();
    const { showModal, setShowModal, wallets, loginButtonText, login, profile, logout } = useHomeLogin()
    if (isMobile) return null;
    return (
        <header className="bg-card bg-opacity-50 backdrop-blur-md py-4 px-6 flex justify-between items-center z-20 relative">
            <Box className="flex items-center space-x-4">
                <Link href="/">
                    <HStack className="flex items-center space-x-2">
                        <Bitcoin className="w-8 h-8" />
                        <Text className="font-bold text-xl">{APP_NAME}</Text>
                    </HStack>
                </Link>
            </Box>
            <ConnectWalletModal
                showModal={showModal}
                onClose={() => setShowModal(false)}
                wallets={wallets}
                login={login}
            />
            <Box className="justify-center flex-1 items-end" >
                <Button onPress={profile ? logout : () => setShowModal(true)} style={{ maxWidth: 200 }}>
                    <Text>{profile ? "Logout" : loginButtonText}</Text>
                </Button>
            </Box>
        </header>
    )
}