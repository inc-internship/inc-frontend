import z from 'zod/v4'

export const forgotPasswordFormSchema = z.object({
  email: z.email(),
})
