'use client'

import { Button, buttonVariants } from "@/components/ui/button"
import {
    ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { HabitForm } from "@/components/web/habit/HabitForm"
import { SubmitHandler, useForm } from "react-hook-form"
import { habitSchema, THabitFormValues } from "@/schema/habitSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Header } from "@/components/web/header/Header"


export const CATEGORY_CONFIG = {
    health: {
        label: "Health",
        icon: "🧬",
        color: "linear-gradient(135deg,#22c55e,#16a34a)",
    },
    mindfulness: {
        label: "Mindfulness",
        icon: "🧠",
        color: "linear-gradient(135deg,#a855f7,#7c3aed)",
    },
    learning: {
        label: "Learning",
        icon: "📚",
        color: "linear-gradient(135deg,#3b82f6,#2563eb)",
    },
    productivity: {
        label: "Productivity",
        icon: "🔥",
        color: "linear-gradient(135deg,#f97316,#ea580c)",
    },
    creativity: {
        label: "Creativity",
        icon: "🎨",
        color: "linear-gradient(135deg,#ec4899,#8b5cf6)",
    },
    social: {
        label: "Social",
        icon: "👥",
        color: "linear-gradient(135deg,#eab308,#ca8a04)",
    },
} as const




const AddHabit = () => {
    const { control, handleSubmit, watch } = useForm<THabitFormValues>({
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
            }
        }
    })

    const remindersEnabled = watch("reminders.enabled")

    const onSubmit: SubmitHandler<THabitFormValues> = (data) => {
        const payload = {
            ...data,
            target: data.target ?? 1,
        }
        console.log(payload);
    }
    return (
        <div className="p-4 space-y-4 ">
            {/* header */}
            <Header>
                <div className="flex gap-6 items-center">
                    <div>
                        <Link href={'/'} className={buttonVariants({ variant: "outline" })}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </div>
                    <div className="relative">
                        <p className="text-2xl font-medium">New Habit</p>
                        <span className="absolute w-[50%] h-1 bg-primary -bottom-2 rounded"></span>
                    </div>
                </div>
                {/* submit btn */}
                <Button type="submit" onClick={handleSubmit(onSubmit)}>Create</Button>
            </Header>
            <HabitForm control={control} remindersEnabled={remindersEnabled} />
        </div >
    )
}

export default AddHabit
