import { Id } from '../_generated/dataModel'
import { QueryCtx } from '../_generated/server'

/* ---------------------------------- */
/* Helpers */
/* ---------------------------------- */

function toDate(dateKey: string) {
  return new Date(dateKey + 'T00:00:00Z')
}

function toKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function prevDateKey(dateKey: string) {
  const d = toDate(dateKey)
  d.setUTCDate(d.getUTCDate() - 1)
  return toKey(d)
}

function nextDateKey(dateKey: string) {
  const d = toDate(dateKey)
  d.setUTCDate(d.getUTCDate() + 1)
  return toKey(d)
}

function addDays(dateKey: string, days: number) {
  const d = toDate(dateKey)
  d.setUTCDate(d.getUTCDate() + days)
  return toKey(d)
}

/**
 * Monday-based week start
 */
function weekStartKey(dateKey: string) {
  const d = toDate(dateKey)
  const day = d.getUTCDay() // 0 = Sunday
  const diffToMon = (day + 6) % 7
  d.setUTCDate(d.getUTCDate() - diffToMon)
  return toKey(d)
}

/* ---------------------------------- */
/* DAILY STREAK */
/* ---------------------------------- */

export async function computeDailyStreak(
  ctx: QueryCtx,
  params: {
    userId: Id<'users'>
    habitId: Id<'habits'>
    upToDateKey: string
  }
) {
  const { userId, habitId, upToDateKey } = params

  // Fetch once
  const logs = await ctx.db
    .query('habitLogs')
    .withIndex('by_userId_habitId_dateKey', (q) =>
      q.eq('userId', userId).eq('habitId', habitId)
    )
    .collect()

  const completedDays = logs.filter((l) => l.completed).map((l) => l.dateKey)

  const completedSet = new Set(completedDays)

  // -----------------------------
  // CURRENT STREAK
  // -----------------------------
  let currentStreak = 0
  let cursor = upToDateKey

  while (completedSet.has(cursor)) {
    currentStreak++
    cursor = prevDateKey(cursor)
  }

  // -----------------------------
  // LONGEST STREAK
  // -----------------------------
  const sorted = Array.from(new Set(completedDays)).sort()

  let longestStreak = 0
  let run = 0
  let prev: string | null = null

  for (const day of sorted) {
    if (!prev) {
      run = 1
    } else {
      const expected = nextDateKey(prev)
      run = day === expected ? run + 1 : 1
    }

    longestStreak = Math.max(longestStreak, run)
    prev = day
  }

  return {
    currentStreak,
    longestStreak,
  }
}

/* ---------------------------------- */
/* WEEKLY STREAK */
/* ---------------------------------- */
/**
 * Rule:
 * A week is considered completed if
 * there is at least one completed log inside that week.
 */

export async function computeWeeklyStreak(
  ctx: QueryCtx,
  params: {
    userId: Id<'users'>
    habitId: Id<'habits'>
    upToDateKey: string
  }
) {
  const { userId, habitId, upToDateKey } = params

  const habit = await ctx.db.get(habitId)
  const hasTarget =
    habit?.frequency === 'weekly' &&
    typeof habit.target === 'number' &&
    habit.target > 0

  const logs = await ctx.db
    .query('habitLogs')
    .withIndex('by_userId_habitId_dateKey', (q) =>
      q.eq('userId', userId).eq('habitId', habitId)
    )
    .collect()

  let completedWeeks: string[]

  if (hasTarget) {
    const weekSums = new Map<string, number>()
    for (const log of logs) {
      const value = log.valueCompleted ?? 0
      if (value <= 0) continue
      const wk = weekStartKey(log.dateKey)
      weekSums.set(wk, (weekSums.get(wk) ?? 0) + value)
    }

    completedWeeks = Array.from(weekSums.entries())
      .filter(([, sum]) => sum >= (habit!.target as number))
      .map(([wk]) => wk)
  } else {
    // Boolean weekly: completed if there is any completed log in week
    completedWeeks = logs
      .filter((l) => l.completed)
      .map((l) => weekStartKey(l.dateKey))
  }

  const weekSet = new Set(completedWeeks)

  // -----------------------------
  // CURRENT WEEKLY STREAK
  // -----------------------------
  let currentStreak = 0
  let cursorWeek = weekStartKey(upToDateKey)

  while (weekSet.has(cursorWeek)) {
    currentStreak++
    cursorWeek = addDays(cursorWeek, -7)
  }

  // -----------------------------
  // LONGEST WEEKLY STREAK
  // -----------------------------
  const sorted = Array.from(new Set(completedWeeks)).sort()

  let longestStreak = 0
  let run = 0
  let prev: string | null = null

  for (const week of sorted) {
    if (!prev) {
      run = 1
    } else {
      const expected = addDays(prev, 7)
      run = week === expected ? run + 1 : 1
    }

    longestStreak = Math.max(longestStreak, run)
    prev = week
  }

  return {
    currentStreak,
    longestStreak,
  }
}
