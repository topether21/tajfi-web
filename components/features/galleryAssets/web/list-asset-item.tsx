import { Image } from "expo-image";
import { CELL_PADDING } from "./constants";
import type { Asset } from "./use-assets";

export const ListAssetItem = ({
	index,
	style,
	assets,
}: { index: number; style: React.CSSProperties; assets: Asset[] }) => (
	<div
		style={{ ...style, padding: CELL_PADDING }}
		className="p-4 border-b border-border bg-card"
	>
		<div className="flex items-center">
			<Image
				source={assets[index].image}
				alt={assets[index].name}
				contentFit="contain"
				className="object-cover mr-4"
			/>
			<div>
				<h3 className="text-lg font-semibold text-foreground">
					{assets[index].name}
				</h3>
				<p className="text-sm text-muted-foreground">
					{assets[index].order?.amount_sats_to_receive ?? ""} BTC
				</p>
			</div>
		</div>
	</div>
);
