'use client';

import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { VerticalCurrencySelector } from "./currency-selector";
import { QRCodeSVG } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useCreateInvoice } from "@/hooks/use-create-invoice";
import { useBalances } from "@/hooks/use-balances";
import { tajfi } from "./tajfi";
import { useCopyToClipboard } from "react-use";
import { copySVGToClipboard } from "./copy-svg-to-clipboard";
import { useToast } from "@/hooks/use-toast"

const ReceivePage = () => {
    const { currencies } = useBalances();
    const [selectedOption, setSelectedOption] = useState(currencies[0]);
    const [assetAmount, setAssetAmount] = useState<number | ''>('');
    const { loading, invoice, error, } = useCreateInvoice(assetAmount, selectedOption);
    const [state, copyToClipboard] = useCopyToClipboard();
    const qrCodeRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const copyQRCodeToClipboard = () => {
        const svgElement = qrCodeRef.current?.querySelector('svg');
        try {
            copySVGToClipboard(svgElement);
            toast({
                title: "QR Code Copied",
                description: "The QR code has been successfully copied to your clipboard.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to copy the QR code.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-start h-full text-foreground">
            <h1 className="text-2xl font-bold mb-4">Receive Funds</h1>
            <div className="w-full max-w-md p-4">
                <div className="mb-8">
                    <label htmlFor="receive-amount" className="block text-base font-medium -mb-4">Amount</label>
                    <div className="flex justify-between items-center gap-4">
                        <Input
                            ref={inputRef}
                            id="receive-amount"
                            type="number"
                            value={assetAmount ?? ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || !Number.isNaN(Number(value))) {
                                    setAssetAmount(value === '' ? '' : Number(value));
                                }
                            }}
                            className="flex-grow text-xl font-light bg-transparent border-none text-white p-0 h-auto no-arrows focus:outline-none ring-2 ring-gray-800"
                        />
                        <VerticalCurrencySelector selectedOption={selectedOption} setSelectedOption={setSelectedOption} currencies={currencies} />
                    </div>
                    {/* <div className="h-px bg-gray-800 w-full mt-2" /> */}
                </div>
            </div>
            {invoice && <>
                <div ref={qrCodeRef} className="border-4 border-white">
                    <QRCodeSVG
                        value={invoice.encoded}
                        size={200}
                        bgColor={"#1a1a1a"}
                        fgColor={"#ffffff"}
                        level={"L"}
                        imageSettings={{
                            src: tajfi,
                            height: 48,
                            width: 48,
                            excavate: true,
                        }}
                    />
                </div>
                <div className="w-full flex flex-col items-center max-w-md pb-8">
                    <div className="flex justify-around w-full mt-8">
                        <Button
                            variant="ghost"
                            className="text-white flex-grow"
                            onClick={copyQRCodeToClipboard}
                        >
                            <Copy className="h-4 w-4" />
                            Copy QR Code
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-white flex-grow"
                            onClick={() => {
                                try {
                                    copyToClipboard(invoice.encoded);
                                    toast({
                                        title: "Invoice Copied",
                                        description: "The invoice has been successfully copied to your clipboard.",
                                    });
                                } catch (error) {
                                    toast({
                                        title: "Error",
                                        description: "Failed to copy the invoice.",
                                        variant: "destructive",
                                    });
                                }
                            }}
                        >
                            <Copy className="h-4 w-4" />
                            Copy Invoice
                        </Button>
                    </div>
                </div>
            </>}
        </div>
    );
};

export default ReceivePage;
