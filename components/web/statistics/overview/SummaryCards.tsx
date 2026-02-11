import SummaryCard from "./SummaryCard"
import { StatisticsSummary } from "@/types/statistics"
import { getCompletedLabel } from "@/utils/Statistics/getStatistics"

import {
    CheckCircle,
    Flame,
    BarChart3,
    Trophy,
} from "lucide-react"

type SummaryCardsProps = {
    data: StatisticsSummary
    range: "week" | "month" | "year"
}


export function SummaryCards({ data, range }: SummaryCardsProps) {
    const cards = [
        {
            title: "Total Habits",
            value: data.totalHabits,
            icon: BarChart3,
        },
        {
            title: getCompletedLabel(range),
            value: data.completed,
            icon: CheckCircle,
        },
        {
            title: "Current Streak",
            value: data.currentStreak,
            icon: Flame,
        },
        {
            title: "Longest Streak",
            value: data.longestStreak,
            icon: Trophy,
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
                <SummaryCard key={card.title} {...card} />
            ))}
        </div>
    )
}
