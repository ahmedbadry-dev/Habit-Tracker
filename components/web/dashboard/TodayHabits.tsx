"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useAuthGuard } from "@/hooks/useAuthGuard"

export default function TodayHabits() {
    const { requireAuth } = useAuthGuard()

    return (
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Today Habits</h2>

            <Link
                href="/add-habit"
                onClick={(e) => {
                    const allowed = requireAuth()
                    if (!allowed) e.preventDefault()
                }}
            >
                <Button size="sm" className="flex items-center gap-2">
                    <Plus className="size-4" />
                    Add Habit
                </Button>
            </Link>
        </div>
    )
}
