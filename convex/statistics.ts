import { query } from './_generated/server'
import { v } from 'convex/values'
import { getOrCreateUserId } from './_utils/auth'
import { getRangeBounds, RangeKey } from './_utils/range'

export const getStatistics = query({
  args: {
    todayKey: v.string(),
    range: v.union(v.literal('week'), v.literal('month'), v.literal('year')),
  },
  handler: async (ctx, args) => {
    const userId = await getOrCreateUserId(ctx)
    const bounds = getRangeBounds(args.todayKey, args.range as RangeKey)

    // ------------------------------------------------
    // 1️⃣ Fetch active habits
    // ------------------------------------------------
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId_archived', (q) =>
        q.eq('userId', userId).eq('archived', false)
      )
      .collect()

    const habitMap = new Map(habits.map((h) => [h._id, h]))

    // ------------------------------------------------
    // 2️⃣ Fetch logs once
    // ------------------------------------------------
    const logs = await ctx.db
      .query('habitLogs')
      .withIndex('by_userId_dateKey', (q) => q.eq('userId', userId))
      .collect()

    const inRange = (k: string, a: string, b: string) => k >= a && k <= b

    const currentLogs = logs.filter((l) =>
      inRange(l.dateKey, bounds.startKey, bounds.endKey)
    )

    const previousLogs = logs.filter((l) =>
      inRange(l.dateKey, bounds.previousStartKey, bounds.previousEndKey)
    )

    // ------------------------------------------------
    // 3️⃣ SUMMARY (Weekly-aware expected checkins)
    // ------------------------------------------------

    const totalCompletions = currentLogs.filter((l) => l.completed).length

    const previousCompletions = previousLogs.filter((l) => l.completed).length

    // Number of weeks inside range
    const weeksInRange = Math.ceil(bounds.days / 7)

    const expectedCheckins = habits.reduce((total, h) => {
      if (h.frequency === 'weekly') {
        return total + weeksInRange
      }
      return total + bounds.days
    }, 0)

    const completionRate =
      expectedCheckins > 0
        ? Math.round((totalCompletions / expectedCheckins) * 100)
        : 0

    const previousRate =
      expectedCheckins > 0
        ? Math.round((previousCompletions / expectedCheckins) * 100)
        : 0

    const improvementVsPrevious = completionRate - previousRate

    // ------------------------------------------------
    // 4️⃣ PER HABIT STATS
    // ------------------------------------------------

    const habitStats = habits.map((h) => {
      const habitCurrentLogs = currentLogs.filter((l) => l.habitId === h._id)

      const habitPreviousLogs = previousLogs.filter((l) => l.habitId === h._id)

      const currentCount = habitCurrentLogs.filter((l) => l.completed).length

      const previousCount = habitPreviousLogs.filter((l) => l.completed).length

      const expected = h.frequency === 'weekly' ? weeksInRange : bounds.days

      const rate = expected > 0 ? currentCount / expected : 0

      return {
        habit: h,
        currentCount,
        previousCount,
        improvement: currentCount - previousCount,
        rate,
      }
    })

    // ------------------------------------------------
    // 5️⃣ BEST / WORST / MOST IMPROVED
    // ------------------------------------------------

    const sortedByRate = [...habitStats].sort((a, b) => b.rate - a.rate)

    const sortedByImprovement = [...habitStats].sort(
      (a, b) => b.improvement - a.improvement
    )

    const bestHabit = sortedByRate.length > 0 ? sortedByRate[0].habit : null

    const worstHabit =
      sortedByRate.length > 0
        ? sortedByRate[sortedByRate.length - 1].habit
        : null

    const mostImproved =
      sortedByImprovement.length > 0 ? sortedByImprovement[0].habit : null

    // ------------------------------------------------
    // 6️⃣ AT RISK (Low completion rate)
    // ------------------------------------------------

    const atRisk = habitStats.filter((h) => h.rate < 0.4).map((h) => h.habit)

    // ------------------------------------------------
    // 7️⃣ CATEGORY PERFORMANCE
    // ------------------------------------------------

    const categoryMap = new Map<string, number>()

    habitStats.forEach((stat) => {
      const cat = stat.habit.category
      const prev = categoryMap.get(cat) ?? 0
      categoryMap.set(cat, prev + stat.currentCount)
    })

    const categoryPerformance = Array.from(categoryMap.entries()).map(
      ([category, value]) => ({
        category,
        value,
      })
    )

    // ------------------------------------------------
    // 8️⃣ TIME PROGRESS (Chart Data)
    // ------------------------------------------------

    const timeMap = new Map<string, number>()

    currentLogs.forEach((l) => {
      if (!l.completed) return
      const prev = timeMap.get(l.dateKey) ?? 0
      timeMap.set(l.dateKey, prev + 1)
    })

    const timeProgress = Array.from(timeMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, value]) => ({
        date,
        value,
      }))

    // ------------------------------------------------
    // RETURN
    // ------------------------------------------------

    return {
      range: args.range,
      bounds,

      summary: {
        totalCompletions,
        completionRate,
        improvementVsPrevious,
      },

      categoryPerformance,

      bestHabit,
      worstHabit,
      mostImproved,
      atRisk,

      timeProgress,
    }
  },
})
