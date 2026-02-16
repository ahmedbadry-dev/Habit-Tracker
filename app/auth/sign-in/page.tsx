"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { authClient } from "@/lib/auth-client"
import { signInSchema, type TSignIn } from "@/schema/auth/signInSchema"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function SignInPage() {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TSignIn>({
        resolver: zodResolver(signInSchema),
        defaultValues: { email: "", password: "" },
    })

    const onSubmit: SubmitHandler<TSignIn> = async (values) => {
        const { error } = await authClient.signIn.email({
            email: values.email,
            password: values.password,
            callbackURL: "/",
        })

        if (error) {
            // replace with toast
            toast.error(error.message)
            return
        }
        toast.success('Welcome back')
        router.push("/", { scroll: false })
    }

    return (
        <Card>
            <CardContent>
                <CardHeader className="space-y-1 p-0 mb-8 text-center">
                    <h1 className="text-2xl font-medium ">Sign in</h1>
                    <p className="text-sm text-muted-foreground">
                        Welcome back — keep your streak alive.
                    </p>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Input placeholder="Email" {...register("email")} />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Input type="password" placeholder="Password" {...register("password")} />
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    <Button className="w-full mb-5" disabled={isSubmitting} type="submit">
                        {isSubmitting ?
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                <span>loading...</span>
                            </> : "Sign in"}
                    </Button>
                </form>

                <div className="flex justify-between text-sm">
                    <Link className="text-primary" href="/auth/forgot-password">
                        Forgot password?
                    </Link>
                    <Link className="text-primary" href="/auth/sign-up">
                        Create account
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
