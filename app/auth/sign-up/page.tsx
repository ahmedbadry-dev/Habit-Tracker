"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { authClient } from "@/lib/auth-client"
import { signUpSchema, type TSignUp } from "@/schema/auth/signUpSchema"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function SignUpPage() {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TSignUp>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
        mode: 'onBlur'
    })

    const onSubmit = async (values: TSignUp) => {
        const { error } = await authClient.signUp.email({
            name: values.name,
            email: values.email,
            password: values.password,
            callbackURL: "/",
        })

        if (error) {
            toast.error(error.message)
            return
        }
        toast.success('Account created successfully')
        router.push("/")
    }

    return (
        <Card>
            <CardHeader className="">
                <h1 className="text-2xl font-medium">Create account</h1>
                <p className="text-sm text-muted-foreground">
                    Start tracking habits in seconds.
                </p>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Input placeholder="Name" {...register("name")} />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Input placeholder="Email" {...register("email")} />
                        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Input type="password" placeholder="Password" {...register("password")} />
                        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Input type="password" placeholder="Confirm password" {...register("confirmPassword")} />
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <Button className="w-full" disabled={isSubmitting} type="submit">
                        {isSubmitting ? <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>Create...</span>
                        </> : "Create account"}
                    </Button>
                </form>
            </CardContent>

            <CardFooter>
                <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link className="text-primary" href="/auth/sign-in">
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
