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
    const habitById = new Map<Id<'habits'>, (typeof habits)[number]>(
      habits.map((h) => [h._id, h])
    )

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

    /* ---------------------------------- */
    /* Build Maps */
    /* ---------------------------------- */

    // DAILY: habitId -> set(dateKey)
    const completedDaysByHabit = new Map<Id<'habits'>, Set<string>>()

    // DAILY: dateKey -> count of completed DAILY habits that day
    const dailyCompletedCountByDate = new Map<string, number>()

    // WEEKLY (numeric): habitId -> (weekStart -> sum(valueCompleted))
    const weeklySums = new Map<Id<'habits'>, Map<string, number>>()

    // WEEKLY (final): habitId -> set(weekStartKey) where week is "completed"
    // - numeric weekly: sum >= target
    // - boolean weekly: any completed log in the week
    const completedWeeksByHabit = new Map<Id<'habits'>, Set<string>>()

    const ensureWeekSet = (habitId: Id<'habits'>) => {
      if (!completedWeeksByHabit.has(habitId)) {
        completedWeeksByHabit.set(habitId, new Set())
      }
      return completedWeeksByHabit.get(habitId)!
    }

    for (const l of logs) {
      const habit = habitById.get(l.habitId)
      if (!habit) continue

      // -----------------------------
      // DAILY
      // -----------------------------
      if (habit.frequency === 'daily' && l.completed) {
        if (!completedDaysByHabit.has(l.habitId)) {
          completedDaysByHabit.set(l.habitId, new Set())
        }
        completedDaysByHabit.get(l.habitId)!.add(l.dateKey)

        if (dailyIds.has(l.habitId)) {
          dailyCompletedCountByDate.set(
            l.dateKey,
            (dailyCompletedCountByDate.get(l.dateKey) ?? 0) + 1
          )
        }
      }

      // -----------------------------
      // WEEKLY
      // -----------------------------
      if (habit.frequency === 'weekly') {
        const wk = weekStartKey(l.dateKey)

        // weekly numeric → accumulate progress
        const hasTarget = typeof habit.target === 'number' && habit.target > 0
        if (hasTarget) {
          if (!weeklySums.has(l.habitId)) weeklySums.set(l.habitId, new Map())
          const weekMap = weeklySums.get(l.habitId)!
          weekMap.set(wk, (weekMap.get(wk) ?? 0) + (l.valueCompleted ?? 0))
        } else {
          // weekly boolean → a week is completed if there is ANY completed log in it
          if (l.completed) {
            ensureWeekSet(l.habitId).add(wk)
          }
        }
      }
    }

    /* ---------------------------------- */
    /* For weekly numeric: mark completed weeks where sum >= target */
    /* ---------------------------------- */

    for (const [habitId, weekMap] of weeklySums) {
      const habit = habitById.get(habitId)
      const target = habit?.target
      if (!habit || typeof target !== 'number' || target <= 0) continue

      const set = ensureWeekSet(habitId)
      for (const [wk, sum] of weekMap) {
        if (sum >= target) set.add(wk)
      }
    }

    /* ---------------------------------- */
    /* Completion Today / This Week */
    /* ---------------------------------- */

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
    const overallPct =
      overallTotal === 0
        ? 0
        : Math.round((overallCompleted / overallTotal) * 100)

    /* ---------------------------------- */
    /* Perfect Daily Streak (all daily habits completed each day) */
    /* ---------------------------------- */

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

    /* ---------------------------------- */
    /* Best Mixed Streak (Daily or Weekly)
       Keep weekly streak logic aligned with habits.ts/_utils/streak.ts:
       streak counts from current week only if current week is completed.
    */

    const getDailyCurrentStreak = (set?: Set<string>) => {
      if (!set) return 0
      let s = 0
      let cur = todayKey
      while (set.has(cur)) {
        s++
        cur = prevDateKey(cur)
      }
      return s
    }

    const getWeeklyCurrentStreak = (habitId: Id<'habits'>) => {
      const set = completedWeeksByHabit.get(habitId)
      if (!set) return 0

      let cur = currentWeekStart
      let s = 0
      while (set.has(cur)) {
        s++
        cur = addDays(cur, -7)
      }
      return s
    }

    let best: BestStreak | null = null

    for (const h of habits) {
      if (h.frequency === 'weekly') {
        const val = getWeeklyCurrentStreak(h._id)
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
