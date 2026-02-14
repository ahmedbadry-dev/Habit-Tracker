import { v } from 'convex/values'
import { query } from './_generated/server'
import { getUserId } from './_utils/auth'
import { addDays } from './_utils/dateKeys'

function formatKey(date: Date) {
  return date.toISOString().split('T')[0]
}

function getRangeDates(range: 'week' | 'month' | 'year') {
  const now = new Date()

  const start = new Date(now)
  const end = new Date(now)

  if (range === 'week') {
    const day = now.getDay()
    const diff = day === 0 ? 6 : day - 1
    start.setDate(now.getDate() - diff)
  }

  if (range === 'month') {
    start.setDate(1)
  }

  if (range === 'year') {
    start.setMonth(0)
    start.setDate(1)
  }

  return {
    startKey: formatKey(start),
    endKey: formatKey(end),
  }
}

function getPreviousRangeDates(
  range: 'week' | 'month' | 'year',
  currentStartKey: string
) {
  const start = new Date(currentStartKey)

  if (range === 'week') start.setDate(start.getDate() - 7)
  if (range === 'month') start.setMonth(start.getMonth() - 1)
  if (range === 'year') start.setFullYear(start.getFullYear() - 1)

  const end = new Date(currentStartKey)
  end.setDate(end.getDate() - 1)

  return {
    startKey: formatKey(start),
    endKey: formatKey(end),
  }
}

function weekdayLabel(dateKey: string) {
  const d = new Date(dateKey + 'T00:00:00Z')
  return d.toLocaleDateString('en-US', { weekday: 'short' }) // Mon
}

function monthLabel(yyyymm: string) {
  const [y, m] = yyyymm.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1, 1))
  return d.toLocaleDateString('en-US', { month: 'short' }) // Feb
}

function overallText(p: number) {
  if (p >= 85) return 'Elite consistency. Keep the pace and raise your targets.'
  if (p >= 65) return 'Strong momentum. Aim to lock in 1 more habit.'
  if (p >= 40) return 'Decent start. Focus on the easiest habit first.'
  return 'Low consistency. Reduce friction and set smaller targets.'
}

