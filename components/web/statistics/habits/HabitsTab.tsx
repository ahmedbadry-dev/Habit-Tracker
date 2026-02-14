import { api } from "@/convex/_generated/api"
import { fetchQuery } from "convex/nextjs"
import { getToken } from "@/lib/auth-server"

import { AnalyticsSection } from "@/components/web/statistics/habits/AnalyticsSection"
import { HabitCard } from "@/components/web/statistics/habits/HabitCard"
import { EmptyState } from "@/utils/shared/EmptyState"
import { StatisticsRange } from "@/types/statistics"

export default async function HabitsTab({ range }: { range: StatisticsRange }) {


    const token = await getToken()

    const data = await fetchQuery(
        api.statistics.getStatistics,
        { range: range as any },
        { token }
    )

    const habits = data.habitsPerformance

    if (!habits.length) {
        return <EmptyState message="No habits yet" />
    }

    const topHabits = [...habits]
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 3)

    const atRiskHabits = [...habits]
        .filter(h => h.percentage < 50)
        .sort((a, b) => a.percentage - b.percentage)
        .slice(0, 3)

    const mostImproved = [...habits]
        .sort((a, b) => b.improvement - a.improvement)
        .slice(0, 3)

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <AnalyticsSection
                title="Top Performing"
                description="Highest completion rates"
                count={topHabits.length}
            >
                {topHabits.map((habit, i) => (
                    <HabitCard key={habit.id} index={i + 1} {...habit} variant="top" />
                ))}
            </AnalyticsSection>

            <AnalyticsSection
                title="At Risk Habits"
                description="Needs attention"
                count={atRiskHabits.length}
            >
                {atRiskHabits.length === 0 ? (
                    <EmptyState message="All habits are performing well 🎉" />
                ) : (
                    atRiskHabits.map((habit, i) => (
                        <HabitCard key={habit.id} index={i + 1} {...habit} variant="risk" />
                    ))
                )}
            </AnalyticsSection>

            <AnalyticsSection
                title="Most Improved"
                description="Biggest improvement vs previous range"
                count={mostImproved.length}
            >
                {mostImproved.map((habit, i) => (
                    <HabitCard key={habit.id} index={i + 1} {...habit} variant="improved" />
                ))}
            </AnalyticsSection>
        </div>
    )
}
