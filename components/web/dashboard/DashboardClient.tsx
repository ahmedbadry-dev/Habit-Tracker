"use client"

import { useState } from "react"
import { HabitItem } from "@/components/web/habit/HabitItem"
import { Habit } from "@/types/habit/habit"

export default function DashboardClient({
    initialHabits,
}: {
    initialHabits: Habit[]
}) {
    const [habits, setHabits] = useState(initialHabits)

    const toggleHabit = (id: string, checked: boolean) => {
        setHabits((prev) =>
            prev.map((h) =>
                h.id === id
                    ? {
                        ...h,
                        completed: checked,
                        completionPercentage: checked ? 100 : 50,
                        streak: checked ? h.streak + 1 : h.streak - 1,
                    }
                    : h
            )
        )
    }

    return (
        <div className="space-y-6">
            {habits.map((habit) => (
                <HabitItem
                    key={habit.id}
                    habit={habit}
                    onToggle={toggleHabit}
                />
            ))}
        </div>
    )
}
