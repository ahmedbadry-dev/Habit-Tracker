"use client"

import { useEffect, useState } from "react"

type ProgressRingProps = {
    percentage: number
    size?: number
    strokeWidth?: number
}

export function ProgressRing({
    percentage,
    size = 96,
    strokeWidth = 8,
}: ProgressRingProps) {
    const [progress, setProgress] = useState(0)

    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius

    // Animate on mount & when percentage changes
    useEffect(() => {
        const timeout = setTimeout(() => {
            setProgress(percentage)
        }, 100)

        return () => clearTimeout(timeout)
    }, [percentage])

    const offset = circumference - (progress / 100) * circumference

    // 🎨 Dynamic color logic
    const getColor = (value: number) => {
        if (value < 40) return "#ef4444"   // Red-500
        if (value < 70) return "#f59e0b"   // Amber-500
        return "#22c55e"                   // Green-500
    }

    const strokeColor = getColor(progress)

    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            {/* Glow */}
            <div
                className="absolute inset-0 rounded-full blur-md opacity-30"
                style={{ backgroundColor: strokeColor }}
            />

            <svg width={size} height={size} className="relative">
                {/* Background circle */}
                <circle
                    stroke="rgba(255,255,255,0.08)"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />

                {/* Animated progress */}
                <circle
                    stroke={strokeColor}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                        transition: "stroke-dashoffset 1s ease-out",
                    }}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>

            {/* Center text */}
            <span className="absolute text-lg md:text-xl font-semibold tracking-tight">
                {progress}%
            </span>
        </div>
    )
}
