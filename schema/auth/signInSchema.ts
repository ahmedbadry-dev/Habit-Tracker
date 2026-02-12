import { z } from 'zod'

export const signInSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export type TSignIn = z.infer<typeof signInSchema>
