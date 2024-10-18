"use client"

import { Card, CardContent } from "@/components/ui/card"

const InfoCard = ({ title, value }: { title: string; value: string }) => {
    return (
        <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-gray-400">{title}</p>
            </CardContent>
        </Card>
    )
}

export const WalletHeader = () => {
    return (
        <div className="bg-background text-white p-8">
            <div className="max-w-2xl mx-auto">
                {/* Avatar */}
                <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 bg-purple-500 rounded-full"></div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <InfoCard title="BALANCE" value="0" />
                    <InfoCard title="INSCRIPTIONS" value="0" />
                    <InfoCard title="TOKENS" value="0" />
                    <InfoCard title="ADDRESS" value="bc1p...8ahs" />
                </div>
            </div>
        </div>
    )
}

