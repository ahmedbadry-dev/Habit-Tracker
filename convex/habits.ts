import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { getOrCreateUserId, getUserId } from './_utils/auth'

import {
  addDays,
  weekStartKey,
  prevDateKey,
  nextDateKey,
} from './_utils/dateKeys'
import { computeDailyStreak, computeWeeklyStreak } from './_utils/streak'

// ----------------------
// CREATE HABIT
// ----------------------
export const createHabit = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    icon: v.string(),
    color: v.string(),
    frequency: v.union(v.literal('daily'), v.literal('weekly')),
    target: v.optional(v.number()),
    unit: v.string(),
    reminders: v.object({
      enabled: v.boolean(),
      time: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getOrCreateUserId(ctx)

    return await ctx.db.insert('habits', {
      userId,
      title: args.title,
      description: args.description,
      category: args.category,
      icon: args.icon,
      color: args.color,
      frequency: args.frequency,
      target: args.target,
      unit: args.unit,
      reminders: args.reminders,
      archived: false,
      createdAt: Date.now(),
    })
  },
})

// ----------------------
// TOGGLE / UPDATE HABIT
// ----------------------
export const toggleHabit = mutation({
  args: {
    habitId: v.id('habits'),
    dateKey: v.string(), // YYYY-MM-DD
    valueCompleted: v.optional(v.number()),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getOrCreateUserId(ctx)

    const habit = await ctx.db.get(args.habitId)
    if (!habit || habit.userId !== userId) {
      throw new Error('Habit not found')
    }

    const existing = await ctx.db
      .query('habitLogs')
      .withIndex('by_userId_habitId_dateKey', (q) =>
        q
          .eq('userId', userId)
          .eq('habitId', args.habitId)
          .eq('dateKey', args.dateKey)
      )
      .unique()

    const hasTarget = typeof habit.target === 'number' && habit.target > 0

    let nextValue: number | undefined
    let nextCompleted: boolean

    // ----------------------
    // NUMERIC HABIT
    // ----------------------
    if (hasTarget) {
      const target = habit.target!
      const currentValue = existing?.valueCompleted ?? 0

      // لو FE بعت value → استخدمها، غير كدا سيب الحالية
      nextValue =
        typeof args.valueCompleted === 'number'
          ? args.valueCompleted
          : currentValue

      // (اختياري) لو عايز strict domain rule:
      // منع الزيادة عن target نفسه
      // nextValue = Math.min(nextValue, target)

      nextCompleted = nextValue >= target
    }

    // ----------------------
    // BOOLEAN HABIT
    // ----------------------
    else {
      const currentCompleted = existing?.completed ?? false

      nextCompleted =
        typeof args.completed === 'boolean' ? args.completed : !currentCompleted

      nextValue = undefined
    }

    const now = Date.now()

    if (!existing) {
      await ctx.db.insert('habitLogs', {
        userId,
        habitId: args.habitId,
        dateKey: args.dateKey,
        valueCompleted: nextValue,
        completed: nextCompleted,
        completedAt: nextCompleted ? now : undefined,
        createdAt: now,
      })
    } else {
      await ctx.db.patch(existing._id, {
        valueCompleted: nextValue,
        completed: nextCompleted,
        completedAt: nextCompleted ? now : undefined,
      })
    }

    // ----------------------
    // Compute Streak (server-side)
    // ----------------------
    const streakData =
      habit.frequency === 'weekly'
        ? await computeWeeklyStreak(ctx, {
            userId,
            habitId: args.habitId,
            upToDateKey: args.dateKey,
          })
        : await computeDailyStreak(ctx, {
            userId,
            habitId: args.habitId,
            upToDateKey: args.dateKey,
          })

    // ----------------------
    // Completion %
    // ----------------------
    let completionPercentage: number

    if (hasTarget && habit.target) {
      const safeValue = nextValue ?? 0
      completionPercentage = Math.max(
        0,
        Math.min(100, Math.round((safeValue / habit.target) * 100))
      )
    } else {
      completionPercentage = nextCompleted ? 100 : 0
    }

    return {
      habitId: args.habitId,
      dateKey: args.dateKey,
      completed: nextCompleted,
      valueCompleted: nextValue,
      completionPercentage,
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
    }
  },
})

