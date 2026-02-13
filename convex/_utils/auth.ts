import { Id } from '../_generated/dataModel'

export async function getOrCreateUserId(ctx: any): Promise<Id<'users'>> {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new Error('Unauthorized')

  const authId = identity.subject
  const email = identity.email
  const name = identity.name ?? undefined

  if (!email) {
    // Better Auth غالبًا بيرجع email، بس خليها guard
    throw new Error('Missing email in identity')
  }

  const existing = await ctx.db
    .query('users')
    .withIndex('by_authId', (q: any) => q.eq('authId', authId))
    .unique()

  if (existing) return existing._id

  const userId = await ctx.db.insert('users', {
    authId,
    email,
    name,
    createdAt: Date.now(),
  })

  return userId
}
