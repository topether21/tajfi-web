import type { Asset } from './use-assets'
import { CELL_PADDING, LIST_ITEM_IMAGE_HEIGHT } from './constants'
import { Image } from 'expo-image'

export const ListAssetItem = ({
  index,
  style,
  assets,
}: { index: number; style: React.CSSProperties; assets: Asset[] }) => (
  <div style={{ ...style, padding: CELL_PADDING }} className="p-4 border-b border-border bg-card">
    <div className="flex items-center">
      <Image
        source={assets[index].image}
        alt={assets[index].name}
        contentFit="contain"
        className="object-cover mr-4"
      />
      <div>
        <h3 className="text-lg font-semibold text-foreground">{assets[index].name}</h3>
        <p className="text-sm text-muted-foreground">{assets[index].price} BTC</p>
      </div>
    </div>
  </div>
)
