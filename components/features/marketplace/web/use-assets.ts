import { useState, useEffect } from 'react'
import { ASSETS } from './assets'

export type Asset = {
  id: string
  name: string
  price: number
  image: string
  satoshiPrice: number
  ordinalNumber: number
  categories: string[]
}

const INITIAL_LOAD_SIZE = 20
const PAGE_SIZE = 20

export const useAssets = () => {
  const [assetsCache, setAssetsCache] = useState<Asset[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const loadAssetsCache = async () => {
      const allAssets = ASSETS
      setAssetsCache(allAssets)

      // Initialize assets with the first set of items
      const initialAssets = allAssets.slice(0, INITIAL_LOAD_SIZE)
      setAssets(initialAssets)
      setCurrentIndex(INITIAL_LOAD_SIZE)
    }

    loadAssetsCache()
  }, [])

  const loadMoreItems = async (startIndex: number, stopIndex: number) => {
    console.log('loadMoreItems', startIndex, stopIndex)
    if (currentIndex >= assetsCache.length) {
      console.log('No more items to load')
      return
    }

    const nextIndex = Math.min(currentIndex + PAGE_SIZE, assetsCache.length)
    const newAssets = assetsCache.slice(currentIndex, nextIndex)

    setAssets((prevAssets) => [...prevAssets, ...newAssets])
    setCurrentIndex(nextIndex)
  }

  const isItemLoaded = (index: number) => index < assets.length

  return {
    assets,
    isItemLoaded,
    loadMoreItems,
    currentIndex,
    categories: ['normal', 'rare', 'epic', 'legendary'],
  }
}