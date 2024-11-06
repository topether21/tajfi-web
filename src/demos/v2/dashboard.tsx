'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNostr } from './useNostr'

export const NostrDashboard = () => {
    const {
        publicKey,
        npub1Key,
        message,
        setMessage,
        signature,
        status,
        generateKeys,
        signMessage,
        sendMessage,
        isGenerating,
        isSigning,
        isSending
    } = useNostr()

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">Nostr Dashboard</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Create a Nostr account and send messages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="nostrRelay">Nostr Relay</Label>
                    <Input id="nostrRelay" value="wss://relay.damus.io" readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="privateKey">Private Key</Label>
                    <Input id="privateKey" value="N/A" readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="nsec1Key">Nostr nsec1 Key</Label>
                    <Input id="nsec1Key" value="N/A" readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="publicKey">Public Key</Label>
                    <Input id="publicKey" value={publicKey} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="npub1Key">Nostr npub1 Key</Label>
                    <Input id="npub1Key" value={npub1Key} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Input
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your message here"
                    />
                </div>
                {signature && (
                    <div className="space-y-2">
                        <Label htmlFor="signature">Signature</Label>
                        <Input id="signature" value={signature} readOnly />
                    </div>
                )}
                {status && (
                    <p className={`text-sm my-2 ${status.startsWith('Failed') || status.startsWith('Error') ? 'text-red-300' : 'text-green-300'}`}>
                        {status}
                    </p>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button onClick={generateKeys} disabled={isGenerating}>
                    {isGenerating ? 'Generating...' : 'Generate New Keys'}
                </Button>
                <Button onClick={signMessage} disabled={isSigning}>
                    {isSigning ? 'Signing...' : 'Sign Message'}
                </Button>
                <Button onClick={sendMessage} disabled={isSending}>
                    {isSending ? 'Sending...' : 'Send Message'}
                </Button>
            </CardFooter>
        </Card>
    )
}