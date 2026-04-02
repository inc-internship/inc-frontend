import { z } from 'zod/v4'

export const MIN_PASSWORD_LENGTH = 6
export const MAX_PASSWORD_LENGTH = 20
export const MIN_USERNAME_LENGTH = 6
export const MAX_USERNAME_LENGTH = 30

export const passwordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Minimum ${MIN_PASSWORD_LENGTH} characters`)
  .max(MAX_PASSWORD_LENGTH, `Maximum ${MAX_PASSWORD_LENGTH} characters`)
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/^[A-Za-z0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_{|}~]+$/, 'Contains invalid characters')

export const signUpRequestSchema = z
  .object({
    userName: z
      .string()
      .min(MIN_USERNAME_LENGTH, `Minimum number of characters ${MIN_USERNAME_LENGTH}`)
      .max(MAX_USERNAME_LENGTH, `Maximum number of characters ${MAX_USERNAME_LENGTH}`)
      .regex(/^[A-Za-z0-9_-]+$/, 'Only letters, numbers, "_" and "-" are allowed'),
    email: z.string().email('The email must match the format example@example.com'),
    password: passwordSchema,
    passwordConfirm: passwordSchema,
    terms: z.boolean().refine(val => val, {
      message: 'You must accept the terms',
    }),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: 'Passwords must match',
    path: ['passwordConfirm'],
  })
