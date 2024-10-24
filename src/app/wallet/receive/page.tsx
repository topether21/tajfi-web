'use client';

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { VerticalCurrencySelector } from "./currency-selector";
import { QRCodeSVG } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

const ReceivePage = () => {
    const [assetAmount, setAssetAmount] = useState("0");
    const [invoice, setInvoice] = useState("");
    return (
        <div className="flex flex-col items-center justify-start h-full text-foreground">
            <h1 className="text-2xl font-bold mb-4">Receive Funds</h1>
            <div className="w-full max-w-md p-4">
                <div className="mb-8">
                    <div className="flex justify-between items-center gap-4">
                        <Input
                            type="text"
                            value={assetAmount}
                            onChange={(e) => setAssetAmount(e.target.value)}
                            className="text-4xl font-light bg-transparent border-none text-white p-0 h-auto"
                        />
                        <VerticalCurrencySelector />
                    </div>
                    <div className="h-px bg-gray-800 w-full mt-2" />
                </div>
            </div>
            <div className="border-4 border-white">
                <QRCodeSVG
                    value={invoice}
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
            <div className="w-full flex flex-col items-center max-w-md pb-8">
                <div className="flex justify-around w-full mt-8">
                    <Button variant="ghost" className="text-white flex-grow">
                        <Copy className="h-4 w-4" />
                        Copy QR Code
                    </Button>
                    <Button variant="ghost" className="text-white flex-grow">
                        <Copy className="h-4 w-4" />
                        Copy Invoice
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ReceivePage;
