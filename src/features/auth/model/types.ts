import z from 'zod/v4'
import { loginFormSchema } from '@/features/auth'

export type LoginFormField = z.infer<typeof loginFormSchema>
