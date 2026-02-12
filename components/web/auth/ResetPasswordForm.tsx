"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { authClient } from "@/lib/auth-client"
import { resetPasswordSchema, type TResetPassword } from "@/schema/auth/resetPasswordSchema"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function ResetPasswordForm({
    token,
    error,
}: {
    token: string
    error?: string
}) {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TResetPassword>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { newPassword: "", confirmNewPassword: "" },
    })

    const onSubmit = async (values: TResetPassword) => {
        if (!token) {
            alert("Missing reset token.")
            return
        }

        const { error } = await authClient.resetPassword({
            token,
            newPassword: values.newPassword,
        })

        if (error) {
            alert(error.message)
            return
        }

        router.push("/auth/sign-in")
    }

    return (
        <Card >
            <CardHeader>
                <div className="space-y-1">
                    <h1 className="text-2xl font-medium">Reset password</h1>

                    {error && (
                        <p className="text-sm text-destructive">
                            Reset link is invalid or expired.
                        </p>
                    )}

                    {!token && !error && (
                        <p className="text-sm text-destructive">
                            Missing token. Please request a new reset link.
                        </p>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Input type="password" placeholder="New password" {...register("newPassword")} />
                        {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Input
                            type="password"
                            placeholder="Confirm new password"
                            {...register("confirmNewPassword")}
                        />
                        {errors.confirmNewPassword && (
                            <p className="text-sm text-destructive">{errors.confirmNewPassword.message}</p>
                        )}
                    </div>

                    <Button className="w-full" disabled={isSubmitting || !token} type="submit">
                        {isSubmitting ? <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>Resetting...</span>
                        </> : "Reset password"}
                    </Button>
                </form>
            </CardContent>

            <CardFooter>
                <Link className="text-sm text-primary" href="/auth/sign-in">
                    Back to sign in
                </Link>
            </CardFooter>
        </Card>
    )
}
