'use client'

import * as React from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { HabitForm } from "@/components/web/habit/HabitForm"
import { SubmitHandler, useForm } from "react-hook-form"
import { habitSchema, THabitFormValues } from "@/schema/habitSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Header } from "@/components/web/header/Header"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function AddHabitClient() {
    const router = useRouter()
    const createHabit = useMutation(api.habits.createHabit)
    const settings = useQuery(api.settings.getMySettings)

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { isSubmitting },
    } = useForm<THabitFormValues>({
        resolver: zodResolver(habitSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "health",
            icon: "heart",
            color: "indigo",
            frequency: "daily",
            target: undefined,
            unit: "times",
            reminders: {
                enabled: false,
                time: "09:00",
            },
        },
    })

    React.useEffect(() => {
        if (!settings?.defaultReminderTime) return
        setValue("reminders.time", settings.defaultReminderTime, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        })
    }, [settings?.defaultReminderTime, setValue])

    const remindersEnabled = watch("reminders.enabled")

    const onSubmit: SubmitHandler<THabitFormValues> = async (data) => {
        try {
            const payload = {
                ...data,
                target:
                    typeof data.target === "number" && data.target > 0
                        ? data.target
                        : undefined,
            }

            await createHabit(payload)

            toast.success("Habit created successfully 🎉")

            router.push("/")
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="p-4 space-y-4">
            <Header>
                <div className="flex gap-6 items-center">
                    <Link
                        href="/"
                        className={buttonVariants({ variant: "outline" })}
                    >
                        <ArrowLeft className="size-4" />
                    </Link>

                    <div className="relative">
                        <p className="text-2xl font-medium">New Habit</p>
                        <span className="absolute w-[50%] h-1 bg-primary -bottom-2 rounded"></span>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={handleSubmit(onSubmit)}
                >
                    {isSubmitting ? <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Creating...</span>
                    </> : "Create"}
                </Button>
            </Header>

            <HabitForm
                control={control}
                remindersEnabled={remindersEnabled}
            />
        </div>
    )
}
