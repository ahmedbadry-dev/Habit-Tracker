import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { getUserId } from './_utils/auth'

export const savePushSubscription = mutation({
  args: {
    endpoint: v.string(),
    keys: v.object({
      p256dh: v.string(),
      auth: v.string(),
    }),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)
    const now = Date.now()

    const existing = await ctx.db
      .query('pushSubscriptions')
      .withIndex('by_userId_endpoint', (q) =>
        q.eq('userId', userId).eq('endpoint', args.endpoint)
      )
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, {
        p256dh: args.keys.p256dh,
        auth: args.keys.auth,
        userAgent: args.userAgent,
        updatedAt: now,
      })
      return existing._id
    }

    return await ctx.db.insert('pushSubscriptions', {
      userId,
      endpoint: args.endpoint,
      p256dh: args.keys.p256dh,
      auth: args.keys.auth,
      userAgent: args.userAgent,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const removePushSubscription = mutation({
  args: {
    endpoint: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)
    const existing = await ctx.db
      .query('pushSubscriptions')
      .withIndex('by_userId_endpoint', (q) =>
        q.eq('userId', userId).eq('endpoint', args.endpoint)
      )
      .unique()

    if (!existing) return { removed: false }

    await ctx.db.delete(existing._id)
    return { removed: true }
  },
})

export const getMyPushSubscriptions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx)
    const subs = await ctx.db
      .query('pushSubscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect()

    return subs.map((s) => ({
      endpoint: s.endpoint,
      userAgent: s.userAgent,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }))
  },
})
