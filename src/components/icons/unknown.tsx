import * as React from "react";
import type { SVGProps } from "react";

export const UnknownLogo = ({ assetId, ...props }: SVGProps<SVGSVGElement> & { assetId: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        data-name="Layer 1"
        viewBox="0 0 339.43 295.27"
        {...props}
    >
        <title>{"NA Logo"}</title>
        <rect
            x="0"
            y="0"
            width="339.43"
            height="295.27"
            style={{
                fill: "#000",
            }}
        />
        <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            style={{
                fill: "#fff",
                fontSize: "120px",
                fontFamily: "Arial, sans-serif",
            }}
        >
            {`${assetId.slice(0, 3)}`.toUpperCase()}
        </text>
    </svg>
);
