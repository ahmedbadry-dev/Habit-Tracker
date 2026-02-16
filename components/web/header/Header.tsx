"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { throttle } from "@/utils/throttle"

export const Header = ({ children, px = 6 }: { children: React.ReactNode, px?: number }) => {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = throttle(() => {
            setScrolled(window.scrollY > 20)
        }, 100)

        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header
            className={cn(
                "sticky top-0 z-50 transition-all duration-300 ease-out",
                scrolled
                    ? "backdrop-blur-md bg-background/70 shadow-sm border-b"
                    : "bg-transparent"
            )}
        >
            <div
                className={cn(
                    "mx-auto flex items-center justify-between transition-all duration-300",
                    px === 0 ? "px-0" : "px-6",
                    scrolled ? "py-3 scale-[0.98]" : "py-6 scale-100"

                )}
            >
                {children}
            </div>
        </header>
    )
}
