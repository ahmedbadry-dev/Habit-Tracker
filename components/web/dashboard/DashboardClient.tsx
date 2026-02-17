"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { HabitItem } from "@/components/web/habit/HabitItem"
import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Id } from "@/convex/_generated/dataModel"
import { Loader2 } from "lucide-react"
import { useConvexAuth } from "convex/react"

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n))
}

export default function DashboardClient({
    todayKey: _todayKey,
}: {
    todayKey: string
}) {
    const { isAuthenticated, isLoading } = useConvexAuth()

    const habits = useQuery(
        api.habits.getTodayHabits,
        isAuthenticated ? {} : "skip"
    )

    /* ---------------------------- */
    /* Mutations */
    /* ---------------------------- */

    const toggleHabit = useMutation(
        api.habits.toggleHabit
    ).withOptimisticUpdate((localStore, args) => {
        const current = localStore.getQuery(api.habits.getTodayHabits, {})

        if (!current) return

        localStore.setQuery(
            api.habits.getTodayHabits,
            {},
            current.map((h) => {
                if (h.id !== args.habitId) return h

                const nextCompleted =
                    typeof args.completed === "boolean"
                        ? args.completed
                        : !h.completed

                return {
                    ...h,
                    completed: nextCompleted,
                    completionPercentage: nextCompleted ? 100 : 0,
                }
            })
        )
    })



    const bumpHabitProgress = useMutation(
        api.habits.bumpHabitProgress
    ).withOptimisticUpdate((localStore, args) => {
        const current = localStore.getQuery(api.habits.getTodayHabits, {})

        if (!current) return

        localStore.setQuery(
            api.habits.getTodayHabits,
            {},
            current.map((h) => {
                if (h.id !== args.habitId) return h

                const prevToday = h.todayValue ?? 0
                const prevWeekSum = h.valueCompleted ?? 0

                const newToday = Math.max(0, prevToday + args.delta)
                const newWeekSum = Math.max(
                    0,
                    prevWeekSum + args.delta
                )

                const pct =
                    typeof h.target === "number" && h.target > 0
                        ? clamp(
                            Math.round((newWeekSum / h.target) * 100),
                            0,
                            100
                        )
                        : 0


                return {
                    ...h,
                    todayValue: newToday,
                    valueCompleted: newWeekSum,
                    completionPercentage: pct,
                    completed:
                        typeof h.target === "number"
                            ? newWeekSum >= h.target
                            : false,
                }
            })
        )
    })

    /* ---------------------------- */
    /* Loading & Empty */
    /* ---------------------------- */

    if (isLoading || (isAuthenticated && !habits)) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <Loader2 className="size-4 text-primary animate-spin" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <Card className="p-6 text-sm text-muted-foreground">
                Sign in to view and manage your habits.
            </Card>
        )
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

    /* ---------------------------- */
    /* Handlers */
    /* ---------------------------- */

    // ✅ Boolean habits
    const handleToggle = async (
        id: Id<"habits">,
        checked: boolean
    ) => {
        await toggleHabit({
            habitId: id,
            completed: checked,
        })
    }


    // ✅ Weekly + / − handler
    const handleWeeklyChange = async (
        id: Id<"habits">,
        delta: number
    ) => {
        const current = habits.find((h) => h.id === id)
        if (!current) return

        const target =
            typeof current.target === "number" ? current.target : 0

        if (target <= 0) return

        const todayValue = current.todayValue ?? 0
        const weekSum = current.valueCompleted ?? 0

        // 🚫 منع الزيادة فوق target
        if (delta > 0 && weekSum >= target) return

        // 🚫 منع النزول تحت صفر
        if (delta < 0 && todayValue <= 0) return

        await bumpHabitProgress({
            habitId: id,
            delta,
        })
    }

    const dailyHabits = habits.filter((habit) => habit.frequency === "daily")
    const weeklyHabits = habits.filter((habit) => habit.frequency === "weekly")

    /* ---------------------------- */
    /* Render */
    /* ---------------------------- */

    return (
        <div className="space-y-6">
            <section className="space-y-3">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Daily Habits
                </h2>
                {dailyHabits.length === 0 ? (
                    <Card className="p-4 text-sm text-muted-foreground">
                        No daily habits
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {dailyHabits.map((habit) => (
                            <HabitItem
                                key={habit.id}
                                habit={habit}
                                onToggle={handleToggle}
                                onWeeklyChange={handleWeeklyChange}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className="space-y-3">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Weekly Habits
                </h2>
                {weeklyHabits.length === 0 ? (
                    <Card className="p-4 text-sm text-muted-foreground">
                        No weekly habits
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {weeklyHabits.map((habit) => (
                            <HabitItem
                                key={habit.id}
                                habit={habit}
                                onToggle={handleToggle}
                                onWeeklyChange={handleWeeklyChange}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
