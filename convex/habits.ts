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
    const settings = await ctx.db
      .query('userSettings')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .unique()

    const reminderTime =
      args.reminders.time ?? settings?.defaultReminderTime ?? '09:00'

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
      reminders: {
        enabled: args.reminders.enabled,
        time: args.reminders.enabled ? reminderTime : undefined,
      },
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
    valueCompleted: v.optional(v.number()),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getOrCreateUserId(ctx)
    const todayKey = new Date().toISOString().slice(0, 10)

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
          .eq('dateKey', todayKey)
      )
      .unique()

    // داخل handler بعد ما تجيب habit و existing

    const hasTarget = typeof habit.target === 'number' && habit.target > 0

    // ✅ لو weekly + target => ممنوع toggle
    if (habit.frequency === 'weekly' && hasTarget) {
      throw new Error('Weekly target habits use bumpHabitProgress')
    }

    let nextValue: number | undefined
    let nextCompleted: boolean

    if (hasTarget) {
      // Daily numeric
      const target = habit.target!
      const currentValue = existing?.valueCompleted ?? 0

      // If UI toggles via checkbox for daily numeric habits,
      // map checked -> target and unchecked -> 0.
      if (typeof args.completed === 'boolean') {
        nextValue = args.completed ? target : 0
      } else {
        nextValue =
          typeof args.valueCompleted === 'number'
            ? args.valueCompleted
            : currentValue
      }

      // ✅ normalize + abuse cap
      if (!Number.isFinite(nextValue)) nextValue = 0
      if (nextValue < 0) nextValue = 0
      if (habit.target && nextValue > habit.target * 10) {
        nextValue = habit.target * 10
      }

      // completed هنا “حقق target اليوم” (لـ daily numeric)
      nextCompleted = nextValue >= target
    } else {
      // Boolean (daily/weekly)
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
        dateKey: todayKey,
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
            upToDateKey: todayKey,
          })
        : await computeDailyStreak(ctx, {
            userId,
            habitId: args.habitId,
            upToDateKey: todayKey,
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
      dateKey: todayKey,
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
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx)
    const todayKey = new Date().toISOString().slice(0, 10)

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
        q.eq('userId', userId).eq('dateKey', todayKey)
      )
      .collect()

    const todayLogMap = new Map(logsToday.map((l) => [l.habitId, l]))

    // 3) logs window (last 400 days)
    const minKey = addDays(todayKey, -400)

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

    // -----------------------------
    // Streak Helpers
    // -----------------------------

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

    // -----------------------------
    // Build response
    // -----------------------------

    return habits.map((h) => {
      const todayLog = todayLogMap.get(h._id)
      const habitLogs = logsByHabit.get(h._id) ?? []

      const hasTarget = typeof h.target === 'number' && h.target > 0
      const isWeekly = h.frequency === 'weekly'

      const weekStart = weekStartKey(todayKey)
      const weekEnd = addDays(weekStart, 6)

      // -----------------------------
      // WEEK SUM (for weekly numeric)
      // -----------------------------
      let weekSum = 0

      if (isWeekly && hasTarget) {
        for (const l of habitLogs) {
          if (!l.valueCompleted) continue
          if (l.dateKey >= weekStart && l.dateKey <= weekEnd) {
            weekSum += l.valueCompleted
          }
        }
      }

      // -----------------------------
      // Completion logic
      // -----------------------------
      let completed: boolean
      let valueCompleted: number | undefined
      let completionPercentage: number

      if (isWeekly && hasTarget) {
        valueCompleted = weekSum
        completed = weekSum >= h.target!
        completionPercentage = Math.max(
          0,
          Math.min(100, Math.round((weekSum / h.target!) * 100))
        )
      } else {
        valueCompleted = todayLog?.valueCompleted ?? (hasTarget ? 0 : undefined)

        completed = todayLog?.completed ?? false

        completionPercentage = hasTarget
          ? Math.max(
              0,
              Math.min(
                100,
                Math.round(((valueCompleted ?? 0) / h.target!) * 100)
              )
            )
          : completed
            ? 100
            : 0
      }

      // -----------------------------
      // Streak
      // -----------------------------
      const completedDays = habitLogs
        .filter((l) => l.completed)
        .map((l) => l.dateKey)

      const completedSet = new Set(completedDays)

      let currentStreak = 0
      let longestStreak = 0

      if (isWeekly) {
        let completedWeeks: string[]

        if (hasTarget && typeof h.target === 'number' && h.target > 0) {
          const weekSums = new Map<string, number>()
          for (const l of habitLogs) {
            const value = l.valueCompleted ?? 0
            if (value <= 0) continue
            const wk = weekStartKey(l.dateKey)
            weekSums.set(wk, (weekSums.get(wk) ?? 0) + value)
          }

          completedWeeks = Array.from(weekSums.entries())
            .filter(([, sum]) => sum >= h.target!)
            .map(([wk]) => wk)
        } else {
          completedWeeks = completedDays.map((d) => weekStartKey(d))
        }

        const weekSet = new Set(completedWeeks)
        currentStreak = weeklyCurrentStreak(weekSet, todayKey)
        longestStreak = weeklyLongestStreak(completedWeeks)
      } else {
        currentStreak = dailyCurrentStreak(completedSet, todayKey)
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

        // 🔥 Weekly helpers للـ UI
        weekStart: isWeekly ? weekStart : undefined,
        weekEnd: isWeekly ? weekEnd : undefined,
        todayValue: todayLog?.valueCompleted ?? 0,

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
    const userId = await getUserId(ctx) // 🔥 fixed

    const habit = await ctx.db.get(args.habitId)
    if (!habit || habit.userId !== userId) {
      throw new Error('Habit not found')
    }

    // Server-side validation
    if (args.target !== undefined && args.target < 1) {
      throw new Error('Invalid target value')
    }

    const nextFrequency = args.frequency ?? habit.frequency
    let nextTarget = args.target ?? habit.target

    // Domain rule
    if (nextFrequency === 'daily' && !nextTarget) {
      nextTarget = 1
    }

    await ctx.db.patch(args.habitId, {
      ...(args.title !== undefined && { title: args.title }),
      ...(args.description !== undefined && { description: args.description }),
      ...(args.category !== undefined && { category: args.category }),
      ...(args.icon !== undefined && { icon: args.icon }),
      ...(args.color !== undefined && { color: args.color }),
      ...(args.frequency !== undefined && { frequency: args.frequency }),
      ...(args.unit !== undefined && { unit: args.unit }),
      ...(args.reminders !== undefined && { reminders: args.reminders }),
      target: nextTarget,
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

export const bumpHabitProgress = mutation({
  args: {
    habitId: v.id('habits'),
    delta: v.number(), // +1 or -1
  },
  handler: async (ctx, args) => {
    const userId = await getOrCreateUserId(ctx)
    const todayKey = new Date().toISOString().slice(0, 10)

    const habit = await ctx.db.get(args.habitId)
    if (!habit || habit.userId !== userId) {
      throw new Error('Habit not found')
    }

    const hasTarget = typeof habit.target === 'number' && habit.target > 0

    if (!hasTarget) {
      throw new Error('bumpHabitProgress is for target habits only')
    }

    const existing = await ctx.db
      .query('habitLogs')
      .withIndex('by_userId_habitId_dateKey', (q) =>
        q
          .eq('userId', userId)
          .eq('habitId', args.habitId)
          .eq('dateKey', todayKey)
      )
      .unique()

    const current = existing?.valueCompleted ?? 0

    // ✅ Clamp strictly inside target range
    const target = habit.target!

    const nextValue = Math.max(0, Math.min(current + args.delta, target))

    const now = Date.now()

    const isCompleted = nextValue >= target

    if (!existing) {
      await ctx.db.insert('habitLogs', {
        userId,
        habitId: args.habitId,
        dateKey: todayKey,
        valueCompleted: nextValue,
        completed: isCompleted,
        completedAt: isCompleted ? now : undefined,
        createdAt: now,
      })
    } else {
      await ctx.db.patch(existing._id, {
        valueCompleted: nextValue,
        completed: isCompleted,
        completedAt: isCompleted ? now : undefined,
      })
    }

    // -----------------------------
    // 🔥 Streak (server source of truth)
    // -----------------------------
    const streakData =
      habit.frequency === 'weekly'
        ? await computeWeeklyStreak(ctx, {
            userId,
            habitId: args.habitId,
            upToDateKey: todayKey,
          })
        : await computeDailyStreak(ctx, {
            userId,
            habitId: args.habitId,
            upToDateKey: todayKey,
          })

    // -----------------------------
    // 📊 Completion %
    // -----------------------------
    const completionPercentage = Math.round((nextValue / target) * 100)

    return {
      habitId: args.habitId,
      dateKey: todayKey,
      valueCompleted: nextValue,
      completed: isCompleted,
      completionPercentage,
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
    }
  },
})
