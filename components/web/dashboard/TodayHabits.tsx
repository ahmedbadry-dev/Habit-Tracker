import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function TodayHabits() {
    return (
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Today Habits</h2>

            <Link href="/add-habit">
                <Button size="sm" className="flex items-center gap-2">
                    <Plus className="size-4" />
                    Add Habit
                </Button>
            </Link>
        </div>
    )
}
