import * as React from 'react'
import type { SVGProps } from 'react'

export const TajfiLogo = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        id="Layer_1"
        fill="#000"
        viewBox="0 0 192 192"
        {...props}
        aria-label="Tajfi Wallet"
        role="img"
    >
        <defs>
            <style>
                {
                    ".cls-1{fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:7px}"
                }
            </style>
        </defs>
        <path d="M96 23.57v144.86M35.43 23.57h121.14" className="cls-1" />
    </svg>
)