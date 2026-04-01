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
