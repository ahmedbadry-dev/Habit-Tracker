import { api } from "@/convex/_generated/api"
import { fetchQuery } from "convex/nextjs"
import { getToken } from "@/lib/auth-server"

import { InsightCard } from "@/components/web/statistics/Insight/InsightCard"
import { EmptyState } from "@/utils/shared/EmptyState"
import { StatisticsRange } from "@/types/statistics"

const validRanges: StatisticsRange[] = ["week", "month", "year"]
export default async function InsightsTab({
    searchParams,
}: {
    searchParams: Promise<{ range?: string }>
}) {

    const { range: rawRange } = await searchParams
    const range: StatisticsRange =
        validRanges.includes(rawRange as StatisticsRange)
            ? (rawRange as StatisticsRange)
            : "week"

    const token = await getToken()
    if (!token) {
        return (
            <div className="p-4 text-muted-foreground">
                Login required to view insights.
            </div>
        )
    }

    const data = await fetchQuery(
        api.statistics.getStatistics,
        { range },
        { token }
    )

    const insights = data.insights

    if (!insights) {
        return (
            <EmptyState message="No insights yet. Add and complete habits to generate insights." />
        )
    }

    return (
        <div className="grid gap-8 lg:grid-cols-2">
            <div className="lg:col-span-2">
                <InsightCard
                    title="Overall Performance"
                    value={`${insights.overallCompletion}%`}
                    subtitle="Completion rate"
                    insight={insights.text.overall}
                    highlight
                />
            </div>

            <InsightCard
                title="Best Habit"
                value={`${insights.bestHabit?.percentage ?? 0}%`}
                subtitle={insights.bestHabit?.name}

            />

            <InsightCard
                title="Needs Attention"
                value={`${insights.worstHabit?.percentage ?? 0}%`}
                subtitle={insights.worstHabit?.name}
            />

            <InsightCard
                title="Longest Streak"
                value={`${insights.longestStreak} days`}
            />
        </div>
    )
}
