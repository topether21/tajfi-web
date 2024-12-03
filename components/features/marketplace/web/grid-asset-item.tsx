import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import type { Asset } from './use-assets'
import { MIN_CARD_HEIGHT } from './constants'
import { Image } from 'expo-image'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Pressable, StyleSheet } from 'react-native'
import { router } from 'expo-router'

interface GridAssetItemProps {
  item: Asset
}

export const GridAssetItem = ({ item }: GridAssetItemProps) => {
  const formatSatoshis = (satoshis: number) => {
    return (satoshis / 100000000).toFixed(8)
  }

  return (
    <Pressable onPress={() => router.push(`/marketplace/${item.id}`)}>
      <Card
        className="m-2 overflow-hidden transition-all duration-300 hover:shadow-lg relative rounded-md"
        style={{ height: MIN_CARD_HEIGHT }}
      >
        <Box className="absolute top-2 right-2">
          <Badge className="bg-background-tajfi-deep-blue text-white p-1 rounded-full">
            <Check size={16} />
          </Badge>
        </Box>
        <Image
          source={item.image}
          alt={item.name}
          contentFit="contain"
          style={styles.image}
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