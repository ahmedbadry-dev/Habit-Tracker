import { z } from 'zod'

const signUpSchema = z
  .object({
    name: z.string().trim().min(1, { message: 'User Name is required' }),

    email: z.email({ message: 'Invalid email address' }),

    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            'Password must contain uppercase, lowercase, number, and special character',
        }
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  })

type TSignUp = z.infer<typeof signUpSchema>

export { signUpSchema, type TSignUp }
