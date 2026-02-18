import { mutation } from './_generated/server'
import { authComponent } from './auth'
import { query } from './_generated/server'
import { getUserIdOptional } from './_utils/auth'

export const syncUser = mutation({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx)
    if (!authUser) {
      throw new Error('Unauthorized')
    }

    const existing = await ctx.db
      .query('users')
      .withIndex('by_authId', (q) => q.eq('authId', authUser._id))
      .unique()

    if (existing) {
      const existingSettings = await ctx.db
        .query('userSettings')
        .withIndex('by_userId', (q) => q.eq('userId', existing._id))
        .unique()

      if (!existingSettings) {
        await ctx.db.insert('userSettings', {
          userId: existing._id,
          pushEnabled: false,
          defaultReminderTime: '09:00',
          weekStartsOn: 'monday',
          updatedAt: Date.now(),
        })
      }

      return existing._id
    }

    const userId = await ctx.db.insert('users', {
      authId: authUser._id,
      email: authUser.email,
      name: authUser.name ?? undefined,
      createdAt: Date.now(),
    })

    // 🔥 Create settings automatically
    await ctx.db.insert('userSettings', {
      userId,
      pushEnabled: false,
      defaultReminderTime: '09:00',
      weekStartsOn: 'monday',
      updatedAt: Date.now(),
    })

    return userId
  },
})

export const getCurrentUserName = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOptional(ctx)
    if (!userId) return null

    const user = await ctx.db.get(userId)
    if (!user) return null

    return user.name ?? null
  },
})

export const getCurrentUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOptional(ctx)
    if (!userId) return null

    const user = await ctx.db.get(userId)
    if (!user) return null

    return {
      name: user.name ?? 'User',
      email: user.email,
    }
  },
})
