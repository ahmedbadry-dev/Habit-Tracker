import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { getUserId, getUserIdOptional } from './_utils/auth'

type PublicSettings = {
  pushEnabled: boolean
  defaultReminderTime: string
  weekStartsOn: 'monday' | 'sunday' | 'saturday'
}

const DEFAULTS: PublicSettings = {
  pushEnabled: false,
  defaultReminderTime: '09:00',
  weekStartsOn: 'monday',
}

export const getMySettings = query({
  args: {},
  handler: async (ctx): Promise<PublicSettings> => {
    const userId = await getUserIdOptional(ctx)
    if (!userId) return DEFAULTS

    const existing = await ctx.db
      .query('userSettings')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .unique()

    if (!existing) return DEFAULTS

    return {
      pushEnabled: existing.pushEnabled,
      defaultReminderTime: existing.defaultReminderTime,
      weekStartsOn: existing.weekStartsOn,
    }
  },
})

export const updateMySettings = mutation({
  args: {
    patch: v.object({
      pushEnabled: v.optional(v.boolean()),
      defaultReminderTime: v.optional(v.string()),
      weekStartsOn: v.optional(
        v.union(v.literal('monday'), v.literal('sunday'), v.literal('saturday'))
      ),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)

    const settings = await ctx.db
      .query('userSettings')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .unique()

    // Validate HH:MM format if provided
    if (args.patch.defaultReminderTime) {
      const isValid = /^\d{2}:\d{2}$/.test(args.patch.defaultReminderTime)
      if (!isValid) {
        throw new Error('Invalid time format (expected HH:MM)')
      }
    }

    const now = Date.now()
    const next = {
      ...(settings ?? DEFAULTS),
      ...args.patch,
      userId,
      updatedAt: now,
    }

    if (!settings) {
      return await ctx.db.insert('userSettings', next)
    }

    await ctx.db.patch(settings._id, {
      ...args.patch,
      updatedAt: now,
    })

    return settings._id
  },
})
