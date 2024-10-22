import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { TetherUSDT } from "@/components/icons/tether"

export function CurrencySelector() {
    return (
        <Carousel className="w-full max-w-32">
            <CarouselContent>
                {Array.from({ length: 1 }).map((_, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                            <div className="">
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <TetherUSDT />
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
