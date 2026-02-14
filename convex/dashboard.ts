import { v } from 'convex/values'
import { query } from './_generated/server'
import { getUserId } from './_utils/auth'
import { addDays, prevDateKey, weekStartKey } from './_utils/dateKeys'
import { Id } from './_generated/dataModel'

type BestStreak = {
  habitId: Id<'habits'>
  title: string
  value: number
  unit: 'day' | 'week'
}

function formatDate(dateKey: string) {
  const dateObj = new Date(dateKey + 'T00:00:00Z')
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export const getDailyOverview = query({
  args: { dateKey: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)

    // -----------------------------
    // 1) Active habits
    // -----------------------------
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId_archived', (q) =>
        q.eq('userId', userId).eq('archived', false)
      )
      .collect()

    const todayKey = args.dateKey
    const currentWeekStart = weekStartKey(todayKey)

    const dailyHabits = habits.filter((h) => h.frequency === 'daily')
    const weeklyHabits = habits.filter((h) => h.frequency === 'weekly')

    const dailyIds = new Set(dailyHabits.map((h) => h._id))

    // early return
    if (habits.length === 0) {
      return {
        dateLabel: formatDate(todayKey),

        overall: { total: 0, completed: 0, percentage: 0 },
        daily: { total: 0, completed: 0, percentage: 0, perfectStreak: 0 },
        weekly: {
          total: 0,
          completed: 0,
          percentage: 0,
          weekStart: currentWeekStart,
        },

        bestStreak: null as BestStreak | null,
      }
    }

    // -----------------------------
    // 2) Logs window (enough for streaks)
    // -----------------------------
    const windowStart = addDays(todayKey, -400)

    const logs = await ctx.db
      .query('habitLogs')
      .withIndex('by_userId_dateKey', (q) =>
        q.eq('userId', userId).gte('dateKey', windowStart)
      )
      .collect()

    // -----------------------------
    // 3) Build fast lookup maps
    // -----------------------------
    const completedDaysByHabit = new Map<string, Set<string>>() // habitId -> set(dateKey)
    const completedWeeksByHabit = new Map<string, Set<string>>() // habitId -> set(weekStartKey)

    const dailyCompletedCountByDate = new Map<string, number>() // dateKey -> count of completed DAILY habits that day

    for (const l of logs) {
      if (!l.completed) continue

      // per-habit completed days
      if (!completedDaysByHabit.has(l.habitId)) {
        completedDaysByHabit.set(l.habitId, new Set())
      }
      completedDaysByHabit.get(l.habitId)!.add(l.dateKey)

      // per-habit completed weeks
      const wk = weekStartKey(l.dateKey)
      if (!completedWeeksByHabit.has(l.habitId)) {
        completedWeeksByHabit.set(l.habitId, new Set())
      }
      completedWeeksByHabit.get(l.habitId)!.add(wk)

      // daily "perfect day" counts
      if (dailyIds.has(l.habitId)) {
        dailyCompletedCountByDate.set(
          l.dateKey,
          (dailyCompletedCountByDate.get(l.dateKey) ?? 0) + 1
        )
      }
    }

    // -----------------------------
    // 4) Completion (Daily today + Weekly this week)
    // -----------------------------
    let dailyCompletedToday = 0
    for (const h of dailyHabits) {
      const set = completedDaysByHabit.get(h._id)
      if (set?.has(todayKey)) dailyCompletedToday++
    }

    let weeklyCompletedThisWeek = 0
    for (const h of weeklyHabits) {
      const set = completedWeeksByHabit.get(h._id)
      if (set?.has(currentWeekStart)) weeklyCompletedThisWeek++
    }

    const dailyTotal = dailyHabits.length
    const weeklyTotal = weeklyHabits.length
    const overallTotal = habits.length

    const dailyPct =
      dailyTotal === 0
        ? 0
        : Math.round((dailyCompletedToday / dailyTotal) * 100)

    const weeklyPct =
      weeklyTotal === 0
        ? 0
        : Math.round((weeklyCompletedThisWeek / weeklyTotal) * 100)

    const overallCompleted = dailyCompletedToday + weeklyCompletedThisWeek
    const overallPct = Math.round((overallCompleted / overallTotal) * 100)

    // -----------------------------
    // 5) Daily PERFECT streak (all daily habits completed for consecutive days)
    // -----------------------------
    let perfectStreak = 0
    if (dailyTotal > 0) {
      let cursor = todayKey
      while (true) {
        const completedCount = dailyCompletedCountByDate.get(cursor) ?? 0
        if (completedCount !== dailyTotal) break
        perfectStreak++
        cursor = prevDateKey(cursor)
      }
    }

    // -----------------------------
    // 6) Best habit current streak (Mixed: daily or weekly)
    // -----------------------------
    const getDailyCurrentStreak = (completedSet: Set<string> | undefined) => {
      if (!completedSet) return 0
      let s = 0
      let cur = todayKey
      while (completedSet.has(cur)) {
        s++
        cur = prevDateKey(cur)
      }
      return s
    }

    const getWeeklyCurrentStreak = (
      completedWeeks: Set<string> | undefined
    ) => {
      if (!completedWeeks) return 0
      let s = 0
      let curWeek = currentWeekStart
      while (completedWeeks.has(curWeek)) {
        s++
        curWeek = addDays(curWeek, -7)
      }
      return s
    }

    let best: BestStreak | null = null

    for (const h of habits) {
      if (h.frequency === 'weekly') {
        const val = getWeeklyCurrentStreak(completedWeeksByHabit.get(h._id))
        if (!best || val > best.value) {
          best = { habitId: h._id, title: h.title, value: val, unit: 'week' }
        }
      } else {
        const val = getDailyCurrentStreak(completedDaysByHabit.get(h._id))
        if (!best || val > best.value) {
          best = { habitId: h._id, title: h.title, value: val, unit: 'day' }
        }
      }
    }

    return {
      dateLabel: formatDate(todayKey),

      overall: {
        total: overallTotal,
        completed: overallCompleted,
        percentage: overallPct,
      },

      daily: {
        total: dailyTotal,
        completed: dailyCompletedToday,
        percentage: dailyPct,
        perfectStreak,
      },

      weekly: {
        total: weeklyTotal,
        completed: weeklyCompletedThisWeek,
        percentage: weeklyPct,
        weekStart: currentWeekStart,
      },

      bestStreak: best,
    }
  },
})
