import { AnalyticsSection } from "@/components/web/statistics/habits/AnalyticsSection"
import { HabitCard } from "@/components/web/statistics/habits/HabitCard"
import { EmptyState } from "@/utils/shared/EmptyState"
import { calculatePercentage } from "@/utils/Statistics/getCompletionStats"

export type HabitPerformance = {
    id: string
    name: string
    currentStreak: number
    totalCompletions: number
    totalTargets: number
    previousPercentage: number // مهم لحساب التحسن
}

export const mockHabits: HabitPerformance[] = [
    {
        id: "1",
        name: "Morning Meditation",
        currentStreak: 45,
        totalCompletions: 57,
        totalTargets: 60,
        previousPercentage: 85,
    },
    {
        id: "2",
        name: "Read Daily",
        currentStreak: 32,
        totalCompletions: 50,
        totalTargets: 60,
        previousPercentage: 70,
    },
    {
        id: "3",
        name: "Exercise",
        currentStreak: 28,
        totalCompletions: 30,
        totalTargets: 60,
        previousPercentage: 65,
    },
    {
        id: "4",
        name: "Write Journal",
        currentStreak: 12,
        totalCompletions: 20,
        totalTargets: 60,
        previousPercentage: 60,
    },
]



const Insights = () => {

    const topHabits = mockHabits
        .map(h => ({
            ...h,
            percentage: calculatePercentage(h.totalCompletions, h.totalTargets),
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 3)


    const atRiskHabits = mockHabits
        .map(h => ({
            ...h,
            percentage: calculatePercentage(h.totalCompletions, h.totalTargets),
        }))
        .filter(h => h.percentage < 50)
        .sort((a, b) => a.percentage - b.percentage)
        .slice(0, 3)


    const mostImproved = mockHabits
        .map(h => {
            const percentage = calculatePercentage(
                h.totalCompletions,
                h.totalTargets
            )

            const improvement = percentage - h.previousPercentage

            console.log(h.name, {
                percentage,
                previous: h.previousPercentage,
                improvement,
            })

            return {
                ...h,
                percentage,
                improvement,
            }
        })

        .sort((a, b) => b.improvement - a.improvement)
        .slice(0, 3)

    return (
        <div className="grid gap-6 lg:grid-cols-2">

            <AnalyticsSection title="Top Performing"
                description="Highest completion rates in selected range"
                count={topHabits.length}>
                {topHabits.map((habit, i) => (
                    <HabitCard key={habit.id} index={i + 1} {...habit} variant="top" />
                ))}
            </AnalyticsSection>

            <AnalyticsSection title="At Risk Habits"
                description="Highest completion rates in selected range"
                count={atRiskHabits.length}>
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
                description="Habits with the biggest improvement vs previous range"
                count={mostImproved.length}
            >

                {mostImproved.map((habit, i) => (
                    <HabitCard key={habit.id} index={i + 1} {...habit} variant="improved" />
                ))}
            </AnalyticsSection>

        </div>


    )
}

export default Insights
