import { InsightCard } from "@/components/web/statistics/Insight/InsightCard"
import { getBestHabitInsight, getOverallInsight, getRiskInsight, getStreakInsight } from "@/utils/insights/insights"


const Insights = () => {
    // Mock values مؤقتًا
    const overallCompletion = 82
    const totalCompletions = 125
    const activeHabits = 6

    const bestHabit = {
        name: "Morning Meditation",
        percentage: 95,
    }

    const worstHabit = {
        name: "Exercise",
        percentage: 50,
    }

    const longestStreak = {
        name: "Morning Meditation",
        days: 45,
    }

    return (
        <div className="grid gap-8 lg:grid-cols-2">

            <div className="lg:col-span-2">
                <InsightCard
                    title="Overall Performance"
                    value={`${overallCompletion}%`}
                    subtitle="Completion rate this month"
                    insight={getOverallInsight(overallCompletion)}
                    highlight
                />
            </div>

            <InsightCard
                title="Best Habit"
                value={`${bestHabit.percentage}%`}
                subtitle={bestHabit.name}
                insight={getBestHabitInsight(
                    bestHabit.name,
                    bestHabit.percentage
                )}
            />

            <InsightCard
                title="Needs Attention"
                value={`${worstHabit.percentage}%`}
                subtitle={worstHabit.name}
                insight={getRiskInsight(
                    worstHabit.name,
                    worstHabit.percentage
                )}
            />

            <InsightCard
                title="Longest Streak"
                value={`${longestStreak.days} days`}
                subtitle={longestStreak.name}
                insight={getStreakInsight(longestStreak.days)}
            />

        </div>


    )
}

export default Insights
