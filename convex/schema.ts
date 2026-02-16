import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  // =========================
  // USERS
  // =========================
  users: defineTable({
    authId: v.string(), // identity.subject (Better Auth JWT)
    name: v.optional(v.string()),
    email: v.string(), // required
    createdAt: v.number(),
  })
    .index('by_authId', ['authId'])
    .index('by_email', ['email']),

  // =========================
  // HABITS
  // =========================
  habits: defineTable({
    userId: v.id('users'),

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

    archived: v.boolean(), // ✅ بدل archivedAt optional
    archivedAt: v.optional(v.number()), // optional metadata فقط

    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_frequency', ['userId', 'frequency'])
    .index('by_userId_archived', ['userId', 'archived']),

  // =========================
  // HABIT LOGS
  // =========================
  habitLogs: defineTable({
    userId: v.id('users'),
    habitId: v.id('habits'),

    // FE sends YYYY-MM-DD
    dateKey: v.string(),

    valueCompleted: v.optional(v.number()),
    completed: v.boolean(),

    completedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_userId_dateKey', ['userId', 'dateKey'])
    .index('by_habitId_dateKey', ['habitId', 'dateKey'])
    .index('by_userId_habitId_dateKey', ['userId', 'habitId', 'dateKey'])
    .index('by_userId_habitId_completed', ['userId', 'habitId', 'completed']),

  // =========================
  // user Settings
  // =========================
  userSettings: defineTable({
    userId: v.id('users'),

    pushEnabled: v.boolean(),
    defaultReminderTime: v.string(), // "09:00"

    language: v.union(v.literal('en'), v.literal('ar')),

    weekStartsOn: v.union(
      v.literal('monday'),
      v.literal('sunday'),
      v.literal('saturday')
    ),

    updatedAt: v.number(), // server timestamp
  }).index('by_userId', ['userId']),

  // =========================
  // Push notification subscriptions
  // =========================
  pushSubscriptions: defineTable({
    userId: v.id('users'),
    endpoint: v.string(),
    p256dh: v.string(),
    auth: v.string(),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_endpoint', ['userId', 'endpoint']),
})
