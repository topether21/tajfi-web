import { CardContent } from "@/components/ui/card"

import { Card } from "@/components/ui/card"
import { topCollections } from "./home-data"
import Image from "next/image"
import { ChevronRight } from "lucide-react"

export const TopCollections = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCollections.map((collection) => (
                <Card key={collection.id} className="bg-card bg-opacity-50 backdrop-blur-md border-border hover:border-primary transition-all duration-300 transform hover:scale-105">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                            <Image
                                src={collection.image}
                                alt={collection.name}
                                width={64}
                                height={64}
                                className="rounded-full ring-2 ring-primary"
                            />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-foreground">{collection.name}</h3>
                                <p className="text-sm text-muted-foreground">Items: {collection.items}</p>
                                <p className="text-sm text-primary">Floor: {collection.floorPrice} BTC</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-primary" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
