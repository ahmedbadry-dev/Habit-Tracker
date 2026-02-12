import { z } from 'zod'

export const forgotPasswordSchema = z.object({
  email: z.email('Invalid email'),
})

export type TForgotPassword = z.infer<typeof forgotPasswordSchema>
