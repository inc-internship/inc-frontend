import { z } from 'zod'
import { meSchema } from '@/entities/auth/model/user-schema'

export type MeData = z.infer<typeof meSchema>
