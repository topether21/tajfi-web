import { Bitcoin } from 'lucide-react'

import { APP_NAME } from './constants'
import { Link } from 'expo-router'
import { ConnectWalletModal } from '../wallet/connect-wallet'
import { TAB_BAR_ACTIVE_BACKGROUND_COLOR, TAB_BAR_BACKGROUND_COLOR } from '@/components/containers/tab-bar/colors'
import { useHomeLogin } from './use-home-login'
import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'
import { Button } from '@/components/ui/button'
import { DesktopWalletHeader } from '../wallet/layout/desktop-navigation-bar'
import { useSizes } from '@/hooks/useSizes'

export const DesktopHeader = () => {
    const { showModal, setShowModal, wallets, loginButtonText, login, profile, logout } = useHomeLogin()
    const { isMobile } = useSizes();
    if (isMobile) return null;
    return (
        <header className="bg-card bg-opacity-50 backdrop-blur-md py-4 px-6 flex items-center z-20 relative" style={{ backgroundColor: TAB_BAR_BACKGROUND_COLOR }}>
            <Box className="flex items-center space-x-4" data-testid="logo">
                <Link href="/">
                    <HStack className="flex items-center space-x-2">
                        <Bitcoin className="w-8 h-8" color={TAB_BAR_ACTIVE_BACKGROUND_COLOR} />
                        <span className="font-bold text-xl" style={{ color: TAB_BAR_ACTIVE_BACKGROUND_COLOR }}>{APP_NAME}</span>
                    </HStack>
                </Link>
            </Box>

            <Box className="flex-1 flex justify-center">
                <DesktopWalletHeader data-testid="navigation-bar" />
            </Box>

            <Box className="flex items-end justify-end" data-testid="login-button">
                <Button onPress={profile ? logout : () => setShowModal(true)} style={{ backgroundColor: TAB_BAR_ACTIVE_BACKGROUND_COLOR, maxWidth: 200 }}>{profile ? "Logout" : loginButtonText}</Button>
                <ConnectWalletModal
                    showModal={showModal}
                    onClose={() => setShowModal(false)}
                    wallets={wallets}
                    login={login}
                />
            </Box>

        </header>
    )
}