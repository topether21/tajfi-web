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
        isSending,
        getPrivateKey,       // Imported test method
        nsec,                // Imported private key state
        nickname,            // Imported nickname state
        setNickname,         // Imported setNickname
        isInitialized        // Imported initialization status
    } = useNostr()

    const isDevelopment = true

    const handleGenerateKeys = () => {
        if (nickname.trim() === "") {
            alert("Please enter a nickname before generating keys.")
            return
        }
        generateKeys(nickname)
    }

    return (
        <Card className="w-full max-w-3xl mx-auto">
            {isInitialized && publicKey && <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">Nostr Dashboard</CardTitle>
            </CardHeader>}
            <CardContent className="space-y-4">
                {!isInitialized ? (
                    <p className="text-center">Loading...</p>
                ) : !publicKey ? (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Welcome to Nostr!</h2>
                        <p>Please create a new Nostr account to get started.</p>
                        <div className="space-y-2">
                            <Label htmlFor="nickname">Nickname</Label>
                            <Input
                                id="nickname"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="Enter your nickname"
                            />
                        </div>
                        <Button onClick={handleGenerateKeys} disabled={isGenerating}>
                            {isGenerating ? 'Generating...' : 'Create Account'}
                        </Button>
                        {status && (
                            <p className={`text-sm my-2 ${status.startsWith('Failed') || status.startsWith('Error') ? 'text-red-300' : 'text-green-300'}`}>
                                {status}
                            </p>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="nickname">Nickname</Label>
                            <Input
                                id="nickname"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="Enter your nickname"
                                readOnly
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nostrRelay">Nostr Relay</Label>
                            <Input id="nostrRelay" value="wss://relay.damus.io" readOnly />
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
                        {/* Conditionally Render Test Section in Development */}
                        {isDevelopment && nsec && (
                            <div className="space-y-2">
                                <Label htmlFor="nsec">Private Key</Label>
                                <Input id="nsec" value={nsec || 'N/A'} readOnly />
                            </div>
                        )}
                        {isDevelopment && !nsec && (
                            <Button onClick={getPrivateKey} disabled={isGenerating || isSigning || isSending}>
                                {isGenerating || isSigning || isSending ? 'Retrieving...' : 'Retrieve Private Key'}
                            </Button>
                        )}
                    </>
                )}
            </CardContent>
            {isInitialized && publicKey && (
                <CardFooter className="flex justify-between">
                    <Button onClick={handleGenerateKeys} disabled={isGenerating}>
                        {isGenerating ? 'Generating...' : 'Generate New Keys'}
                    </Button>
                    <Button onClick={signMessage} disabled={isSigning}>
                        {isSigning ? 'Signing...' : 'Sign Message'}
                    </Button>
                    <Button onClick={sendMessage} disabled={isSending}>
                        {isSending ? 'Sending...' : 'Send Message'}
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}