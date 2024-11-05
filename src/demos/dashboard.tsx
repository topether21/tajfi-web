'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNostr } from './useNostr'

export const NostrDashboard = () => {
    const {
        privateKey,
        publicKey,
        npub1Key,
        nsec1Key,
        message,
        setMessage,
        signature,
        status,
        generateKeys,
        signMessage,
        sendMessage,
        nostrRelay
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
                    <Input id="nostrRelay" value={nostrRelay} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="privateKey">Private Key</Label>
                    <Input id="privateKey" value={privateKey} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="nsec1Key">Nostr nsec1 Key</Label>
                    <Input id="nsec1Key" value={nsec1Key} readOnly />
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
                {status && <p className="text-sm text-muted-foreground my-2 text-red-300">{status}</p>}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button onClick={generateKeys}>Generate New Keys</Button>
                <Button onClick={signMessage}>Sign Message</Button>
                <Button onClick={sendMessage}>Send Message</Button>
            </CardFooter>
        </Card>
    )
}