import * as React from "react";
import Svg, { type SvgProps, Path } from "react-native-svg";

// ref: https://www.svgrepo.com/svg/470422/receive
export const ReceiveIcon = (props: SvgProps) => (
	<Svg width={800} height={800} fill="none" viewBox="0 0 24 24" {...props}>
		<Path
			fill="#000"
			fillRule="evenodd"
			d="M5 14.997a.75.75 0 0 1 .75.75V18c0 .138.112.25.25.25h12a.25.25 0 0 0 .25-.25v-2.253a.75.75 0 0 1 1.5 0V18A1.75 1.75 0 0 1 18 19.75H6A1.75 1.75 0 0 1 4.25 18v-2.253a.75.75 0 0 1 .75-.75ZM12.202 4.25a.75.75 0 0 1 .75.75v8.086a.75.75 0 0 1-1.5 0V5a.75.75 0 0 1 .75-.75Z"
			clipRule="evenodd"
		/>
		<Path
			fill="#000"
			fillRule="evenodd"
			d="M8.322 10.626a.75.75 0 0 1 1.06-.013l2.82 2.755 2.82-2.755a.75.75 0 1 1 1.048 1.073l-3.344 3.267a.75.75 0 0 1-1.048 0l-3.344-3.267a.75.75 0 0 1-.012-1.06Z"
			clipRule="evenodd"
		/>
	</Svg>
);
