import { Id } from '../_generated/dataModel'
import { authComponent } from '../auth'

/**
 * Query-safe: get existing authenticated user
 * Does NOT create user
 */
export async function getUserId(ctx: any): Promise<Id<'users'>> {
  const authUser = await authComponent.getAuthUser(ctx)
  console.log('CONVEX AUTH USER:', authUser)
  if (!authUser) {
    throw new Error('Unauthorized')
  }

  const user = await ctx.db
    .query('users')
    .withIndex('by_authId', (q: any) => q.eq('authId', authUser._id))
    .unique()

  if (!user) {
    throw new Error('User not found')
  }

  return user._id
}

/**
 * Mutation-only: get or create user record
 */
export async function getOrCreateUserId(ctx: any): Promise<Id<'users'>> {
  const authUser = await authComponent.getAuthUser(ctx)

  if (!authUser) {
    throw new Error('Unauthorized')
  }

  const existing = await ctx.db
    .query('users')
    .withIndex('by_authId', (q: any) => q.eq('authId', authUser._id))
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
}
