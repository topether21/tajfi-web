import { CardContent } from "@/components/ui/card"
import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { TetherUSDT } from "@/components/icons/tether"
import type { AssetBalance } from "@/hooks/use-balances";
import { useEffect, useState } from "react";

export const CurrencySelector = ({ balances, setCurrentBalanceIndex }: { balances: AssetBalance[], setCurrentBalanceIndex: (index: number) => void }) => {

    const [api, setApi] = useState<CarouselApi>()
    useEffect(() => {
        if (!api) {
            return
        }
        setCurrentBalanceIndex(api.selectedScrollSnap())

        api.on("select", () => {
            setCurrentBalanceIndex(api.selectedScrollSnap())
        })
    }, [api])

    return (
        <Carousel setApi={setApi} className="w-full max-w-32">
            <CarouselContent>
                {balances?.map((balance) => (
                    <CarouselItem key={balance.assetId} >
                        <div className="p-1">
                            <div className="">
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    {balance.name === 'tether' ? <TetherUSDT /> : <div className="text-center text-3xl">{balance.name?.toUpperCase()}</div>}
                                </CardContent>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
