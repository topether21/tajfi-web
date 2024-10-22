"use client"
import Link from 'next/link'
import { Send, Download, History } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useAuth } from '@/lib/auth-context';

export const MobileNavbar = () => {
    const { profile } = useAuth();
    if (!profile) return null;
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border flex justify-around items-center z-10 md:hidden">
            <Link href="/wallet/send" passHref tabIndex={0} aria-label="Send">
                <Button variant="ghost" size="icon" className="flex flex-col items-center text-foreground">
                    <Send className="h-6 w-6" />
                    <span className="text-xs mt-1">Send</span>
                </Button>
            </Link>
            <Link href="/wallet/receive" passHref tabIndex={0} aria-label="Receive">
                <Button variant="ghost" size="icon" className="flex flex-col items-center text-foreground">
                    <Download className="h-6 w-6" />
                    <span className="text-xs mt-1">Receive</span>
                </Button>
            </Link>
            <Link href="/wallet/history" passHref tabIndex={0} aria-label="History">
                <Button variant="ghost" size="icon" className="flex flex-col items-center text-foreground">
                    <History className="h-6 w-6" />
                    <span className="text-xs mt-1">History</span>
                </Button>
            </Link>
        </nav>
    )
}
