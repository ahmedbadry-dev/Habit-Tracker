"use client"

import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { useAuthGuardContext } from "./AuthGuardProvider"

export function AuthRequiredModal() {
    const { isOpen, close } = useAuthGuardContext()

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={close}
        >
            <div
                className="bg-background border shadow-xl rounded-2xl p-8 w-[90%] max-w-md text-center space-y-6 animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">
                        Login Required
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        You need to sign in or create an account to access this feature.
                    </p>
                </div>

                <div className="flex gap-3 justify-center">
                    <Link
                        href="/auth/sign-up"
                        className={buttonVariants({ variant: "default" })}
                        onClick={close}
                    >
                        Create Account
                    </Link>

                    <Link
                        href="/auth/sign-in"
                        className={buttonVariants({ variant: "outline" })}
                        onClick={close}
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
