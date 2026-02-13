"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { HabitItem } from "@/components/web/habit/HabitItem"
import { useEffect } from "react"
import { Card } from "@/components/ui/card"

export default function DashboardClient({
    todayKey,
}: {
    todayKey: string
}) {

    const syncUser = useMutation(api.users.syncUser)
    useEffect(() => {
        let mounted = true

        if (mounted) {
            syncUser().catch(() => { })
        }

        return () => {
            mounted = false
        }
    }, [])



    const habits = useQuery(
        api.habits.getTodayHabits,
        todayKey ? { dateKey: todayKey } : "skip"
    )

    if (!habits) {
        return <div>Loading...</div>
    }

    if (habits.length === 0) {
        return <Card
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
        >No habits yet</Card>
    }

    const toggleHabit = useMutation(api.habits.toggleHabit).withOptimisticUpdate(
        (localStore, args) => {
            const current = localStore.getQuery(
                api.habits.getTodayHabits,
                { dateKey: todayKey }
            )

            if (!current) return

            localStore.setQuery(
                api.habits.getTodayHabits,
                { dateKey: todayKey },
                current.map((h) =>
                    h.id === args.habitId
                        ? {
                            ...h,
                            completed: !h.completed,
                            completionPercentage: !h.completed ? 100 : 0,
                            streak: !h.completed
                                ? h.streak + 1
                                : Math.max(0, h.streak - 1),
                        }
                        : h
                )
            )
        }
    )

    const handleToggle = (id: string) => {
        toggleHabit({
            habitId: id as any,
            dateKey: todayKey,
        })
    }


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
