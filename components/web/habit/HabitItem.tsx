import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Clock, Flame, Check, Target, Plus, Minus, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { Id } from "@/convex/_generated/dataModel"
import { CATEGORY_CONFIG } from "@/app/(habitTracker)/add-habit/page"
import { Separator } from "@/components/ui/separator"
import { formatTime } from "@/utils/formatDate"
import CelebrationBurst from "@/components/layout/CelebrationBurst"
import HabitItemClient from "./HabitItemClient"

type Habit = {
    id: Id<"habits">
    title: string
    description?: string
    category: string
    icon: string
    color: string
    frequency: "daily" | "weekly"
    target?: number
    unit: string

    completed: boolean
    valueCompleted?: number
    completionPercentage: number

    todayValue?: number
    weekStart?: string
    weekEnd?: string

    streak: number
    completedAt?: string
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n))
}

function isWeeklyNumeric(h: Habit) {
    return h.frequency === "weekly" && typeof h.target === "number" && h.target > 0
}

export function HabitItem({
    habit,
    onToggle,
    onWeeklyChange,
}: {
    habit: Habit
    onToggle: (id: Id<"habits">, checked: boolean) => void
    onWeeklyChange: (id: Id<"habits">, delta: number) => void
}) {
    const weeklyNumeric = isWeeklyNumeric(habit)

    const weekSum = habit.valueCompleted ?? 0
    const target = habit.target ?? 0

    const pct = weeklyNumeric
        ? target > 0
            ? clamp(Math.round((weekSum / target) * 100), 0, 100)
            : 0
        : habit.completionPercentage

    const categoryMeta =
        CATEGORY_CONFIG[habit.category as keyof typeof CATEGORY_CONFIG]

    return (
        <>

            <Card
                className={cn(
                    "transition-all duration-300 border",
                    habit.completed &&
                    !weeklyNumeric &&
                    "bg-primary/5 border-primary/40 scale-[1.01]"
                )}
            >
                {/* desktop and tablet */}
                <CardContent className="hidden md:flex gap-4 ">
                    {/* Icon */}
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                        style={{ background: categoryMeta?.color ?? habit.color }}
                    >
                        {categoryMeta?.icon ?? habit.icon}
                    </div>

                    <div className="flex-1 space-y-4">
                        {/* Top */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h3
                                    className={cn(
                                        "text-sm md:text-base font-medium transition-all duration-300",
                                        habit.completed &&
                                        !weeklyNumeric &&
                                        "line-through opacity-70"
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

                            <div className="flex items-center gap-2">
                                {weeklyNumeric ? (
                                    <>
                                        <button
                                            onClick={() => onWeeklyChange(habit.id, -1)}
                                            disabled={habit.todayValue === 0}
                                            className="p-2 rounded-full border hover:bg-muted transition disabled:opacity-40"
                                        >
                                            <Minus className="size-4" />
                                        </button>

                                        <Badge
                                            variant="secondary"
                                            className="gap-2 px-3 py-2 select-none"
                                            title={`Week: ${habit.weekStart ?? ""} â†’ ${habit.weekEnd ?? ""
                                                }`}
                                        >
                                            <Target className="size-4" />
                                            <span className="text-xs md:text-sm">
                                                {weekSum}/{target}
                                            </span>
                                        </Badge>

                                        <button
                                            onClick={() => onWeeklyChange(habit.id, +1)}
                                            disabled={weekSum >= target}
                                            className="p-2 rounded-full border hover:bg-muted transition disabled:opacity-40"
                                        >
                                            <Plus className="size-4" />
                                        </button>
                                    </>
                                ) : (
                                    <Checkbox
                                        checked={habit.completed}
                                        onCheckedChange={(val) =>
                                            onToggle(habit.id, val === true)
                                        }
                                        className="rounded-full w-8 h-8"
                                    />
                                )}

                                {/* âœڈï¸ڈ Subtle Edit Button */}
                                <Link
                                    href={`/habits/${habit.id}/edit`}
                                    className="p-2 rounded-full border border-transparent hover:border-border hover:bg-muted/50 transition"
                                >
                                    <Pencil className="size-4 text-muted-foreground" />
                                </Link>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="space-y-1">
                            <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
                                <div
                                    className={cn(
                                        "absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out",
                                        weeklyNumeric
                                            ? "bg-primary"
                                            : habit.completed
                                                ? "bg-primary"
                                                : "bg-muted-foreground"
                                    )}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>

                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>
                                    {weeklyNumeric
                                        ? `${pct}% of weekly target`
                                        : `${habit.completionPercentage}% complete`}
                                </span>

                                {habit.completedAt && !weeklyNumeric && (
                                    <div className="flex items-center gap-1 animate-in fade-in duration-300">
                                        <Clock className="size-3" />
                                        <span>{formatTime(habit.completedAt)}</span>
                                    </div>
                                )}
                            </div>

                            {weeklyNumeric && habit.todayValue !== undefined && (
                                <p className="text-[11px] text-muted-foreground">
                                    Today: {habit.todayValue} {habit.unit}
                                </p>
                            )}
                        </div>

                        {/* Bottom */}
                        <div className="flex justify-between items-center">
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <Flame className="size-3" />
                                {habit.streak}{" "}
                                {habit.frequency === "weekly" ? "week" : "day"} streak
                            </Badge>

                            {habit.completed && !weeklyNumeric && (
                                <div className="flex items-center gap-1 text-primary text-xs animate-in zoom-in-50 duration-300">
                                    <Check className="size-3" />
                                    Completed
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>


                {/* desktop and tablet */}
                <CardContent className="flex flex-col gap-4 md:hidden">
                    {/* Icon */}
                    <div className="flex justify-between">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                            style={{ background: categoryMeta?.color ?? habit.color }}
                        >
                            {categoryMeta?.icon ?? habit.icon}
                        </div>

                        <div className="flex items-center gap-2">
                            {weeklyNumeric ? (
                                <>
                                    <button
                                        onClick={() => onWeeklyChange(habit.id, -1)}
                                        disabled={habit.todayValue === 0}
                                        className="p-2 rounded-full border hover:bg-muted transition disabled:opacity-40"
                                    >
                                        <Minus className="size-4" />
                                    </button>

                                    <Badge
                                        variant="secondary"
                                        className="gap-2 px-3 py-2 select-none"
                                        title={`Week: ${habit.weekStart ?? ""} â†’ ${habit.weekEnd ?? ""
                                            }`}
                                    >
                                        <Target className="size-4" />
                                        <span className="text-xs md:text-sm">
                                            {weekSum}/{target}
                                        </span>
                                    </Badge>

                                    <button
                                        onClick={() => onWeeklyChange(habit.id, +1)}
                                        disabled={weekSum >= target}
                                        className="p-2 rounded-full border hover:bg-muted transition disabled:opacity-40"
                                    >
                                        <Plus className="size-4" />
                                    </button>
                                </>
                            ) : (
                                <Checkbox
                                    checked={habit.completed}
                                    onCheckedChange={(val) =>
                                        onToggle(habit.id, val === true)
                                    }
                                    className="rounded-full w-8 h-8"
                                />
                            )}

                            {/* âœڈï¸ڈ Subtle Edit Button */}
                            <Link
                                href={`/habits/${habit.id}/edit`}
                                className="p-2 rounded-full border border-transparent hover:border-border hover:bg-muted/50 transition"
                            >
                                <Pencil className="size-4 text-muted-foreground" />
                            </Link>
                        </div>
                    </div>

                    <Separator orientation="horizontal" />
                    <div className="flex-1 space-y-4">
                        {/* Top */}
                        <div className="flex justify-between items-start">
                            <div className="min-w-0">
                                <h3
                                    className={cn(
                                        "text-lg font-medium transition-all duration-300  truncate ",
                                        habit.completed &&
                                        !weeklyNumeric &&
                                        "line-through opacity-70"

                                    )}
                                >
                                    {habit.title}
                                </h3>

                                {habit.description && (
                                    <p className="text-sm text-muted-foreground mt-1 truncate">
                                        {habit.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="space-y-1">
                            <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
                                <div
                                    className={cn(
                                        "absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out",
                                        weeklyNumeric
                                            ? "bg-primary"
                                            : habit.completed
                                                ? "bg-primary"
                                                : "bg-muted-foreground"
                                    )}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>

                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>
                                    {weeklyNumeric
                                        ? `${pct}% of weekly target`
                                        : `${habit.completionPercentage}% complete`}
                                </span>

                                {habit.completedAt && !weeklyNumeric && (
                                    <div className="flex items-center gap-1 animate-in fade-in duration-300">
                                        <Clock className="size-3" />
                                        <span>{formatTime(habit.completedAt)}</span>
                                    </div>
                                )}
                            </div>

                            {weeklyNumeric && habit.todayValue !== undefined && (
                                <p className="text-[11px] text-muted-foreground">
                                    Today: {habit.todayValue} {habit.unit}
                                </p>
                            )}
                        </div>

                        {/* Bottom */}
                        <div className="flex justify-between items-center">
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <Flame className="size-3" />
                                {habit.streak}{" "}
                                {habit.frequency === "weekly" ? "week" : "day"} streak
                            </Badge>

                            {habit.completed && !weeklyNumeric && (
                                <div className="flex items-center gap-1 text-primary text-xs animate-in zoom-in-50 duration-300">
                                    <Check className="size-3" />
                                    Completed
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
