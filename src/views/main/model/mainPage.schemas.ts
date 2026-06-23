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
  owner: z
    .object({
      id: z.string(),
      login: z.string(),
      avatar: z
        .object({
          url: z.string(),
          width: z.number(),
          height: z.number(),
          fileSize: z.number().optional(),
        })
        .nullable()
        .optional(),
    })
    .transform(owner => ({
      id: owner.id,
      login: owner.login,
      avatarUrl: owner.avatar?.url ?? null,
    })),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type MainPagePost = z.infer<typeof mainPagePostSchema>
