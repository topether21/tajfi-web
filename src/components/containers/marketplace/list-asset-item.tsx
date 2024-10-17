import Image from 'next/image';
import type { Asset } from "./use-assets";
import { CELL_PADDING, LIST_ITEM_HEIGHT, LIST_ITEM_WIDTH } from './contants';

export const ListAssetItem = ({ index, style, assets }: { index: number; style: React.CSSProperties; assets: Asset[] }) => (
    <div style={{ ...style, padding: CELL_PADDING }} className="p-4 border-b">
        <div className="flex items-center">
            {/* <Image
                src={assets[index].image}
                alt={assets[index].name}
                width={LIST_ITEM_WIDTH}
                height={LIST_ITEM_HEIGHT}
                style={{ width: 'auto', height: 'auto' }}
                className="object-cover mr-4"
            /> */}
            <div>
                <h3 className="text-lg font-semibold">{assets[index].name}</h3>
                <p className="text-sm text-gray-600">{assets[index].price} BTC</p>
            </div>
        </div>
    </div>
);
