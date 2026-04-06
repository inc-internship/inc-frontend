import z from 'zod/v4'
import { loginFormSchema } from '@/features/auth'
import { createNewPasswordFormSchema } from '@/features/auth'

export type LoginFormField = z.infer<typeof loginFormSchema>
export type CreateNewPasswordFormField = z.infer<typeof createNewPasswordFormSchema>
