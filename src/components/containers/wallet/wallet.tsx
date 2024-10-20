"use client"

import { MobileNavbar } from "@/components/containers/layout/mobile-navbar";
import { WalletHeader } from "@/components/containers/wallet/wallet-header";
import { Header } from "../layout/header";
import { useAuth } from "@/lib/auth-context";
import { ConnectWalletButton } from "../home/connect-wallet";

export default function WalletContainer() {
    const { profile } = useAuth();

    return (
        <>
            <Header />
            <div className="h-screen flex flex-col bg-background">
                {!profile &&
                    <div className="flex flex-1 justify-center items-center">
                        <ConnectWalletButton isHero />
                    </div>
                }
                {profile && <>
                    <WalletHeader />
                    <MobileNavbar />
                </>}
            </div>
        </>
    )
}
