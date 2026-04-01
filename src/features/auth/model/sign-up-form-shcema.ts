import { z } from 'zod/v4'

export const passwordSchema = z
  .string()
  .min(6, 'Minimum 6 characters')
  .max(20, 'Maximum 20 characters')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/^[A-Za-z0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_{|}~]+$/, 'Contains invalid characters')

export const signUpRequestSchema = z
  .object({
    userName: z
      .string()
      .min(6, 'Minimum number of characters 6')
      .max(30, 'Maximum number of characters 30')
      .regex(/^[A-Za-z0-9_-]+$/, 'Only letters, numbers, "_" and "-" are allowed'),
    email: z.string().email('The email must match the format example@example.com'),
    password: passwordSchema,
    passwordConfirm: passwordSchema,
    terms: z.boolean().refine(val => val === true, {
      message: 'You must accept the terms',
    }),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: 'Passwords must match',
    path: ['passwordConfirm'],
  })

// export const signUpResponseSchema = z.object({
//   success: z.boolean().optional(),
// })
