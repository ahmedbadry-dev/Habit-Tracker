import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrophyIcon, TrendingUp } from "lucide-react"
import { ProgressRing } from "./ProgressRing"

import { api } from "@/convex/_generated/api"
import { fetchQuery } from "convex/nextjs"
import { getToken } from "@/lib/auth-server"

type Props = {
    todayKey: string
}

// Greeting
function getGreeting() {
    const hour = new Date().getHours()

    if (hour >= 5 && hour < 12) return "Good Morning"
    if (hour >= 12 && hour < 17) return "Good Afternoon"
    if (hour >= 17 && hour < 22) return "Good Evening"

    return "Good Night"
}

// First name only
function getFirstName(fullName?: string | null) {
    if (!fullName) return ""
    return fullName.split(" ")[0]
}

export default async function HeroSection({ todayKey }: Props) {
    const token = await getToken()

    const [overview, userName] = await Promise.all([
        fetchQuery(
            api.dashboard.getDailyOverview,
            { dateKey: todayKey },
            { token }
        ),
        fetchQuery(
            api.users.getCurrentUserName,
            {},
            { token }
        ),
    ])

    const firstName = getFirstName(userName)
    const greeting = getGreeting()

    const {
        dateLabel,
        totalHabits,
        completedHabits,
        completionPercentage,
        currentStreak,
    } = overview

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
      "
        >
            <CardHeader>
                <div className="flex flex-col-reverse gap-4 md:flex-row md:gap-0 md:justify-between md:items-center">
                    <h1 className="text-2xl lg:text-4xl font-medium tracking-tight">
                        {greeting}
                        {firstName ? `, ${firstName}` : ""}!
                    </h1>

                    <Badge
                        className=" self-end
              flex items-center gap-2
              px-4 py-2
              bg-primary/90 text-primary-foreground
              hover:bg-primary
              transition-all duration-200
            "
                    >
                        <TrophyIcon className="size-4" />
                        <span className="text-xs md:text-sm">
                            {currentStreak} Day Streak
                        </span>
                    </Badge>
                </div>

                <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="size-4" />
                    <span className="text-sm text-muted-foreground">
                        {dateLabel}
                    </span>
                </CardDescription>
            </CardHeader>

            <CardContent>
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
                        <ProgressRing percentage={completionPercentage} />

                        <div>
                            <p className="text-xl md:text-2xl font-medium">
                                {completedHabits} of {totalHabits} completed
                            </p>
                            <p className="text-muted-foreground">
                                {completionPercentage}% completed
                            </p>
                        </div>
                    </div>

                    <TrendingUp className="opacity-70" />
                </div>
            </CardContent>
        </Card>
    )
}
