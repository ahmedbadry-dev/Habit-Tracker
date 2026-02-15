"use client"

import { usePreloadedQuery, Preloaded } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { habitSchema, THabitFormValues } from "@/schema/habitSchema"
import { HabitForm } from "@/components/web/habit/HabitForm"
import { Button } from "@/components/ui/button"

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
            <HabitForm control={control} remindersEnabled={remindersEnabled} />

            <Button onClick={handleSubmit(onSubmit)}>
                Save Changes
            </Button>
        </div>
    )
}
