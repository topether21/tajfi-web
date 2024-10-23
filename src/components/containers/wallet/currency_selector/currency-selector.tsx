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

export const Currency = ({ name, assetId }: { name?: string, assetId?: string }) => {
    if (assetId) {
        switch (assetId) {
            case '33fd821cad24cc72b4b54de31fb308cf38b9cccf8157c765c288d1985d3b573c':
                return <TetherUSDT />;
            default:
                return <div className="text-center text-3xl">{assetId.toUpperCase()}</div>;
        }
    }
    return name === 'tether' ? <TetherUSDT /> : <div className="text-center text-3xl">{name?.toUpperCase()}</div>
}

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
                                    <Currency name={balance.name} />
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
