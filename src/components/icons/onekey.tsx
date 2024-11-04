import * as React from 'react'
import type { SVGProps } from 'react'

// ref: https://help.onekey.so/hc/en-us/articles/360002200956-Media-Kit-Press-Kit
export const OneKeyLogo = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 288 288"
        fill="none"
        aria-label="OneKey Logo"
        role="img"
        {...props}
    >
        <path
            fill="#44D62C"
            d="M216 144c0 49.706-22.294 72-72 72s-72-22.294-72-72 22.294-72 72-72 72 22.294 72 72Z"
            style={{
                // @ts-ignore
                fill: "#44d62c",
                // @ts-ignore
                fill: "color(display-p3 .2667 .8392 .1725)",
                fillOpacity: 1,
            }}
        />
        <path
            fill="#000"
            d="M150.505 102.531h-20.03l-3.514 10.625h11.125v22.382h12.419v-33.007Z"
            style={{
                fill: "#000",
                fillOpacity: 1,
            }}
        />
        <path
            fill="#000"
            fillRule="evenodd"
            d="M166.844 162.626c0 12.616-10.228 22.843-22.844 22.843-12.616 0-22.843-10.227-22.843-22.843s10.227-22.843 22.843-22.843 22.844 10.227 22.844 22.843Zm-10.371 0c0 6.889-5.584 12.473-12.473 12.473-6.888 0-12.472-5.584-12.472-12.473 0-6.888 5.584-12.473 12.472-12.473 6.889 0 12.473 5.585 12.473 12.473Z"
            clipRule="evenodd"
            style={{
                fill: "#000",
                fillOpacity: 1,
            }}
        />
    </svg>
)
