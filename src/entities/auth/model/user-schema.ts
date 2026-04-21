import { z } from 'zod'

export const meSchema = z.object({
  publicId: z.string(),
  login: z.string(),
  email: z.email(),
})

export type MeData = z.infer<typeof meSchema>
