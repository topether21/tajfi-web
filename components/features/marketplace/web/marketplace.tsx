'use client'

import React, { useState, useRef } from 'react'
import { useAssets } from './use-assets'
import { FilterControls } from './filter-controls'
import { AssetsDisplay } from './assets-display'
import { useFilteredAssets } from './use-filtered-assets'
import { Box } from '@/components/ui/box'
import { ShoppingCartIcon } from 'lucide-react-native'
import { Fab, FabIcon } from '@/components/ui/fab'

export const AssetsMarketplace = () => {
  const { assets, isItemLoaded, loadMoreItems } = useAssets()
  const [isGridView, setIsGridView] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('price')
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredAssets = useFilteredAssets(assets, searchTerm, 'All', sortBy)

  return (
    <Box className="flex flex-col h-full bg-background">
      <FilterControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        isGridView={isGridView}
        setIsGridView={setIsGridView}
      />
      <AssetsDisplay
        filteredAssets={filteredAssets}
        isGridView={isGridView}
        isItemLoaded={isItemLoaded}
        loadMoreItems={loadMoreItems}
        containerRef={containerRef}
      />
      <Fab
        size="lg"
        className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800"
      >
        <FabIcon as={ShoppingCartIcon} className="h-4 w-4 stroke-background-tajfi-white" />
      </Fab>
      {/* <Fab
        size="lg"
        className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800"
      >
        <Box className="relative flex items-center justify-center">
          <Text className="absolute bottom-3 left-2 rounded-full text-xs text-background-tajfi-white">
            {totalItems}
          </Text>
          <FabIcon as={ShoppingCartIcon} className="h-4 w-4 stroke-background-tajfi-white" />
        </Box>
      </Fab> */}
    </Box>
  )
}
