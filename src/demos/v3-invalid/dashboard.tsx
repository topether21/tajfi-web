'use client'

import { useNostr } from './useNostr'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect } from 'react'

export const NostrDashboard = () => {

    // useEffect(() => {
    //     async function registerNewKey() {
    //         // Check if the browser supports alg: -47
    //         const supported = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    //         debugger
    //         if (!supported) {
    //             alert('WebAuthn with secp256k1 is not supported in this browser.')
    //         }

    //         // Proceed with creating the credential as shown above
    //         // ...
    //     }
    //     registerNewKey()
    // }, [])

    // return <div>Hello</div>

    const {
        publicKey,
        npub1Key,
        message,
        setMessage,
        signature,
        status,
        sendMessage,
    } = useNostr()

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">Nostr Dashboard</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Create a Nostr account and send messages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Button onClick={sendMessage}>Sign & Send Message</Button>
            </CardFooter>
        </Card>
    )
}
