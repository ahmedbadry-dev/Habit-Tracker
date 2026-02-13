"use client"

import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { useConvexAuth } from "convex/react"

export function AuthRequiredModal({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useConvexAuth()

    if (isLoading) return null

    return (
        <div className="relative">

            {/* Main Content */}
            <div className={!isAuthenticated ? "blur-sm pointer-events-none select-none" : ""}>
                {children}
            </div>

            {/* Overlay */}
            {!isAuthenticated && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-background border shadow-xl rounded-2xl p-8 w-[90%] max-w-md text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">

                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold">
                                Join Habit Tracker
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Track your habits, build streaks, and stay consistent.
                            </p>
                        </div>

                        <div className="flex gap-3 justify-center">
                            <Link
                                href="/auth/sign-up"
                                className={buttonVariants({ variant: "default" })}
                            >
                                Create Account
                            </Link>

                            <Link
                                href="/auth/sign-in"
                                className={buttonVariants({ variant: "outline" })}
                            >
                                Login
                            </Link>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}
