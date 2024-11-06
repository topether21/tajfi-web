'use client'

import { useNostr, type Wallet } from './useNostr'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Plus, Trash2 } from 'lucide-react'
import { StoredWallet } from './db'

const IS_DEV = true

export const NostrDashboard = () => {
    const {
        wallets,
        currentWallet,
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
        getPrivateKey,
        nsec,
        isInitialized,
        switchWallet,
        removeWallet,
        logout,
        clearWallets
    } = useNostr()

    const [newWalletName, setNewWalletName] = useState('')

    const handleGenerateKeys = () => {
        if (newWalletName.trim() === "") {
            alert("Please enter a wallet name before generating keys.")
            return
        }
        generateKeys(newWalletName)
        setNewWalletName('')
    }

    const handleSwitchWallet = (id: string) => {
        switchWallet(id)
    }

    const handleRemoveWallet = (id: string) => {
        if (window.confirm("Are you sure you want to remove this wallet?")) {
            removeWallet(id)
        }
    }

    const handleClearWallets = () => {
        if (window.confirm("Are you sure you want to clear all wallets? This action cannot be undone.")) {
            clearWallets()
        }
    }

    if (!isInitialized) {
        return (
            <Card className="w-full max-w-3xl mx-auto">
                <CardContent className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="ml-2">Loading...</span>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">Nostr Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="wallets" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="wallets">Manage Wallets</TabsTrigger>
                        <TabsTrigger value="current" disabled={!currentWallet}>Current Wallet</TabsTrigger>
                    </TabsList>

                    <TabsContent value="wallets" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Create New Wallet</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex space-x-2">
                                    <div className="flex-grow">
                                        <Label htmlFor="newWalletName" className="sr-only">New Wallet Name</Label>
                                        <Input
                                            id="newWalletName"
                                            value={newWalletName}
                                            onChange={(e) => setNewWalletName(e.target.value)}
                                            placeholder="Enter new wallet name"
                                        />
                                    </div>
                                    <Button onClick={handleGenerateKeys} disabled={isGenerating}>
                                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                        Create
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Existing Wallets</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {wallets.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-4">No wallets found. Please create a new wallet.</p>
                                ) : (
                                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                                        <ul className="space-y-2">
                                            {wallets.map((wallet: StoredWallet) => (
                                                <li key={wallet.id} className="flex justify-between items-center p-2 bg-secondary rounded-md">
                                                    <span className={`font-medium ${currentWallet?.id === wallet.id ? 'text-primary' : ''}`}>
                                                        {wallet.walletName || 'Unnamed Wallet'}
                                                    </span>
                                                    <div className="space-x-2">
                                                        {currentWallet?.id === wallet.id ? (
                                                            <Button onClick={logout} variant="outline" size="sm">Logout</Button>
                                                        ) : (
                                                            <Button onClick={() => handleSwitchWallet(wallet.id)} variant="outline" size="sm">Login</Button>
                                                        )}
                                                        <Button onClick={() => handleRemoveWallet(wallet.id)} variant="destructive" size="sm">
                                                            <Trash2 className="w-4 h-4" />
                                                            <span className="sr-only">Remove</span>
                                                        </Button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </ScrollArea>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Danger Zone</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button onClick={handleClearWallets} variant="destructive" disabled={wallets.length === 0} className="w-full">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Clear All Wallets
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="current" className="space-y-4">
                        {currentWallet && (
                            <>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Wallet Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="walletName">Wallet Name</Label>
                                            <Input id="walletName" value={currentWallet.walletName} readOnly />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="nostrRelay">Nostr Relay</Label>
                                            <Input id="nostrRelay" value="wss://relay.damus.io" readOnly />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="publicKey">Public Key</Label>
                                            <Input id="publicKey" value={currentWallet.publicKey} readOnly />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="npub1Key">Nostr npub1 Key</Label>
                                            <Input id="npub1Key" value={currentWallet.npub1Key} readOnly />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="p2trAddress">P2TR Address</Label>
                                            <Input id="p2trAddress" value={currentWallet.p2trAddress} readOnly />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Message Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message</Label>
                                            <Input
                                                id="message"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Enter your message here"
                                            />
                                        </div>

                                        <div className="flex space-x-2">
                                            <Button onClick={signMessage} disabled={isSigning || !message} className="flex-1">
                                                {isSigning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                                Sign Message
                                            </Button>
                                            <Button onClick={sendMessage} disabled={isSending || !signature} className="flex-1">
                                                {isSending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                                Send Message
                                            </Button>
                                        </div>

                                        {signature && (
                                            <div className="space-y-2">
                                                <Label htmlFor="signature">Signature</Label>
                                                <Input id="signature" value={signature} readOnly />
                                            </div>
                                        )}

                                        {status && (
                                            <div className={`flex items-center space-x-2 ${status.startsWith('Failed') || status.startsWith('Error') ? 'text-destructive' : 'text-primary'}`}>
                                                {status.startsWith('Failed') || status.startsWith('Error') ? (
                                                    <AlertCircle className="w-4 h-4" />
                                                ) : (
                                                    <CheckCircle2 className="w-4 h-4" />
                                                )}
                                                <span>{status}</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {IS_DEV && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Development Only</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="nsec">Private Key (Development Only)</Label>
                                                <Input id="nsec" value={nsec || 'N/A'} readOnly />
                                            </div>
                                            <Button onClick={getPrivateKey} disabled={isGenerating || isSigning || isSending}>
                                                {isGenerating || isSigning || isSending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                                Retrieve Private Key
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}