import * as React from 'react'
import type { SVGProps } from 'react'

// ref: https://next-cdn.unisat.io/_/315/logo/color.svg
// https://unisat.io/
export const UnisatLogo = (props: SVGProps<SVGSVGElement>) => (
    <div className="pl-[10px]">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            id="_frame_2"
            data-name="frame 2"
            viewBox="0 0 100 100"
            aria-label="Unisat Logo"
            role="img"
            {...props}
        >
            <defs>
                <linearGradient
                    id="_ll_126"
                    x1={961.68}
                    x2={986.14}
                    y1={-45.57}
                    y2={-110.06}
                    gradientTransform="rotate(-134.73 530.537 173.023)"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset={0} stopColor="#070100" />
                    <stop offset={0.36} stopColor="#77390d" />
                    <stop offset={0.67} stopColor="#ea8101" />
                    <stop offset={1} stopColor="#f4b852" />
                </linearGradient>
                <linearGradient
                    id="_ll_121"
                    x1={965.17}
                    x2={929.22}
                    y1={-132.41}
                    y2={-65.22}
                    gradientTransform="rotate(-134.73 530.537 173.023)"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset={0} stopColor="#070100" />
                    <stop offset={0.37} stopColor="#77390d" />
                    <stop offset={0.67} stopColor="#ea8101" />
                    <stop offset={1} stopColor="#f4fb52" />
                </linearGradient>
                <radialGradient
                    id="_ll_123"
                    cx={35.59}
                    cy={30.76}
                    r={7.47}
                    fx={35.59}
                    fy={30.76}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset={0} stopColor="#f4b852" />
                    <stop offset={0.33} stopColor="#ea8101" />
                    <stop offset={0.64} stopColor="#77390d" />
                    <stop offset={1} stopColor="#070100" />
                </radialGradient>
                <style>
                    {
                        '.cls-4{fill:#fff;font-family:JetBrainsMonoRoman-Medium,"JetBrains Mono";font-size:24.79px;font-variation-settings:"wght"500}'
                    }
                </style>
            </defs>
            <g id="_frame_1-2">
                <path
                    d="m54.81 8.91 20.34 20.14c1.73 1.71 2.58 3.44 2.55 5.19-.03 1.74-.77 3.34-2.23 4.78-1.52 1.51-3.16 2.28-4.92 2.31-1.76.03-3.5-.82-5.24-2.53l-20.8-20.6c-2.36-2.34-4.64-4-6.84-4.97-2.19-.97-4.5-1.12-6.92-.46-2.42.66-5.02 2.37-7.8 5.13-3.84 3.8-5.67 7.37-5.48 10.71.19 3.34 2.09 6.79 5.71 10.38l20.97 20.77c1.75 1.73 2.61 3.46 2.58 5.18-.03 1.72-.78 3.32-2.26 4.78-1.48 1.46-3.1 2.23-4.88 2.29-1.77.06-3.53-.78-5.28-2.51L13.99 49.36c-3.31-3.28-5.7-6.38-7.17-9.3-1.47-2.92-2.02-6.23-1.64-9.92.34-3.16 1.36-6.22 3.04-9.19 1.69-2.97 4.1-6 7.23-9.11 3.73-3.7 7.29-6.53 10.69-8.5 3.4-1.97 6.68-3.07 9.85-3.3 3.17-.23 6.3.4 9.4 1.89 3.09 1.49 6.23 3.81 9.43 6.98Z"
                    style={{
                        fill: "url(#_ll_126)",
                        transform: "translate(10, 20)",
                    }}
                />
                <path
                    d="M22.92 90.19 2.58 70.05C.85 68.34 0 66.61.03 64.86s.77-3.34 2.23-4.78c1.52-1.51 3.16-2.28 4.92-2.31 1.76-.03 3.5.81 5.24 2.53l20.8 20.6c2.37 2.34 4.64 4 6.84 4.97s4.5 1.12 6.92.46c2.42-.66 5.02-2.37 7.8-5.13 3.84-3.8 5.67-7.37 5.48-10.71-.19-3.34-2.09-6.8-5.71-10.38L43.38 49.14c-1.75-1.73-2.61-3.46-2.58-5.18.03-1.72.78-3.32 2.26-4.78 1.48-1.46 3.1-2.23 4.88-2.29 1.77-.06 3.53.78 5.28 2.51l10.53 10.34c3.31 3.28 5.7 6.38 7.17 9.3 1.47 2.92 2.02 6.23 1.64 9.92-.34 3.16-1.36 6.22-3.04 9.19-1.69 2.97-4.1 6-7.23 9.11-3.73 3.7-7.29 6.53-10.69 8.5-3.4 1.97-6.68 3.07-9.85 3.3-3.17.23-6.3-.4-9.4-1.89-3.09-1.49-6.24-3.81-9.43-6.98Z"
                    style={{
                        fill: "url(#_ll_121)",
                    }}
                />
                <circle
                    cx={35.6}
                    cy={30.75}
                    r={7.47}
                    style={{
                        fill: "url(#_ll_123)",
                    }}
                />
            </g>
        </svg>
    </div>
)