// ----------------------
// GET TODAY HABITS
// ----------------------
export const getTodayHabits = query({
  args: { dateKey: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)

    // 1) habits (non-archived)
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId_archived', (q) =>
        q.eq('userId', userId).eq('archived', false)
      )
      .collect()

    // 2) today's logs
    const logsToday = await ctx.db
      .query('habitLogs')
      .withIndex('by_userId_dateKey', (q) =>
        q.eq('userId', userId).eq('dateKey', args.dateKey)
      )
      .collect()

    const todayLogMap = new Map(logsToday.map((l) => [l.habitId, l]))

    // 3) logs window (last 400 days) — enough for streak/portfolio
    const minKey = addDays(args.dateKey, -400)

    const windowLogs = await ctx.db
      .query('habitLogs')
      .withIndex('by_userId_dateKey', (q) =>
        q.eq('userId', userId).gte('dateKey', minKey)
      )
      .collect()

    const logsByHabit = new Map<string, typeof windowLogs>()
    for (const log of windowLogs) {
      if (!logsByHabit.has(log.habitId)) logsByHabit.set(log.habitId, [])
      logsByHabit.get(log.habitId)!.push(log)
    }

    // helpers for local streak
    const dailyCurrentStreak = (completedSet: Set<string>, upTo: string) => {
      let streak = 0
      let cur = upTo
      while (completedSet.has(cur)) {
        streak++
        cur = prevDateKey(cur)
      }
      return streak
    }

    const dailyLongestStreak = (days: string[]) => {
      const sorted = Array.from(new Set(days)).sort()
      if (sorted.length === 0) return 0
      let best = 1,
        run = 1
      for (let i = 1; i < sorted.length; i++) {
        const expected = nextDateKey(sorted[i - 1])
        if (sorted[i] === expected) run++
        else run = 1
        best = Math.max(best, run)
      }
      return best
    }

    const weeklyCurrentStreak = (weekSet: Set<string>, upTo: string) => {
      let curWeek = weekStartKey(upTo)
      let streak = 0
      while (weekSet.has(curWeek)) {
        streak++
        curWeek = addDays(curWeek, -7)
      }
      return streak
    }

    const weeklyLongestStreak = (weeks: string[]) => {
      const sorted = Array.from(new Set(weeks)).sort()
      if (sorted.length === 0) return 0
      let best = 1,
        run = 1
      for (let i = 1; i < sorted.length; i++) {
        const expected = addDays(sorted[i - 1], 7)
        if (sorted[i] === expected) run++
        else run = 1
        best = Math.max(best, run)
      }
      return best
    }

    // 4) build response
    return habits.map((h) => {
      const todayLog = todayLogMap.get(h._id)
      const habitLogs = logsByHabit.get(h._id) ?? []

      const hasTarget = typeof h.target === 'number' && h.target > 0

      const valueCompleted =
        todayLog?.valueCompleted ?? (hasTarget ? 0 : undefined)

      const completed = todayLog?.completed ?? false

      const completionPercentage = hasTarget
        ? Math.max(
            0,
            Math.min(100, Math.round(((valueCompleted ?? 0) / h.target!) * 100))
          )
        : completed
          ? 100
          : 0

      // streak local (fast)
      const completedDays = habitLogs
        .filter((l) => l.completed)
        .map((l) => l.dateKey)
      const completedSet = new Set(completedDays)

      let currentStreak = 0
      let longestStreak = 0

      if (h.frequency === 'weekly') {
        const completedWeeks = completedDays.map((d) => weekStartKey(d))
        const weekSet = new Set(completedWeeks)
        currentStreak = weeklyCurrentStreak(weekSet, args.dateKey)
        longestStreak = weeklyLongestStreak(completedWeeks)
      } else {
        currentStreak = dailyCurrentStreak(completedSet, args.dateKey)
        longestStreak = dailyLongestStreak(completedDays)
      }

      return {
        id: h._id,
        title: h.title,
        description: h.description,
        category: h.category,
        icon: h.icon,
        color: h.color,
        frequency: h.frequency,
        target: h.target,
        unit: h.unit,
        reminders: h.reminders,

        completed,
        valueCompleted,
        completionPercentage,
        streak: currentStreak,
        longestStreak,
        completedAt: todayLog?.completedAt
          ? new Date(todayLog.completedAt).toISOString()
          : undefined,
      }
    })
  },
})

// ----------------------
// UPDATE HABIT
// ----------------------
export const updateHabit = mutation({
  args: {
    habitId: v.id('habits'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    frequency: v.optional(v.union(v.literal('daily'), v.literal('weekly'))),
    target: v.optional(v.number()),
    unit: v.optional(v.string()),
    reminders: v.optional(
      v.object({
        enabled: v.boolean(),
        time: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getOrCreateUserId(ctx)

    const habit = await ctx.db.get(args.habitId)

    if (!habit || habit.userId !== userId) {
      throw new Error('Habit not found')
    }

    await ctx.db.patch(args.habitId, {
      ...(args.title !== undefined && { title: args.title }),
      ...(args.description !== undefined && { description: args.description }),
      ...(args.category !== undefined && { category: args.category }),
      ...(args.icon !== undefined && { icon: args.icon }),
      ...(args.color !== undefined && { color: args.color }),
      ...(args.frequency !== undefined && { frequency: args.frequency }),
      ...(args.target !== undefined && { target: args.target }),
      ...(args.unit !== undefined && { unit: args.unit }),
      ...(args.reminders !== undefined && { reminders: args.reminders }),
    })

    return { success: true }
  },
})

// ----------------------
// ARCHIVE HABIT
// ----------------------
export const archiveHabit = mutation({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const userId = await getOrCreateUserId(ctx)

    const habit = await ctx.db.get(args.habitId)

    if (!habit || habit.userId !== userId) {
      throw new Error('Habit not found')
    }

    await ctx.db.patch(args.habitId, {
      archived: true,
      archivedAt: Date.now(),
    })

    return { success: true }
  },
})

export const restoreHabit = mutation({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const userId = await getOrCreateUserId(ctx)

    const habit = await ctx.db.get(args.habitId)

    if (!habit || habit.userId !== userId) {
      throw new Error('Habit not found')
    }

    await ctx.db.patch(args.habitId, {
      archived: false,
      archivedAt: undefined,
    })

    return { success: true }
  },
})

// ----------------------
// GET SINGLE HABIT
// ----------------------
export const getHabitById = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx) // ← ده الصح

    const habit = await ctx.db.get(args.habitId)

    if (!habit || habit.userId !== userId) {
      throw new Error('Habit not found')
    }

    return habit
  },
})
