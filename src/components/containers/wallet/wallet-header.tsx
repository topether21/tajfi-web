import { Send, Download, History } from 'lucide-react';
import Link from 'next/link';

const ActionButton = ({ Icon, label, href }: { Icon: React.ElementType; label: string; href: string }) => {
    return (
        <Link href={href} passHref>
            <div className="flex flex-col items-center focus:outline-none">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                    <Icon size={24} color="white" />
                </div>
                <p className="text-white text-sm mt-2">{label}</p>
            </div>
        </Link>
    );
}

export const DesktopWalletHeader = () => {
    return (
        <div className="hidden md:block bg-background text-white p-8">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-around mt-8">
                    <ActionButton Icon={Send} label="Send" href="/wallet/send" />
                    <ActionButton Icon={Download} label="Receive" href="/wallet/receive" />
                    <ActionButton Icon={History} label="History" href="/wallet/history" />
                </div>
            </div>
        </div>
    )
}
