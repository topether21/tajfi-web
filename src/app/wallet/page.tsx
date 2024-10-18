import { Header } from "@/components/containers/layout/header";
import { MobileNavbar } from "@/components/containers/layout/mobile-navbar";

export default function WalletPage() {
    return (
        <div className="flex flex-col h-full bg-background">
            <Header />
            <div className="flex-grow overflow-auto">
                <div className="container mx-auto flex-grow overflow-auto">
                    <div className="flex flex-col items-center justify-center h-full">
                        <h1 className="text-4xl font-bold">Wallet on progress</h1>
                    </div>
                </div>
            </div>
            <MobileNavbar />
        </div>
    )
}

