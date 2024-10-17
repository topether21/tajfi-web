'use client'

import { useState, useRef } from 'react'
import { Home, Search, Bell, User, Grid as GridIcon, List as ListIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import AutoSizer from 'react-virtualized-auto-sizer'
import { useAssets } from './use-assets'
import { GridAssetItem } from './grid-asset-item';
import { ListAssetItem } from './list-asset-item';
import { CELL_PADDING, CELL_WIDTH } from './contants'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"

const calculateColumnCount = (width: number) => {
    return Math.max(1, Math.floor(width / (CELL_WIDTH + 2 * CELL_PADDING))); // Ensure at least one column
}

export const AssetsMarketplace = () => {
    const { assets } = useAssets();
    const [isGridView, setIsGridView] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [category, setCategory] = useState("All")
    const [sortBy, setSortBy] = useState("price")
    const containerRef = useRef<HTMLDivElement>(null)

    const filteredAssets = assets
        .filter(asset =>
            asset.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (category === "All" || asset.category === category)
        )
        .sort((a, b) => {
            if (sortBy === "price") return a.price - b.price
            if (sortBy === "rarity") return b.rarity - a.rarity
            return 0
        })

    return (
        <div className="flex flex-col h-full bg-blue-200">
            <div className="justify-between items-center p-4 bg-white border-b hidden md:flex">
                <h1 className="text-2xl font-bold">Taproot Assets Marketplace</h1>
                <div className="flex gap-4">
                    <Button variant="outline">Connect Wallet</Button>
                    <Button>List Asset</Button>
                    <Toggle
                        pressed={isGridView}
                        onPressedChange={setIsGridView}
                        aria-label="Toggle view"
                    >
                        {isGridView ? <GridIcon className="h-4 w-4" /> : <ListIcon className="h-4 w-4" />}
                    </Toggle>
                </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-white border-b md:hidden">
                <h1 className="text-xl font-bold">Marketplace</h1>
                <Toggle
                    pressed={isGridView}
                    onPressedChange={setIsGridView}
                    aria-label="Toggle view"
                >
                    {isGridView ? <GridIcon className="h-4 w-4" /> : <ListIcon className="h-4 w-4" />}
                </Toggle>
            </div>

            <div className="flex flex-col md:flex-row gap-4 p-4 bg-white border-b">
                <div className="relative flex-grow">
                    <Input
                        type="text"
                        placeholder="Search assets..."
                        className="pl-8 bg-gray-800 text-gray-100 border-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full md:w-[180px] bg-gray-800 text-gray-100 border-gray-700">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-gray-100 border-gray-700">
                        <SelectItem value="All">All Categories</SelectItem>
                        <SelectItem value="Art">Art</SelectItem>
                        <SelectItem value="Meme">Meme</SelectItem>
                        <SelectItem value="Historical">Historical</SelectItem>
                        <SelectItem value="Tech">Tech</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-[180px] bg-gray-800 text-gray-100 border-gray-700">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-gray-100 border-gray-700">
                        <SelectItem value="price">Price: Low to High</SelectItem>
                        <SelectItem value="rarity">Rarity: High to Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div ref={containerRef} className="container mx-auto flex-grow overflow-auto bg-red-200">
                <AutoSizer>
                    {({ width, height }) => {
                        const columnCount = calculateColumnCount(width);
                        return (
                            <AnimatePresence>
                                <motion.div
                                    className={`grid gap-6 ${isGridView ? `grid-cols-${columnCount}` : "flex flex-col"}`}
                                    layout
                                >
                                    {filteredAssets.map((asset, index) => (
                                        <motion.div
                                            key={asset.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {isGridView ? (
                                                <GridAssetItem item={asset} />
                                            ) : (
                                                <ListAssetItem index={index} style={{}} assets={filteredAssets} />
                                            )}
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        );
                    }}
                </AutoSizer>
            </div>

            <nav className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t flex justify-around items-center z-10 md:hidden">
                <Button variant="ghost" size="icon">
                    <Home className="h-6 w-6" />
                    <span className="sr-only">Home</span>
                </Button>
                <Button variant="ghost" size="icon">
                    <Search className="h-6 w-6" />
                    <span className="sr-only">Search</span>
                </Button>
                <Button variant="ghost" size="icon">
                    <Bell className="h-6 w-6" />
                    <span className="sr-only">Notifications</span>
                </Button>
                <Button variant="ghost" size="icon">
                    <User className="h-6 w-6" />
                    <span className="sr-only">Profile</span>
                </Button>
            </nav>
        </div>
    )
}