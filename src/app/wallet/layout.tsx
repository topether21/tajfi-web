"use client"

import { ConnectWalletButton } from '@/components/containers/home/connect-wallet';
import { DesktopHeader } from '@/components/containers/layout/header';
import { MobileNavbar } from '@/components/containers/layout/mobile-navbar';
import { DesktopWalletHeader } from '@/components/containers/wallet/wallet-header';
import { useAuth } from '@/lib/auth-context';

const WalletLayout = ({ children }: { children: React.ReactNode }) => {
    const { profile } = useAuth();
    return (
        <>
            <DesktopHeader />
            <div className="h-screen flex flex-col bg-background">
                {!profile &&
                    <div className="flex flex-1 justify-center items-center">
                        <ConnectWalletButton isHero />
                    </div>
                }
                {profile && <>
                    <DesktopWalletHeader />
                    {children}
                </>}
            </div>
            <MobileNavbar />
        </>
    );
};

export default WalletLayout;