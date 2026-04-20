import { z } from 'zod'

export const sessionSchema = z.object({
  ip: z.string(),
  lastActive: z.string().datetime(),
  deviceId: z.string().uuid(),
  deviceName: z.string(),
  browserName: z.string(),
  browserVersion: z.string(),
  osName: z.string(),
  isCurrent: z.boolean(),
})

export const getSessionsResponseSchema = z.array(sessionSchema)

export type Session = z.infer<typeof sessionSchema>
export type GetSessionsResponse = z.infer<typeof getSessionsResponseSchema>
