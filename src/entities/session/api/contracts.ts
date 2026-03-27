import { z } from 'zod/v4'

export const signInRequestSchema = z.object({
  email: z.email(),
  password: z.string().nonempty({ error: 'Password field is required' }),
})

export const signInResponseSchema = z.object({
  accessToken: z.string(),
})

export type SignInRequestDto = z.infer<typeof signInRequestSchema>
export type SignInResponseDto = z.infer<typeof signInResponseSchema>

// ===== add schema for signUp temporarily
export const signUpRequestSchema = z
  .object({
    userName: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
    passwordConfirm: z.string(),
    terms: z.boolean(),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: 'Passwords must match',
    path: ['passwordConfirm'],
  })

export const signUpResponseSchema = z.object({
  success: z.boolean().optional(),
})

export type SignUpRequestDto = z.infer<typeof signUpRequestSchema>
export type SignUpResponseDto = z.infer<typeof signUpResponseSchema>
