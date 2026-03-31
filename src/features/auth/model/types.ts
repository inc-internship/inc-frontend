import z from 'zod/v4'
import { loginFormSchema } from '@/features/auth'
import { createNewPasswordFormSchema } from './create-new-password-form-creator'

export type LoginFormField = z.infer<typeof loginFormSchema>
export type CreateNewPasswordFormField = z.infer<typeof createNewPasswordFormSchema>
