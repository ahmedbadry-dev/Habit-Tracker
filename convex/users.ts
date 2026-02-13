import { mutation } from './_generated/server'
import { authComponent } from './auth'

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
      return existing._id
    }

    return await ctx.db.insert('users', {
      authId: authUser._id,
      email: authUser.email,
      name: authUser.name ?? undefined,
      createdAt: Date.now(),
    })
  },
})

import { query } from './_generated/server'
import { getUserId } from './_utils/auth'

export const getCurrentUserName = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx)

    const user = await ctx.db.get(userId)
    if (!user) return null

    return user.name ?? null
  },
})
