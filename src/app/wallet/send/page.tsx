'use client';

import NumberFlow from "@number-flow/react";
import { useBalance } from "./use-balance";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { decode, type DecodedInvoice } from 'light-bolt11-decoder';

export default function SendPage() {
    const { balance, loading } = useBalance();
    const [invoice, setInvoice] = useState('');
    const [invoiceDetails, setInvoiceDetails] = useState<DecodedInvoice | null>(null);

    const amount = invoiceDetails?.sections.find((s) => s.name === 'amount')?.value;
    const description = invoiceDetails?.sections.find((s) => s.name === 'description')?.value;
    const expiry = invoiceDetails?.expiry;
    const paymentHash = invoiceDetails?.sections.find((s) => s.name === 'payment_hash')?.value;


    const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newInvoice = e.target.value;
        setInvoice(newInvoice);

        try {
            const decoded = decode(newInvoice);
            setInvoiceDetails(decoded);
        } catch (error) {
            setInvoiceDetails(null);
        }
    };


    console.log({ invoiceDetails });

    return (
        <div className="flex flex-col items-center justify-start h-full text-foreground">
            <div className="w-full max-w-md p-4">
                {loading ? (
                    <Skeleton className="h-12 w-full rounded-md" />
                ) : (
                    <>
                        <div className="mb-4">
                            <p className="text-sm text-gray-400">Your balance</p>
                            <NumberFlow
                                value={balance}
                                trend={false}
                                className="text-3xl font-bold text-green-500 mb-2"
                                format={{ style: 'currency', currency: 'USD' }}
                            />
                        </div>
                        <div className="mb-4">
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
                            {invoiceDetails && (
                                <div className="mt-2 text-sm text-gray-600">
                                    <p className="text-2xl font-bold text-primary mb-2">Amount: {amount}</p>
                                </div>
                            )}
                        </div>
                        <Button>Send</Button>
                    </>
                )}
            </div>
        </div>
    );
};

