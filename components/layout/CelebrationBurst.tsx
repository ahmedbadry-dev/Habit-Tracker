'use client'

import { motion } from 'framer-motion'
import React from 'react'

const COLORS = [
    '#22c55e', // green
    '#3b82f6', // blue
    '#f59e0b', // amber
    '#ef4444', // red
    '#a855f7', // purple
]

export default function CelebrationBurst() {
    const particles = Array.from({ length: 14 })

    return (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {particles.map((_, i) => {
                const angle = (i / particles.length) * 2 * Math.PI
                const distance = 60 + Math.random() * 20

                const x = Math.cos(angle) * distance
                const y = Math.sin(angle) * distance

                return (
                    <motion.span
                        key={i}
                        initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                        animate={{
                            opacity: 0,
                            x,
                            y,
                            scale: 0.6,
                        }}
                        transition={{
                            duration: 0.7,
                            ease: 'easeOut',
                        }}
                        className="absolute h-2 w-2 rounded-full"
                        style={{
                            backgroundColor:
                                COLORS[Math.floor(Math.random() * COLORS.length)],
                        }}
                    />
                )
            })}
        </div>
    )
}
