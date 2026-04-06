import { z } from 'zod/v4'

export const resendConfirmationSchema = z.object({
  email: z.email('The email must match the format example@example.com'),
})
