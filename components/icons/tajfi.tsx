import * as React from "react";
import Svg, { type SvgProps, Path } from "react-native-svg";

// ref: https://www.svgrepo.com/svg/54882/uppercase-t-letter
export const TajfiIcon = (props: SvgProps) => (
	<Svg width={800} height={800} viewBox="0 0 26 26" {...props}>
		<Path
			fill="#22c55e"
			d="M19.32 26H6.679v-1.076a19.75 19.75 0 0 1 1.686-.52c.568-.15 1.18-.272 1.837-.373v-22.1H5.408L3.401 7.244h-.946a24.038 24.038 0 0 1-.19-1.691 89.08 89.08 0 0 1-.226-3.861A41.501 41.501 0 0 1 2 0h22c0 .496-.014 1.055-.039 1.672-.026.619-.058 1.257-.097 1.913s-.075 1.3-.114 1.932a20.11 20.11 0 0 1-.172 1.728h-.996l-1.99-5.313h-4.756v22.101c.656.125 1.27.248 1.836.373a9.177 9.177 0 0 1 1.648.52V26z"
		/>
	</Svg>
);
