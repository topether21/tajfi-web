import { Send, Download, History } from 'lucide-react';
import Link from 'next/link';
import { CurrencySelector } from './currency_selector/currency-selector';
import NumberFlow from '@number-flow/react';
import { useBalance } from '@/app/wallet/send/use-balance';
import { Skeleton } from '@/components/ui/skeleton';

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
    const { balance, loading } = useBalance();
    return (
        <div className="hidden md:block bg-background text-white px-8">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-around mt-8">
                    <ActionButton Icon={Send} label="Send" href="/wallet/send" />
                    <ActionButton Icon={Download} label="Receive" href="/wallet/receive" />
                    <ActionButton Icon={History} label="History" href="/wallet/history" />
                </div>
                {loading ? (
                    <Skeleton className="h-12 w-full rounded-md" />
                ) : (
                    <>
                        <div className="flex justify-around">
                            <CurrencySelector />

                        </div>
                        <div className="flex justify-center">
                            <div className="text-center">
                                <p className="text-sm text-gray-400 text-center">Your balance</p>
                                <NumberFlow
                                    value={balance}
                                    trend={false}
                                    className="text-3xl font-bold text-green-500 mb-2 items-center"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
