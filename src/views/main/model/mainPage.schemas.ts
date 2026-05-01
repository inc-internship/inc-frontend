import { z } from 'zod'

export const totalUsersSchema = z.object({
  totalCount: z.number().nonnegative(),
})

export const mainPagePostSchema = z.object({
  id: z.string(),
  description: z
    .string()
    .nullish()
    .transform(value => value ?? ''),
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
    }),
  ),
  owner: z.object({
    id: z.string(),
    login: z.string(),
    avatarUrl: z.string().nullish(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type MainPagePost = z.infer<typeof mainPagePostSchema>
