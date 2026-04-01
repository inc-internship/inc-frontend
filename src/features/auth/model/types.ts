import z from 'zod/v4'
import { loginFormSchema } from '@/features/auth'
import { createNewPasswordFormSchema } from '@/features/auth'
import { signUpRequestSchema } from '@/features/auth/model/sign-up-form-shcema'

export type LoginFormField = z.infer<typeof loginFormSchema>
export type CreateNewPasswordFormField = z.infer<typeof createNewPasswordFormSchema>

export type SignUpRequestDto = z.infer<typeof signUpRequestSchema>
// export type SignUpResponseDto = z.infer<typeof signUpResponseSchema>
