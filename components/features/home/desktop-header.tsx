import { Bitcoin } from 'lucide-react'

import { APP_NAME } from './constants'
import { Link } from 'expo-router'
import { ConnectWalletModal } from '../wallet/connect-wallet'
import { TAB_BAR_ACTIVE_BACKGROUND_COLOR, TAB_BAR_BACKGROUND_COLOR } from '@/components/containers/tab-bar/colors'
import { useHomeLogin } from './use-home-login'
import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'
import { Button } from '@/components/ui/button'

export const DesktopHeader = () => {
    const { showModal, setShowModal, wallets, loginButtonText, login, profile, logout } = useHomeLogin()
    return (
        <header className="bg-card bg-opacity-50 backdrop-blur-md py-4 px-6 flex justify-between items-center z-20 relative" style={{ backgroundColor: TAB_BAR_BACKGROUND_COLOR }}>
            <Box className="flex items-center space-x-4">
                <Link href="/">
                    <HStack className="flex items-center space-x-2">
                        <Bitcoin className="w-8 h-8" color={TAB_BAR_ACTIVE_BACKGROUND_COLOR} />
                        <span className="font-bold text-xl" style={{ color: TAB_BAR_ACTIVE_BACKGROUND_COLOR }}>{APP_NAME}</span>
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
                <Button onPress={profile ? logout : () => setShowModal(true)} style={{ backgroundColor: TAB_BAR_ACTIVE_BACKGROUND_COLOR, maxWidth: 200 }}>{profile ? "Logout" : loginButtonText}</Button>
            </Box>
        </header>
    )
}