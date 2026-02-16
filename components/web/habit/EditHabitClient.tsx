"use client"

import { usePreloadedQuery, Preloaded } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { habitSchema, THabitFormValues } from "@/schema/habitSchema"
import { HabitForm } from "@/components/web/habit/HabitForm"
import { Button, buttonVariants } from "@/components/ui/button"
import { Header } from "../header/Header"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

type Props = {
    preloadedHabit: Preloaded<typeof api.habits.getHabitById>
}

export default function EditHabitClient({ preloadedHabit }: Props) {
    const router = useRouter()
    const habit = usePreloadedQuery(preloadedHabit)
    const updateHabit = useMutation(api.habits.updateHabit)

    const { control, handleSubmit, watch } = useForm<THabitFormValues>({
        resolver: zodResolver(habitSchema),
        defaultValues: {
            title: habit.title,
            description: habit.description ?? "",
            category: habit.category as THabitFormValues["category"],
            icon: habit.icon as THabitFormValues["icon"],
            color: habit.color as THabitFormValues["color"],
            frequency: habit.frequency,
            target: habit.target,
            unit: habit.unit as THabitFormValues["unit"],
            reminders: habit.reminders,
        }
    })

    const remindersEnabled = watch("reminders.enabled")

    const onSubmit = async (data: THabitFormValues) => {
        await updateHabit({
            habitId: habit._id,
            ...data,
        })

        router.push("/")
    }

    return (
        <div className="p-4 space-y-6">
            <Header>
                <div className="flex gap-6 items-center">
                    <Link
                        href="/"
                        className={buttonVariants({ variant: "outline" })}
                    >
                        <ArrowLeft className="size-4" />
                    </Link>

                    <div className="relative">
                        <p className="text-2xl font-medium">Edit Habit</p>
                        <span className="absolute w-[50%] h-1 bg-primary -bottom-2 rounded"></span>
                    </div>
                </div>

                <Button type="submit" onClick={handleSubmit(onSubmit)}>
                    Save Changes
                </Button>
            </Header>
            <HabitForm control={control} remindersEnabled={remindersEnabled} />


        </div>
    )
}
