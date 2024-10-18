import { Header } from "@/components/containers/layout/header";
import { MobileNavbar } from "@/components/containers/layout/mobile-navbar";

export default function WalletPage() {
    return (
        <div className="flex flex-col h-full bg-background">
            <Header />
            <MobileNavbar />
        </div>
    )
}

