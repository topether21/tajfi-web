'use client'

import { FilterControls } from '@/components/containers/marketplace/filter-controls'
import { AssetsDisplay } from '@/components/containers/marketplace/assets-display'
import { useRef } from 'react'
import { useFilteredAssets } from '@/components/containers/marketplace/use-filtered-assets'
import { useState } from 'react'
import { useAssets } from '@/components/containers/marketplace/use-assets'

export const WalletAssets = () => {
  const { assets, isItemLoaded, loadMoreItems } = useAssets()
  const [isGridView, setIsGridView] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('price')
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredAssets = useFilteredAssets(assets, searchTerm, 'All', sortBy)
  return (
    <>
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
    </>
  )
}
