import { v } from 'convex/values'
import { query } from './_generated/server'
import { getUserId } from './_utils/auth'
import { addDays, prevDateKey } from './_utils/dateKeys'

export const getDailyOverview = query({
  args: {
    dateKey: v.string(), // YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)

    // -----------------------------
    // 1️⃣ Fetch daily habits (non archived)
    // -----------------------------
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId_archived', (q) =>
        q.eq('userId', userId).eq('archived', false)
      )
      .collect()

    const dailyHabits = habits.filter((h) => h.frequency === 'daily')

    const totalHabits = dailyHabits.length

    // -----------------------------
    // 2️⃣ Fetch today's logs
    // -----------------------------
    const logsToday = await ctx.db
      .query('habitLogs')
      .withIndex('by_userId_dateKey', (q) =>
        q.eq('userId', userId).eq('dateKey', args.dateKey)
      )
      .collect()

    const completedToday = logsToday.filter(
      (l) => l.completed && dailyHabits.some((h) => h._id === l.habitId)
    )

    const completedHabits = completedToday.length

    const completionPercentage =
      totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100)

    // -----------------------------
    // 3️⃣ Compute Global Streak
    // -----------------------------
    let currentStreak = 0
    let cursor = args.dateKey

    while (true) {
      const logs = await ctx.db
        .query('habitLogs')
        .withIndex('by_userId_dateKey', (q) =>
          q.eq('userId', userId).eq('dateKey', cursor)
        )
        .collect()

      const completedCount = logs.filter(
        (l) => l.completed && dailyHabits.some((h) => h._id === l.habitId)
      ).length

      if (totalHabits === 0 || completedCount !== totalHabits) {
        break
      }

      currentStreak++
      cursor = prevDateKey(cursor)
    }

    // -----------------------------
    // 4️⃣ Format date label
    // -----------------------------
    const dateObj = new Date(args.dateKey + 'T00:00:00Z')

    const dateLabel = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })

    return {
      dateLabel,
      totalHabits,
      completedHabits,
      completionPercentage,
      currentStreak,
    }
  },
})
