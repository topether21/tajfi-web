import Link from 'next/link'
import { Home, Store, Wallet } from 'lucide-react'
import { Button } from "@/components/ui/button"

export const MobileNavbar = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-14 bg-card border-t border-border flex justify-around items-center z-10 md:hidden">
            <Link href="/" passHref>
                <Button variant="ghost" size="icon" className="text-foreground">
                    <Home className="h-6 w-6" />
                    <span className="sr-only">Home</span>
                </Button>
            </Link>
            <Link href="/marketplace" passHref>
                <Button variant="ghost" size="icon" className="text-foreground">
                    <Store className="h-6 w-6" />
                    <span className="sr-only">Marketplace</span>
                </Button>
            </Link>
            <Link href="/wallet" passHref>
                <Button variant="ghost" size="icon" className="text-foreground">
                    <Wallet className="h-6 w-6" />
                    <span className="sr-only">Wallet</span>
                </Button>
            </Link>
        </nav>
    )
}
