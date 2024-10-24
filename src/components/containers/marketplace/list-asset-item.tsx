import Image from 'next/image'
import type { Asset } from './use-assets'
import { CELL_PADDING, LIST_ITEM_IMAGE_HEIGHT } from '../../../lib/constants'

export const ListAssetItem = ({
  index,
  style,
  assets,
}: { index: number; style: React.CSSProperties; assets: Asset[] }) => (
  <div style={{ ...style, padding: CELL_PADDING }} className="p-4 border-b border-border bg-card">
    <div className="flex items-center">
      <Image
        src={assets[index].image}
        alt={assets[index].name}
        height={LIST_ITEM_IMAGE_HEIGHT}
        width={LIST_ITEM_IMAGE_HEIGHT}
        className="object-cover mr-4"
      />
      <div>
        <h3 className="text-lg font-semibold text-foreground">{assets[index].name}</h3>
        <p className="text-sm text-muted-foreground">{assets[index].price} BTC</p>
      </div>
    </div>
  </div>
)
