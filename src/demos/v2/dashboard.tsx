'use client'

import { useNostr, Wallet } from './useNostr'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from 'react'

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

    const handleLogout = () => {
        logout()
    }

    const handleClearWallets = () => {
        if (window.confirm("Are you sure you want to clear all wallets? This action cannot be undone.")) {
            clearWallets()
        }
    }

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">Nostr Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {!isInitialized ? (
                    <p className="text-center">Loading...</p>
                ) : (
                    <>
                        {/* Account Management Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Manage Wallets</h2>
                            <div className="space-y-2">
                                <Label htmlFor="newWalletName">New Wallet Name</Label>
                                <Input
                                    id="newWalletName"
                                    value={newWalletName}
                                    onChange={(e) => setNewWalletName(e.target.value)}
                                    placeholder="Enter your wallet name"
                                />
                            </div>
                            <Button onClick={handleGenerateKeys} disabled={isGenerating}>
                                {isGenerating ? 'Generating...' : 'Create New Wallet'}
                            </Button>
                            <Button onClick={handleClearWallets} variant="destructive" disabled={wallets.length === 0}>
                                Clear All Wallets
                            </Button>
                        </div>

                        {/* List of Wallets */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Existing Wallets</h2>
                            {wallets.length === 0 ? (
                                <p>No wallets found. Please create a new wallet.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {wallets.map((wallet: StoredWallet) => (
                                        <li key={wallet.id} className="flex justify-between items-center">
                                            <span className={`font-medium ${currentWallet?.id === wallet.id ? 'text-green-500' : ''}`}>
                                                {wallet.walletName || 'Unnamed Wallet'}
                                            </span>
                                            <div className="space-x-2">
                                                {currentWallet?.id === wallet.id ? (
                                                    <>
                                                        <Button onClick={() => signMessage()} disabled={isSigning} variant="outline">
                                                            {isSigning ? 'Signing...' : 'Sign Message'}
                                                        </Button>
                                                        <Button onClick={() => sendMessage()} disabled={isSending} variant="outline">
                                                            {isSending ? 'Sending...' : 'Send Message'}
                                                        </Button>
                                                        <Button onClick={handleLogout} variant="ghost">
                                                            Logout
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button onClick={() => handleSwitchWallet(wallet.id)} variant="ghost">
                                                        Login
                                                    </Button>
                                                )}
                                                <Button onClick={() => handleRemoveWallet(wallet.id)} variant="destructive">
                                                    Remove
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Current Wallet Details */}
                        {currentWallet && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Current Wallet: {currentWallet.walletName}</h2>
                                <div className="space-y-2">
                                    <Label htmlFor="walletName">Wallet Name</Label>
                                    <Input
                                        id="walletName"
                                        value={currentWallet.walletName}
                                        readOnly
                                    />
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
                                {currentWallet.walletName && (
                                    <div className="space-y-2">
                                        <Label htmlFor="nsec">Private Key</Label>
                                        <Input id="nsec" value={nsec || 'N/A'} readOnly />
                                        <Button onClick={getPrivateKey} disabled={isGenerating || isSigning || isSending}>
                                            {isGenerating || isSigning || isSending ? 'Retrieving...' : 'Retrieve Private Key'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </CardContent>
            {currentWallet && (
                <CardFooter className="flex justify-between">
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