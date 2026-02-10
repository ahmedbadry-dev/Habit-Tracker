import z from 'zod'

export const HABIT_ICONS = {
  heart: '❤️',
  meditation_male: '🧘‍♂️',
  water: '💧',
  reading: '📚',
  meditation: '🧘',
  writing: '✍️',
  creativity: '🎨',
  growth: '🌱',
  workout: '💪',
  brain: '🧠',
  sun: '☀️',
  social: '👥',
} as const

export type HabitIconKey = keyof typeof HABIT_ICONS
const iconKeys = Object.keys(HABIT_ICONS) as HabitIconKey[]

export const COLOR_PRESETS = {
  indigo: 'linear-gradient(135deg,#6366f1,#9333ea)',
  teal: 'linear-gradient(135deg,#22c55e,#06b6d4)',
  pink: 'linear-gradient(135deg,#f472b6,#ec4899)',
  amber: 'linear-gradient(135deg,#facc15,#f97316)',
  rose: 'linear-gradient(135deg,#fb7185,#ef4444)',
  violet: 'linear-gradient(135deg,#818cf8,#a855f7)',
  emerald: 'linear-gradient(135deg,#10b981,#34d399)',
  orange: 'linear-gradient(135deg,#fb923c,#f97316)',
} as const

export type HabitColorKey = keyof typeof COLOR_PRESETS
const colorKeys = Object.keys(COLOR_PRESETS) as HabitColorKey[]

const habitSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Habit name must be at least 3 characters' })
    .max(50, 'Habit name is too long'),
  description: z
    .string()
    .max(200)
    .transform((val) => val || undefined)
    .optional(),

  category: z.enum([
    'health',
    'mindfulness',
    'learning',
    'productivity',
    'creativity',
    'social',
  ]),
  icon: z.enum(iconKeys as [HabitIconKey, ...HabitIconKey[]]),

  color: z.enum(colorKeys as [HabitColorKey, ...HabitColorKey[]]),
  frequency: z.enum(['daily', 'weekly']),
  target: z.number().min(1).optional(),
  unit: z.enum(['times', 'minutes', 'hours', 'pages', 'glasses']),
  reminders: z
    .object({
      enabled: z.boolean(),
      time: z.string().optional(),
    })
    .refine((data) => !data.enabled || (data.enabled && !!data.time), {
      message: 'Reminder time is required when reminders are enabled',
      path: ['time'],
    }),
})

type THabitFormValues = z.infer<typeof habitSchema>

export { habitSchema, type THabitFormValues }
