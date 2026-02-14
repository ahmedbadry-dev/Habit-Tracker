"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { HabitItem } from "@/components/web/habit/HabitItem"
import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Id } from "@/convex/_generated/dataModel"

export default function DashboardClient({
    todayKey,
}: {
    todayKey: string
}) {
    /* ------------------ Sync User Once ------------------ */
    const syncUser = useMutation(api.users.syncUser)

    useEffect(() => {
        syncUser().catch(() => { })
    }, [syncUser])

    /* ------------------ Query ------------------ */
    const habits = useQuery(
        api.habits.getTodayHabits,
        todayKey ? { dateKey: todayKey } : "skip"
    )

    /* ------------------ Mutation ------------------ */
    const toggleHabitMutation = useMutation(api.habits.toggleHabit)

    const toggleHabit = toggleHabitMutation.withOptimisticUpdate(
        (localStore, args) => {
            const current = localStore.getQuery(
                api.habits.getTodayHabits,
                { dateKey: todayKey }
            )

            if (!current) return

            localStore.setQuery(
                api.habits.getTodayHabits,
                { dateKey: todayKey },
                current.map((h) => {
                    if (h.id !== args.habitId) return h

                    const isNumeric =
                        typeof h.target === "number" && h.target > 0

                    const nextCompleted = !h.completed

                    return {
                        ...h,
                        completed: nextCompleted,

                        completionPercentage: isNumeric
                            ? args.valueCompleted !== undefined
                                ? Math.min(
                                    100,
                                    Math.round(
                                        (args.valueCompleted / (h.target ?? 1)) * 100
                                    )
                                )
                                : h.completionPercentage
                            : nextCompleted
                                ? 100
                                : 0
                        // 🚫 مفيش لعب في streak
                    }
                })
            )

        }
    )

    /* ------------------ UI States ------------------ */
    if (!habits) {
        return <div>Loading...</div>
    }

    if (habits.length === 0) {
        return (
            <Card
                className="
        flex justify-center items-center
        min-h-40 text-2xl
        bg-linear-to-br
        from-background
        via-background
        to-muted/20
        border-border/40
        shadow-sm
        animate-in fade-in duration-500
      "
            >
                No habits yet
            </Card>
        )
    }

    /* ------------------ Toggle Handler ------------------ */
    const handleToggle = async (
        id: Id<"habits">,
        checked: boolean
    ) => {
        const habit = habits.find((h) => h.id === id)
        if (!habit) return

        const isNumeric =
            typeof habit.target === "number" && habit.target > 0

        await toggleHabit({
            habitId: id,
            dateKey: todayKey,
            ...(isNumeric
                ? { valueCompleted: checked ? habit.target : 0 }
                : { completed: checked }),
        })
    }

    /* ------------------ Render ------------------ */
    return (
        <div className="space-y-6">
            {habits.map((habit) => (
                <HabitItem
                    key={habit.id}
                    habit={habit}
                    onToggle={handleToggle}
                />
            ))}
        </div>
    )
}
