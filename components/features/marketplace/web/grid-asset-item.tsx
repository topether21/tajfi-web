import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import type { Asset } from './use-assets'
import { MIN_CARD_HEIGHT } from './constants'
import { Image } from 'expo-image'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { StyleSheet } from 'react-native'
import { Pressable } from "@/components/ui/pressable"
import { router } from 'expo-router'
import { useStore } from '@nanostores/react'
import { $checkoutAssetIds, addCheckoutAssetId, removeCheckoutAssetId } from '@/store/checkout-store'
import { Plus } from 'lucide-react-native'

interface GridAssetItemProps {
  item: Asset
}

export const GridAssetItem = ({ item }: GridAssetItemProps) => {
  const formatSatoshis = (satoshis: number) => {
    return (satoshis / 100000000).toFixed(8)
  }
  const checkoutAssetIds = useStore($checkoutAssetIds);
  const isChecked = checkoutAssetIds.find(id => id === item.id);
  const goToAsset = () => router.push(`/marketplace/${item.id}`);
  const toggleCheckout = () => {
    console.log('toggleCheckout', item.id, isChecked, checkoutAssetIds);
    if (isChecked) {
      console.log('removing from checkout', item.id);
      removeCheckoutAssetId(item.id);
    } else {
      console.log('adding to checkout', item.id);
      addCheckoutAssetId(item.id);
    }
  }
  console.log('checkoutAssetIds', checkoutAssetIds);
  return (
    <Pressable>
      <Card
        className="m-2 overflow-hidden relative rounded-t-lg border"
        style={{ height: MIN_CARD_HEIGHT }}
      >
        <Pressable className="absolute top-2 right-2 z-10" onPress={toggleCheckout}>
          <Badge className="bg-background-tajfi-deep-blue text-white p-1 rounded-full" >
            {isChecked ? <Check size={16} /> : <Plus size={16} />}
          </Badge>
        </Pressable>
        <Image
          source={item.image}
          alt={item.name}
          contentFit="contain"
          className="select-none h-[85%] w-full"
          transition={500}
        />
        <Box>
          <Text className="text-xs font-bold capitalize">{item.name}</Text>
          <Text className="text-xs">{formatSatoshis(item.price)} BTC</Text>
        </Box>
      </Card>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  image: {
    height: '85%',
    width: '100%',
    backgroundColor: '#0553',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});