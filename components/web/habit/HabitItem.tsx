import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Clock, Flame, Check } from "lucide-react"
import { cn } from "@/lib/utils"

type Habit = {
    id: string
    title: string
    description?: string
    category: string
    icon: string
    color: string
    completed: boolean
    completionPercentage: number
    streak: number
    completedAt?: string
}

export function HabitItem({
    habit,
    onToggle,
}: {
    habit: Habit
    onToggle: (id: string, checked: boolean) => void
}) {
    return (
        <Card
            className={cn(
                "transition-all duration-300",
                habit.completed && "bg-primary/5 border-primary/40"
            )}
        >
            <CardContent className="flex gap-4 ">

                {/* Icon */}
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: habit.color }}
                >
                    {habit.icon}
                </div>

                <div className="flex-1 space-y-4">

                    {/* Top */}
                    <div className="flex justify-between">

                        <div>
                            <h3
                                className={cn(
                                    "text-sm md:text-base font-medium transition-all",
                                    habit.completed && "line-through opacity-70"
                                )}
                            >
                                {habit.title}
                            </h3>

                            {habit.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {habit.description}
                                </p>
                            )}
                        </div>

                        <Checkbox
                            checked={habit.completed}
                            onCheckedChange={(val) =>
                                onToggle(habit.id, val === true)
                            }
                            className="rounded-full w-8 h-8"
                        />
                    </div>

                    {/* Progress */}
                    <div className="space-y-1">
                        <div className="h-1.5 w-full rounded-full bg-muted">
                            <div
                                className="h-full rounded-full transition-all duration-500 ease-out"
                                style={{
                                    width: `${habit.completionPercentage}%`,
                                    backgroundColor: habit.completed
                                        ? "var(--primary)"
                                        : "var(--muted-foreground)",
                                }}
                            />
                        </div>

                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                                {habit.completionPercentage}% complete
                            </span>

                            {habit.completedAt && (
                                <div className="flex items-center gap-1">
                                    <Clock className="size-3" />
                                    <span>{habit.completedAt}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="flex justify-between items-center">
                        <Badge
                            variant="secondary"
                            className="flex items-center gap-1 transition-all"
                        >
                            <Flame className="size-3" />
                            {habit.streak} day streak
                        </Badge>

                        {habit.completed && (
                            <div className="flex items-center gap-1 text-primary text-xs animate-in fade-in duration-300">
                                <Check className="size-3" />
                                Completed
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
