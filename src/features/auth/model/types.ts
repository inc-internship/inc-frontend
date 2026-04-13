import z from 'zod/v4'
import {
  createNewPasswordFormSchema,
  loginFormSchema,
  registrationFormSchema,
  resendConfirmationSchema,
  forgotPasswordFormSchema,
} from '@/features/auth'

export type LoginFormField = z.infer<typeof loginFormSchema>
export type CreateNewPasswordFormField = z.infer<typeof createNewPasswordFormSchema>
export type ForgotPasswordFormField = z.infer<typeof forgotPasswordFormSchema>

export type RegistrationFormField = z.infer<typeof registrationFormSchema>
export type ResendConfirmation = z.infer<typeof resendConfirmationSchema>