export const getStatistics = query({
  args: {
    range: v.union(v.literal('week'), v.literal('month'), v.literal('year')),
  },

  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)

    const { startKey, endKey } = getRangeDates(args.range)
    const previous = getPreviousRangeDates(args.range, startKey)

    // ----------------------------
    // HABITS
    // ----------------------------
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId_archived', (q) =>
        q.eq('userId', userId).eq('archived', false)
      )
      .collect()

    const totalHabits = habits.length

    if (totalHabits === 0) {
      return {
        summary: {
          totalHabits: 0,
          completed: 0,
          currentStreak: 0,
          longestStreak: 0,
        },
        progress: [],
        categories: [],
        habitsPerformance: [],
        insights: null,
      }
    }

    // ----------------------------
    // LOGS
    // ----------------------------
    const logs = await ctx.db
      .query('habitLogs')
      .withIndex('by_userId_dateKey', (q) =>
        q.eq('userId', userId).gte('dateKey', startKey)
      )
      .collect()

    const previousLogs = await ctx.db
      .query('habitLogs')
      .withIndex('by_userId_dateKey', (q) =>
        q.eq('userId', userId).gte('dateKey', previous.startKey)
      )
      .collect()

    const completedLogs = logs.filter((l) => l.completed)

    // ----------------------------
    // SUMMARY
    // ----------------------------
    const completed = completedLogs.length

    // streak (daily global streak)
    const completedDays = Array.from(
      new Set(completedLogs.map((l) => l.dateKey))
    ).sort()

    let currentStreak = 0
    let cursor = endKey

    while (completedDays.includes(cursor)) {
      currentStreak++
      cursor = addDays(cursor, -1)
    }

    let longestStreak = 0
    let run = 1

    for (let i = 1; i < completedDays.length; i++) {
      const expected = addDays(completedDays[i - 1], 1)
      if (completedDays[i] === expected) {
        run++
        longestStreak = Math.max(longestStreak, run)
      } else run = 1
    }

    // ----------------------------
    // TIME PROGRESS
    // ----------------------------
    const progressMap = new Map<string, { completed: number; total: number }>()

    for (const log of logs) {
      const key =
        args.range === 'year'
          ? log.dateKey.slice(0, 7) // YYYY-MM
          : log.dateKey

      if (!progressMap.has(key))
        progressMap.set(key, { completed: 0, total: 0 })

      const item = progressMap.get(key)!
      item.total++
      if (log.completed) item.completed++
    }

    // بعد ما تبني progressMap
    const progress = Array.from(progressMap.entries()).map(
      ([label, value]) => ({
        label:
          args.range === 'week'
            ? weekdayLabel(label)
            : args.range === 'year'
              ? monthLabel(label)
              : label.slice(5), // month: "MM-DD" مؤقتًا
        completed: value.completed,
        total: value.total,
      })
    )

    // ----------------------------
    // CATEGORY STATS
    // ----------------------------
    const categoryMap = new Map<string, { completed: number; total: number }>()

    for (const habit of habits) {
      if (!categoryMap.has(habit.category))
        categoryMap.set(habit.category, { completed: 0, total: 0 })

      const cat = categoryMap.get(habit.category)!
      cat.total++

      const hasCompletion = completedLogs.some((l) => l.habitId === habit._id)

      if (hasCompletion) cat.completed++
    }

    const categories = Array.from(categoryMap.entries()).map(
      ([name, value]) => ({
        name,
        completed: value.completed,
        total: value.total,
      })
    )

    // ----------------------------
    // HABIT PERFORMANCE
    // ----------------------------
    const habitsPerformance = habits.map((habit) => {
      const habitLogs = logs.filter((l) => l.habitId === habit._id)
      const prevHabitLogs = previousLogs.filter((l) => l.habitId === habit._id)

      const totalCompletions = habitLogs.filter((l) => l.completed).length
      const totalTargets = habitLogs.length

      const previousPercentage =
        prevHabitLogs.length === 0
          ? 0
          : Math.round(
              (prevHabitLogs.filter((l) => l.completed).length /
                prevHabitLogs.length) *
                100
            )

      const percentage =
        totalTargets === 0
          ? 0
          : Math.round((totalCompletions / totalTargets) * 100)

      return {
        id: habit._id,
        name: habit.title,
        currentStreak,
        totalCompletions,
        totalTargets,
        previousPercentage,
        percentage,
        improvement: percentage - previousPercentage,
      }
    })

    // ----------------------------
    // INSIGHTS
    // ----------------------------
    const sortedByPercentage = [...habitsPerformance].sort(
      (a, b) => b.percentage - a.percentage
    )

    const sortedByImprovement = [...habitsPerformance].sort(
      (a, b) => b.improvement - a.improvement
    )

    const bestHabit = sortedByPercentage[0]
    const worstHabit = sortedByPercentage.at(-1)
    const mostImproved = sortedByImprovement[0]

    const overallCompletion =
      logs.length === 0 ? 0 : Math.round((completed / logs.length) * 100)

    const insightsText = {
      overall: overallText(overallCompletion),
      best: bestHabit
        ? `Your best habit is "${bestHabit.name}" — keep protecting it.`
        : '',
      risk: worstHabit
        ? `Watch "${worstHabit.name}". Try scheduling it earlier.`
        : '',
      improved: mostImproved
        ? `"${mostImproved.name}" is improving fast — double down.`
        : '',
    }

    return {
      summary: {
        totalHabits,
        completed,
        currentStreak,
        longestStreak,
      },
      progress,
      categories,
      habitsPerformance,
      insights: {
        overallCompletion,
        bestHabit,
        worstHabit,
        mostImproved,
        longestStreak,
        text: insightsText,
      },
    }
  },
})
