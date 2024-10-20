import Link from 'next/link'
import { Send, Download, Pickaxe, History } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useAuth } from '@/lib/auth-context';

export const MobileNavbar = () => {
    const { profile } = useAuth();
    if (!profile) return null;
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border flex justify-around items-center z-10 md:hidden">
            <Link href="/send" passHref>
                <Button variant="ghost" size="icon" className="flex flex-col items-center text-foreground">
                    <Send className="h-6 w-6" />
                    <span className="text-xs mt-1">Send</span>
                </Button>
            </Link>
            <Link href="/receive" passHref>
                <Button variant="ghost" size="icon" className="flex flex-col items-center text-foreground">
                    <Download className="h-6 w-6" />
                    <span className="text-xs mt-1">Receive</span>
                </Button>
            </Link>
            <Link href="/mint" passHref>
                <Button variant="ghost" size="icon" className="flex flex-col items-center text-foreground">
                    <Pickaxe className="h-6 w-6" />
                    <span className="text-xs mt-1">Mint</span>
                </Button>
            </Link>
            <Link href="/history" passHref>
                <Button variant="ghost" size="icon" className="flex flex-col items-center text-foreground">
                    <History className="h-6 w-6" />
                    <span className="text-xs mt-1">History</span>
                </Button>
            </Link>
        </nav>
    )
}
