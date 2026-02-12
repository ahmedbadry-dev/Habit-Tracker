"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { authClient } from "@/lib/auth-client"
import { forgotPasswordSchema, type TForgotPassword } from "@/schema/auth/forgotPasswordSchema"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function ForgotPasswordPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TForgotPassword>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    })

    const onSubmit = async (values: TForgotPassword) => {
        const { error } = await authClient.requestPasswordReset({
            email: values.email,
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`
        })

        // Note: Better Auth usually returns success even if user doesn't exist (security best practice).
        if (error) {
            alert(error.message)
            return
        }

        alert("If the email exists, we sent a reset link.")
    }

    return (
        <Card >
            <CardHeader>
                <h1 className="text-2xl font-medium">Forgot password</h1>
                <p className="text-sm text-muted-foreground">
                    We will send you a reset link.
                </p>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Input placeholder="Email" {...register("email")} />
                        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>

                    <Button className="w-full" disabled={isSubmitting} type="submit">
                        {isSubmitting ? <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>Sending...</span>
                        </> : "Send reset link"}
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
