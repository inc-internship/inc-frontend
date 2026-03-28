import z from 'zod/v4'
import { loginFormSchema } from './sign-in-form-creator'

export type LoginFormField = z.infer<typeof loginFormSchema>
