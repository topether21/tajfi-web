'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { QrCode } from "lucide-react";
import { useDebounce } from "react-use";
import { Button } from "@/components/ui/button";
import { useInvoiceDetails } from "@/hooks/use-invoice-details";
import { Currency } from "@/components/containers/wallet/currency_selector/currency-selector";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

interface TransactionSummaryProps {
    amount: number;
    assetId: string;
}

const TransactionSummary = ({ amount, assetId }: TransactionSummaryProps) => {
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleConfirm = () => {
        setIsConfirmed(true);
        console.log("Transaction confirmed");
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Transaction Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                    <span className="text-lg font-medium">Amount:</span>
                    <span className="text-2xl font-bold">
                        {amount}
                    </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                    <span className="text-lg font-medium">Currency:</span>
                    <Currency assetId={assetId} />
                </div>
                {!isConfirmed && (
                    <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                        <AlertCircle className="mr-2" />
                        <span>Please review the details before confirming.</span>
                    </div>
                )}
                {isConfirmed && (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                        <CheckCircle2 className="mr-2" />
                        <span>Transaction confirmed. Funds will be sent shortly.</span>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full text-lg"
                    size="lg"
                    onClick={handleConfirm}
                    disabled={isConfirmed}
                >
                    {isConfirmed ? "Confirmed" : "Confirm and Send Funds"}
                    {!isConfirmed && <ArrowRight className="ml-2" />}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default function SendPage() {

    const [invoice, setInvoice] = useState('');
    const { loading, value: invoiceDetails, error } = useInvoiceDetails(invoice);

    const amount = invoiceDetails?.amount;
    const assetId = invoiceDetails?.assetId;

    const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newInvoice = e.target.value;
        console.log({ newInvoice });
        setInvoice(newInvoice);
    };


    console.log({ invoice, invoiceDetails });

    return (
        <div className="flex flex-col items-center justify-start h-full text-foreground">
            <h1 className="text-2xl font-bold mb-4">Send Payment</h1>
            <div className="w-full max-w-md p-4">
                {loading ? (
                    <Skeleton className="h-12 w-full rounded-md" />
                ) : (
                    <>
                        <div className="mb-6">
                            <label htmlFor="receive-invoice" className="block text-sm font-medium mb-1">Invoice</label>
                            <div className="flex items-center">
                                <Input
                                    id="receive-invoice"
                                    className="flex-grow"
                                    value={invoice}
                                    onChange={handleInvoiceChange}
                                />
                                <QrCode className="ml-2" />
                            </div>
                            {/* Updated Transaction Summary */}
                            {invoiceDetails && (
                                <TransactionSummary amount={amount} currency={invoiceDetails.assetId} />
                            )}
                            {error && <p className="text-red-500">{error}</p>}
                        </div>
                        <Button className="w-full">Send</Button>
                    </>
                )}
            </div>
        </div>
    );
};
