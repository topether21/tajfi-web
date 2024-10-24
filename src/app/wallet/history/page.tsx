'use client';

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type Transaction = {
    id: string;
    date: string;
    description: string;
    amount: number;
    currency: string;
    type: 'send' | 'receive';
};

const exampleTransactions: Transaction[] = [
    { id: '1', date: '2023-05-15', description: 'Received from Alice', amount: 50.25, currency: 'USD', type: 'receive' },
    { id: '2', date: '2023-05-14', description: 'Sent to Bob', amount: 30, currency: 'USD', type: 'send' },
    { id: '3', date: '2023-05-13', description: 'Received from Charlie', amount: 100, currency: 'EUR', type: 'receive' },
    { id: '4', date: '2023-05-12', description: 'Sent to David', amount: 75.50, currency: 'GBP', type: 'send' },
    { id: '5', date: '2023-05-11', description: 'Received from Eve', amount: 200, currency: 'USD', type: 'receive' },
    { id: '6', date: '2023-05-10', description: 'Sent to Frank', amount: 150, currency: 'EUR', type: 'send' },
    { id: '7', date: '2023-05-09', description: 'Received from Grace', amount: 300, currency: 'GBP', type: 'receive' },
];

const HistoryPage = () => {
    return (
        <div className="flex flex-col items-center justify-start h-full text-foreground">
            <h1 className="text-2xl font-bold mb-4">Wallet History</h1>
            <div className="w-full max-w-md p-4 flex-grow">
                <ScrollArea className="h-full pr-4">
                    {exampleTransactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="flex items-center justify-between py-4 border-b last:border-b-0"
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-full ${transaction.type === 'receive' ? 'bg-green-100' : 'bg-red-100'}`}>
                                    {transaction.type === 'receive' ? (
                                        <ArrowDownLeft className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <ArrowUpRight className="w-4 h-4 text-red-600" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{transaction.description}</p>
                                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                                </div>
                            </div>
                            <div className={`text-sm font-medium ${transaction.type === 'receive' ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.type === 'receive' ? '+' : '-'}
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: transaction.currency,
                                }).format(transaction.amount)}
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </div>
        </div>
    );
};

export default HistoryPage;
