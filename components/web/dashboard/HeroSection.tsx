"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Calendar,
    TrophyIcon,
    TrendingUp,
    Flame,
    Repeat,
    Lock,
} from "lucide-react"
import { ProgressRing } from "./ProgressRing"

import { api } from "@/convex/_generated/api"
import { Preloaded, usePreloadedQuery } from "convex/react"
import { useEffect, useMemo, useState } from "react"
import { useAuthGuard } from "@/hooks/useAuthGuard"

/* ------------------ Helpers ------------------ */

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

type HeroOverview = {
    dateLabel: string
    overall: {
        total: number
        completed: number
        percentage: number
    }
    daily: {
        perfectStreak: number
    }
    weekly: {
        total: number
        completed: number
        percentage: number
        weekStart: string
    }
    bestStreak: {
        title: string
        value: number
        unit: "day" | "week"
    } | null
}

function useAnimatedNumber(
    value: number,
    opts?: { duration?: number; fromZero?: boolean; enabled?: boolean }
) {
    const duration = opts?.duration ?? 450
    const enabled = opts?.enabled ?? true
    const fromZero = opts?.fromZero ?? false
    const [display, setDisplay] = useState(fromZero ? 0 : value)

    useEffect(() => {
        if (!enabled) {
            setDisplay(value)
            return
        }

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

function useAnimateOncePerSession(key: string) {
    const [enabled, setEnabled] = useState(false)

    useEffect(() => {
        const already = window.sessionStorage.getItem(key)
        if (already) return
        window.sessionStorage.setItem(key, "1")
        setEnabled(true)
    }, [key])

    return enabled
}

/* ------------------ Props ------------------ */

type AuthProps = {
    mode: "auth"
    preloadedOverview: Preloaded<typeof api.dashboard.getDailyOverview>
    preloadedUserName: Preloaded<typeof api.users.getCurrentUserName>
}

type GuestProps = {
    mode: "guest"
}

type Props = AuthProps | GuestProps

/* ------------------ Component ------------------ */

const GUEST_OVERVIEW: HeroOverview = {
    dateLabel: "Today",
    overall: {
        total: 8,
        completed: 5,
        percentage: 68,
    },
    daily: {
        perfectStreak: 7,
    },
    weekly: {
        total: 5,
        completed: 3,
        percentage: 60,
        weekStart: "Monday",
    },
    bestStreak: {
        title: "Morning Workout",
        value: 7,
        unit: "day",
    },
}

export default function HeroSection(props: Props) {
    if (props.mode === "guest") {
        return <HeroContent mode="guest" overview={GUEST_OVERVIEW} userName={null} />
    }

    return (
        <AuthHeroContent
            preloadedOverview={props.preloadedOverview}
            preloadedUserName={props.preloadedUserName}
        />
    )
}

function AuthHeroContent({
    preloadedOverview,
    preloadedUserName,
}: {
    preloadedOverview: Preloaded<typeof api.dashboard.getDailyOverview>
    preloadedUserName: Preloaded<typeof api.users.getCurrentUserName>
}) {
    const overview = usePreloadedQuery(preloadedOverview)
    const userName = usePreloadedQuery(preloadedUserName)

    return (
        <HeroContent mode="auth" overview={overview} userName={userName} />
    )
}

function HeroContent({
    mode,
    overview,
    userName,
}: {
    mode: "auth" | "guest"
    overview: HeroOverview
    userName: string | null
}) {
    const isGuest = mode === "guest"
    const { requireAuth } = useAuthGuard()
    const animateGuest = useAnimateOncePerSession("hero-guest-animation")

    const firstName = getFirstName(userName)
    const greeting = "Welcome"

    const motivation = useMemo(() => {
        return getMotivation(overview.daily.perfectStreak, overview.overall.percentage)
    }, [overview.daily.perfectStreak, overview.overall.percentage])

    // Animated values
    const overallPct = useAnimatedNumber(overview.overall.percentage, {
        fromZero: isGuest && animateGuest,
        enabled: true,
    })
    const overallCompleted = useAnimatedNumber(overview.overall.completed, {
        fromZero: isGuest && animateGuest,
        enabled: true,
    })
    const overallTotal = useAnimatedNumber(overview.overall.total)

    const dailyPerfect = useAnimatedNumber(overview.daily.perfectStreak, {
        duration: 850,
        fromZero: isGuest && animateGuest,
        enabled: true,
    })
    const weeklyPct = useAnimatedNumber(overview.weekly.percentage, {
        fromZero: isGuest && animateGuest,
        enabled: true,
    })

    const bestStreakValue = useAnimatedNumber(overview.bestStreak?.value ?? 0)

    const bestStreakLabel =
        overview.bestStreak && overview.bestStreak.value > 0
            ? `${bestStreakValue} ${overview.bestStreak.unit === "week" ? "Week" : "Day"} Streak`
            : "No streak yet"

    const guestGuard = () => {
        if (!isGuest) return
        requireAuth(() => {
            if (typeof window !== "undefined") {
                window.dispatchEvent(
                    new CustomEvent("guest-hero-cta-click", {
                        detail: { section: "hero" },
                    })
                )
            }
        })
    }

    return (
        <Card
            className="
        relative overflow-hidden

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
            {isGuest && (
                <>
                    <Badge
                        variant="secondary"
                        className="absolute top-4 right-4 z-20 flex items-center gap-1"
                    >
                        <Lock className="size-3" />
                        Preview Mode
                    </Badge>
                    <div className="absolute inset-0 z-10 pointer-events-none rounded-xl bg-background/45 backdrop-blur-[1.5px]" />
                </>
            )}
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
                <div
                    className={`relative z-20 flex flex-col gap-2 justify-end ${isGuest ? "cursor-pointer transition-transform duration-200 hover:scale-[1.02]" : ""
                        }`}
                    onClick={guestGuard}
                >
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
                    <div className="flex gap-2">
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
                    onClick={guestGuard}
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
                    <div
                        className={`rounded-2xl border border-border/40 bg-muted/20 p-4 relative overflow-hidden ${isGuest ? "cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]" : ""
                            }`}
                        onClick={guestGuard}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium">
                                Weekly progress
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {overview.weekly.completed} / {overview.weekly.total} habits
                            </p>
                        </div>

                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden relative">
                            <div
                                className="h-full rounded-full transition-[width] duration-500 ease-out"
                                style={{ width: `${weeklyPct}%`, backgroundColor: "var(--primary)" }}
                            />
                            {isGuest && (
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                            )}
                        </div>

                        <p className="mt-2 text-xs text-muted-foreground">
                            Week starts: {overview.weekly.weekStart}
                        </p>
                    </div>
                )}

                {isGuest && (
                    <div className="relative z-20 rounded-2xl border border-border/50 bg-card/70 p-4 md:p-5">
                        <p className="text-sm md:text-base font-medium">
                            Unlock full habit tracking 🚀
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1">
                            Create an account to save progress & build streaks.
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                            <Button
                                onClick={() => {
                                    requireAuth()
                                    if (typeof window !== "undefined") {
                                        window.dispatchEvent(
                                            new CustomEvent("guest-hero-cta-click", {
                                                detail: { cta: "sign-up" },
                                            })
                                        )
                                    }
                                }}
                            >
                                Sign Up
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    requireAuth()
                                    if (typeof window !== "undefined") {
                                        window.dispatchEvent(
                                            new CustomEvent("guest-hero-cta-click", {
                                                detail: { cta: "sign-in" },
                                            })
                                        )
                                    }
                                }}
                            >
                                Sign In
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
