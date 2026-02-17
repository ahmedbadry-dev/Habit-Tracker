"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrophyIcon, TrendingUp, Flame, Repeat } from "lucide-react"
import { ProgressRing } from "./ProgressRing"

import { api } from "@/convex/_generated/api"
import { Preloaded, usePreloadedQuery } from "convex/react"
import { useEffect, useMemo, useState } from "react"

/* ------------------ Helpers ------------------ */

function getGreeting() {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return "Good Morning"
    if (hour >= 12 && hour < 17) return "Good Afternoon"
    if (hour >= 17 && hour < 22) return "Good Evening"
    return "Good Night"
}

function getFirstName(fullName?: string | null) {
    if (!fullName) return ""
    return fullName.split(" ")[0]
}

function getMotivation(streak: number, percentage: number) {
    if (streak >= 7) return "🔥 You're on fire! Keep the momentum going."
    if (percentage === 100) return "🚀 Perfect day! Outstanding discipline."
    if (percentage >= 70) return "💪 Strong progress! Keep pushing."
    if (percentage > 0) return "🌱 Great start. Keep building the habit."
    return "⚡ Fresh start. Today is yours."
}

// smooth number animation
function useAnimatedNumber(value: number, duration = 450) {
    const [display, setDisplay] = useState(value)

    useEffect(() => {
        const start = display
        const end = value
        if (start === end) return

        const startTime = performance.now()

        let raf = 0
        const tick = (t: number) => {
            const p = Math.min(1, (t - startTime) / duration)
            const next = Math.round(start + (end - start) * p)
            setDisplay(next)
            if (p < 1) raf = requestAnimationFrame(tick)
        }

        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return display
}

/* ------------------ Props ------------------ */

type Props = {
    preloadedOverview: Preloaded<typeof api.dashboard.getDailyOverview>
    preloadedUserName: Preloaded<typeof api.users.getCurrentUserName>
}

/* ------------------ Component ------------------ */

export default function HeroSection({
    preloadedOverview,
    preloadedUserName,
}: Props) {
    const overview = usePreloadedQuery(preloadedOverview)
    const userName = usePreloadedQuery(preloadedUserName)

    const firstName = getFirstName(userName)
    const greeting = getGreeting()

    const motivation = useMemo(() => {
        return getMotivation(overview.daily.perfectStreak, overview.overall.percentage)
    }, [overview.daily.perfectStreak, overview.overall.percentage])

    // Animated values
    const overallPct = useAnimatedNumber(overview.overall.percentage)
    const overallCompleted = useAnimatedNumber(overview.overall.completed)
    const overallTotal = useAnimatedNumber(overview.overall.total)

    const dailyPerfect = useAnimatedNumber(overview.daily.perfectStreak)
    const weeklyPct = useAnimatedNumber(overview.weekly.percentage)

    const bestStreakValue = useAnimatedNumber(overview.bestStreak?.value ?? 0)

    const bestStreakLabel =
        overview.bestStreak && overview.bestStreak.value > 0
            ? `${bestStreakValue} ${overview.bestStreak.unit === "week" ? "Week" : "Day"} Streak`
            : "No streak yet"

    return (
        <Card
            className="

        bg-linear-to-br
        from-background
        via-background
        to-muted/20
        border-border/40
        shadow-sm
        animate-in fade-in duration-500
        gap-2
      "
        >
            <CardHeader>
                <div className="flex flex-col-reverse gap-4 md:flex-row md:gap-0 md:justify-between md:items-start md:mb-4">
                    <div className="space-y-3 w-full">
                        <h1 className="text-2xl lg:text-4xl font-medium tracking-tight">
                            {greeting}
                            {firstName ? `, ${firstName}` : ""}!
                        </h1>

                        <CardDescription className="w-full flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <p className="text-base md:text-lg lg:text-xl text-primary/80">
                                {motivation}
                            </p>

                            <div className="flex items-center gap-2 self-start md:self-auto">
                                <Calendar className="size-4" />
                                <span className="text-sm text-muted-foreground">
                                    {overview.dateLabel}
                                </span>
                            </div>
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Separate badges */}
                <div className="flex flex-col gap-2 justify-end ">
                    <div className="flex">
                        <Badge
                            className="
                                flex-1
                                flex items-center gap-2
                                px-4 py-2
                                bg-primary/90 text-primary-foreground
                                hover:bg-primary
                                transition-all duration-200
                                    "
                        >
                            <TrophyIcon className="size-4" />
                            <span className="text-xs md:text-sm">
                                {dailyPerfect} Perfect Days
                            </span>
                        </Badge>

                    </div>
                    <div className="flex">
                        <Badge
                            variant="secondary"
                            className="flex items-center gap-2 px-4 py-2 flex-1"
                            title={overview.bestStreak?.title ?? undefined}
                        >
                            <Flame className="size-4" />
                            <span className="text-xs md:text-sm">
                                {bestStreakLabel}
                            </span>
                        </Badge>

                        <Badge
                            variant="outline"
                            className="flex items-center gap-2 px-4 py-2 flex-1"
                        >
                            <Repeat className="size-4" />
                            <span className="text-xs md:text-sm">
                                Weekly {weeklyPct}%
                            </span>
                        </Badge>
                    </div>
                </div>

                {/* Main overall */}
                <div
                    className="
            flex justify-between items-center
            p-6
            rounded-2xl
            bg-muted/30
            backdrop-blur-sm
            border border-border/40
            transition-all duration-300
            hover:bg-muted/40
          "
                >
                    <div className="flex gap-6 items-center">
                        <ProgressRing percentage={overallPct} />

                        <div>
                            <p className="text-base md:text-2xl font-medium">
                                {overallCompleted} of {overallTotal} completed
                            </p>
                            <p className="text-xs md:text-base text-muted-foreground">
                                {overallPct}% completed
                            </p>
                        </div>
                    </div>

                    <TrendingUp className="opacity-70 hidden md:block" />
                </div>

                {/* Weekly progress bar inside hero */}
                {overview.weekly.total > 0 && (
                    <div className="rounded-2xl border border-border/40 bg-muted/20 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium">
                                Weekly progress
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {overview.weekly.completed} / {overview.weekly.total} habits
                            </p>
                        </div>

                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div
                                className="h-full rounded-full transition-[width] duration-500 ease-out"
                                style={{ width: `${weeklyPct}%`, backgroundColor: "var(--primary)" }}
                            />
                        </div>

                        <p className="mt-2 text-xs text-muted-foreground">
                            Week starts: {overview.weekly.weekStart}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
