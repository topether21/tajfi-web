'use client';

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Currency } from "@/components/containers/wallet/currency_selector/currency-selector";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type Transaction = {
    txid: string;
    timestamp: string;
    height: number;
    asset_id: string;
    type: 'send' | 'receive';
    amount: number;
};

const exampleTransactions: Transaction[] = [
    { txid: 'blockchaintxid1', timestamp: '1684233600', height: 100, asset_id: '0e772328a0234306f7caf5e6fd4d6f010de6f7ed1691f3f5c9cd2c86325214db', type: 'receive', amount: 50 },
    { txid: 'blockchaintxid2', timestamp: '1684147200', height: 101, asset_id: '0e772328a0234306f7caf5e6fd4d6f010de6f7ed1691f3f5c9cd2c86325214db', type: 'send', amount: 30 },
    { txid: 'blockchaintxid3', timestamp: '1684060800', height: 102, asset_id: 'tcr', type: 'receive', amount: 100 },
    { txid: 'blockchaintxid4', timestamp: '1683974400', height: 103, asset_id: '0e772328a0234306f7caf5e6fd4d6f010de6f7ed1691f3f5c9cd2c86325214db', type: 'send', amount: 75 },
    { txid: 'blockchaintxid5', timestamp: '1683888000', height: 104, asset_id: 'tcr', type: 'receive', amount: 200 },
    { txid: 'blockchaintxid6', timestamp: '1683801600', height: 105, asset_id: '0e772328a0234306f7caf5e6fd4d6f010de6f7ed1691f3f5c9cd2c86325214db', type: 'send', amount: 150 },
    { txid: 'blockchaintxid7', timestamp: '1683715200', height: 106, asset_id: 'tcr', type: 'receive', amount: 300 },
];

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
    const isReceive = transaction.type === 'receive';
    const date = new Date(Number.parseInt(transaction.timestamp) * 1000);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();

    return (
        <div className="flex items-center justify-between py-4 border-b last:border-b-0">
            <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${isReceive ? 'bg-green-100' : 'bg-red-100'}`}>
                    {isReceive ? (
                        <ArrowDownLeft className="w-4 h-4 text-green-600" />
                    ) : (
                        <ArrowUpRight className="w-4 h-4 text-red-600" />
                    )}
                </div>
                <div>
                    <p className="text-base font-semibold">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center h-8 w-8">
                                        <Currency assetId={transaction.asset_id} />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{transaction.asset_id}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </p>
                    <p className="text-sm text-gray-500">{formattedDate} {formattedTime}</p>
                </div>
            </div>
            <div className={`text-base font-semibold ${isReceive ? 'text-green-600' : 'text-red-600'}`}>
                {isReceive ? '+' : '-'}
                {transaction.amount}
            </div>
        </div>
    );
};

const HistoryPage = () => {
    return (
        <div className="flex flex-col items-center justify-start h-full text-foreground">
            <h1 className="text-2xl font-bold mb-4">Wallet History</h1>
            <div className="w-full max-w-md p-4 flex-grow">
                <ScrollArea className="h-full pr-4">
                    {exampleTransactions.map((transaction) => (
                        <TransactionItem key={transaction.txid} transaction={transaction} />
                    ))}
                </ScrollArea>
            </div>
        </div>
    );
};

export default HistoryPage;
