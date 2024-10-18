import { Bitcoin } from "lucide-react";

import { ConnectWalletButton } from "../home/connect-wallet"
import { APP_NAME } from "@/lib/constants";
import Link from "next/link";

export const Header = () => {
    return (
        <header className="bg-card bg-opacity-50 backdrop-blur-md py-4 px-6 flex justify-between items-center z-20 relative">
            <div className="flex items-center space-x-4">
                <Link href="/">
                    <div className="flex items-center space-x-2">
                        <Bitcoin className="w-8 h-8 text-primary" />
                        <span className="font-bold text-xl">{APP_NAME}</span>
                    </div>
                </Link>
                <nav className="hidden md:flex space-x-4">
                    <Link href="/marketplace" className="flex items-center text-foreground hover:text-primary">
                        Marketplace
                    </Link>
                </nav>
            </div>
            <ConnectWalletButton />
        </header>
    )
}