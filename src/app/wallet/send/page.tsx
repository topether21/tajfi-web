'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { QrCode } from 'lucide-react';
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardHeader, CardFooter, CardContent } from '@/components/ui/card'; // Import Card components
import { SendKeywordInput } from '@/components/containers/wallet/send-keyword';

const SendPage: React.FC = () => {
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [token, setToken] = useState('sats');

    return (
        <div className="flex flex-col items-center justify-start h-full p-4 text-white">
            <div className="w-full max-w-md mt-4">
                <SendKeywordInput />
                {/* <Card className="flex flex-col items-center justify-start h-full text-white p-4">
                    <CardHeader className="flex items-center justify-between w-full">
                        <h1 className="text-2xl font-bold">Send BTC</h1>
                    </CardHeader>
                    <CardContent className="w-full">
                        <div className="mb-4">
                            <label htmlFor="token-select" className="block text-sm font-medium mb-1">Token & Network</label>
                            <Select value={token} onValueChange={setToken}>
                                <SelectTrigger className="w-full bg-input text-foreground border-border">
                                    <SelectValue placeholder="Select Token" />
                                </SelectTrigger>
                                <SelectContent className="bg-input text-foreground border-border">
                                    <SelectItem value="sats">SATS</SelectItem>
                                    <SelectItem value="btc">BTC</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="receive-address" className="block text-sm font-medium mb-1">Receive Address</label>
                            <div className="flex items-center">
                                <Input
                                    id="receive-address"
                                    className="flex-grow"
                                    placeholder="Enter Receive Address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                                <QrCode className="ml-2" />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="amount" className="block text-sm font-medium mb-1">Amount</label>
                            <div className="flex items-center">
                                <Input
                                    id="amount"
                                    className="flex-grow"
                                    placeholder="0.0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                                <span className="ml-2">SATS</span>
                                <Button className="ml-2" variant="link">MAX</Button>
                            </div>
                            <div className="text-sm text-gray-400 mt-1">Available: 0 SATS</div>
                        </div>
                    </CardContent>
                    <CardFooter className="w-full">
                        <Button className="w-full mt-4" disabled={!address || !amount}>
                            Confirm
                        </Button>
                    </CardFooter>
                </Card> */}
            </div>
        </div>
    );
};

export default SendPage;
