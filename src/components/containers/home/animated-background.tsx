'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { MotionDiv } from '@/components/containers/shared'

export const AnimatedBackground = () => {
    const [animatedDots, setAnimatedDots] = useState<{ id: string; x: number; y: number }[]>([])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const dots = Array.from({ length: 20 }, (_, index) => ({
                id: `dot-${index}-${Date.now()}-${Math.random()}`,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
            }))
            setAnimatedDots(dots)
        }
    }, [])

    return (
        <>
            {animatedDots.map((dot) => (
                <MotionDiv
                    key={dot.id}
                    className="absolute w-2 h-2 bg-primary rounded-full opacity-50"
                    animate={{
                        x: [dot.x, Math.random() * window.innerWidth],
                        y: [dot.y, Math.random() * window.innerHeight],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: 'reverse',
                    }}
                />
            ))}
        </>
    )
}
