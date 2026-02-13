"use client"

import { useConvexAuth } from "convex/react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export function AuthGate({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useConvexAuth()

    if (isLoading) return <p>Loading...</p>

    if (!isAuthenticated) {
        return (
            <div className="flex gap-2">
                <Link href="/auth/sign-up" className={buttonVariants({ variant: "default" })}>
                    Sign-up
                </Link>
                <Link href="/auth/sign-in" className={buttonVariants({ variant: "outline" })}>
                    Sign-in
                </Link>
            </div>
        )
    }

    return <>{children}</>
}
