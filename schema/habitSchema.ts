import z from 'zod'

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
  icon: z.string().min(1, { message: 'Please select an icon' }),
  color: z.string().min(1, { message: 'Please select a color' }),
  frequency: z.enum(['daily', 'weekly']),
  target: z.number().min(1, 'Target must be at least 1'),
  unit: z.enum(['times', 'minutes', 'hours']),
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
