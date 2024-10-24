'use client';

import { useState } from "react";
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardHeader, CardFooter, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Share } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Input } from "@/components/ui/input";
import { Currency } from "@/components/containers/wallet/currency_selector/currency-selector";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const ReceivePage: React.FC = () => {
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState(0);
    const [assetId, setAssetId] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleConfirm = () => {
        setIsConfirmed(true);
        console.log("Transaction confirmed");
    };

    return (
        <div className="flex flex-col items-center justify-start h-full text-white">
            <div className="w-full max-w-md">
                <Card className="flex flex-col items-center justify-start h-full text-white p-4 bg-background">
                    <CardHeader className="flex items-center justify-between w-full">
                        <h1 className="text-2xl font-bold">Receive BTC</h1>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <div className="border-4 border-white p-2">
                            <QRCodeSVG
                                value={address}
                                size={200}
                                bgColor={"#1a1a1a"}
                                fgColor={"#ffffff"}
                                level={"L"}
                                imageSettings={{
                                    src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWJpdGNvaW4iPjxwYXRoIGQ9Ik0xMS43NjcgMTkuMDg5YzQuOTI0Ljg2OCA2LjE0LTYuMDI1IDEuMjE2LTYuODk0bS0xLjIxNiA2Ljg5NEw1Ljg2IDE4LjA0N201LjkwOCAxLjA0Mi0uMzQ3IDEuOTdtMS41NjMtOC44NjRjNC45MjQuODY5IDYuMTQtNi4wMjUgMS4yMTUtNi44OTNtLTEuMjE1IDYuODkzLTMuOTQtLjY5NG01LjE1NS02LjJMOC4yOSA0LjI2bTUuOTA4IDEuMDQyLjM0OC0xLjk3TTcuNDggMjAuMzY0bDMuMTI2LTE3LjcyNyIvPjwvc3ZnPg==",
                                    height: 48,
                                    width: 48,
                                    excavate: true,
                                }}
                            />
                        </div>
                        <p className="mt-4 text-sm">{address}</p>
                        <p className="text-xs">(No Speed fee)</p>
                        <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                            <span className="text-lg font-medium">Amount:</span>
                            <span className="text-2xl font-bold">{amount}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                            <span className="text-lg font-medium">Currency:</span>
                            <div className="h-8 w-8">
                                <Currency assetId={assetId} />
                            </div>
                        </div>
                        {!isConfirmed && (
                            <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                                <AlertCircle className="mr-2" />
                                <span className="text-xs">Please review the details before confirming.</span>
                            </div>
                        )}
                        {isConfirmed && (
                            <div className="flex items-center text-green-600 dark:text-green-400">
                                <CheckCircle2 className="mr-2" />
                                <span>Transaction confirmed.</span>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="w-full flex flex-col items-center">
                        <div className="flex justify-around w-full mt-4">
                            <Button variant="ghost" className="text-white">
                                <Copy className="h-4 w-4" />
                                Copy QR Code
                            </Button>
                            <Button variant="ghost" className="text-white">
                                <Copy className="h-4 w-4" />
                                Copy Invoice
                            </Button>
                            <Button variant="ghost" className="text-white">
                                <Share className="h-4 w-4" />
                                Share QR
                            </Button>
                        </div>
                        <Button
                            className="mt-4 w-full text-foreground bg-blue-600"
                            onClick={handleConfirm}
                            disabled={isConfirmed}
                        >
                            {isConfirmed ? "Confirmed" : "Confirm"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default ReceivePage;