import { api } from "@/convex/_generated/api"
import { fetchQuery } from "convex/nextjs"
import { getToken } from "@/lib/auth-server"

import { InsightCard } from "@/components/web/statistics/Insight/InsightCard"

export default async function InsightsTab({
    searchParams,
}: {
    searchParams: Promise<{ range?: string }>
}) {
    const { range = "week" } = await searchParams

    const token = await getToken()

    const data = await fetchQuery(
        api.statistics.getStatistics,
        { range: range as any },
        { token }
    )

    const insights = data.insights

    if (!insights) return null

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
