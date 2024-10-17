import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bitcoin, Zap } from "lucide-react";
import type { Asset } from "./use-assets";
import Image from "next/image";


interface GridAssetItemProps {
    item: Asset;
}

const typeColors: { [key: string]: string } = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-blue-200',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-green-400',
    rock: 'bg-yellow-700',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-700',
    steel: 'bg-gray-400',
    fairy: 'bg-pink-300',
};

export const GridAssetItem = ({ item }: GridAssetItemProps) => {
    const formatSatoshis = (satoshis: number) => {
        return (satoshis / 100000000).toFixed(8);
    };

    return (
        <Card className="w-full max-w-xs overflow-hidden transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-orange-100 to-orange-200">
            <CardHeader className="space-y-1">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold capitalize">{item.name}</CardTitle>
                    <Badge variant="outline" className="font-mono text-xs">
                        #{item.ordinalNumber?.toString().padStart(8, '0')}
                    </Badge>
                </div>
                <div className="flex space-x-2">
                    {item.categories?.map((category) => (
                        <Badge key={category} className={`${typeColors[category]} text-white text-xs`}>
                            {category}
                        </Badge>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative w-full h-0 pb-[100%] overflow-hidden rounded-lg bg-black/5">
                    <Image
                        src={item.image}
                        alt={item.name}
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center bg-black/5 px-6 py-4">
                <div className="flex items-center space-x-2">
                    <Bitcoin className="h-4 w-4 text-orange-500" />
                    <span className="text-base font-semibold">{formatSatoshis(item.satoshiPrice)} BTC</span>
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white text-sm">
                    <Zap className="mr-2 h-3 w-3" />
                    Buy
                </Button>
            </CardFooter>
        </Card>
    );
};