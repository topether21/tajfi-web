'use client';

import { SendKeywordInput } from "@/components/containers/wallet/send-keyword";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { VerticalCurrencySelector } from "./currency-selector";

const ReceivePage = () => {
    const [assetAmount, setAssetAmount] = useState("0");
    return (
        <div className="flex flex-col items-center justify-start h-full text-foreground">
            <h1 className="text-2xl font-bold mb-4">Receive Funds</h1>
            <div className="w-full max-w-md p-4">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4 gap-4">
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
        </div>
    );
};

export default ReceivePage;
