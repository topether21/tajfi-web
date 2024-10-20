import { Header } from '@/components/containers/layout/header';
import { MobileNavbar } from '@/components/containers/layout/mobile-navbar';

const WalletLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            <div className="h-screen flex flex-col bg-background">
                {children}
            </div>
            <MobileNavbar />
        </>
    );
};

export default WalletLayout;