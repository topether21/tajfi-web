"use client"
import { Send, Download, Pickaxe, History } from 'lucide-react';
import { useRouter } from 'next/router';

const ActionButton = ({ Icon, label, onClick }: { Icon: React.ElementType; label: string; onClick: () => void }) => {
    return (
        <button type="button" onClick={onClick} className="flex flex-col items-center focus:outline-none">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <Icon size={24} color="white" />
            </div>
            <p className="text-white text-sm mt-2">{label}</p>
        </button>
    );
}

export const WalletHeader = () => {
    const router = useRouter();

    const handleSendClick = () => {
        router.push('/send');
    };

    const handleReceiveClick = () => {
        router.push('/receive');
    };

    const handleMintClick = () => {
        router.push('/mint');
    };

    const handleHistoryClick = () => {
        router.push('/history');
    };

    return (
        <div className="bg-background text-white p-8">
            <div className="max-w-2xl mx-auto">
                {/* Action Buttons */}
                <div className="flex justify-around mt-8">
                    <ActionButton Icon={Send} label="Send" onClick={handleSendClick} />
                    <ActionButton Icon={Download} label="Receive" onClick={handleReceiveClick} />
                    <ActionButton Icon={Pickaxe} label="Mint" onClick={handleMintClick} />
                    <ActionButton Icon={History} label="History" onClick={handleHistoryClick} />
                </div>
            </div>
        </div>
    )
}