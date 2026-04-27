import { z } from 'zod'
import { BASE_REDIRECT_URL } from '@/shared/constants'

export const MAIN_PAGE_REVALIDATE_SECONDS = 60

const TOTAL_COUNT_ENDPOINT = '/users/total-count'
const MAIN_PAGE_POSTS_LIMIT = 4
const LATEST_POSTS_ENDPOINT = `/posts/latest?limit=${MAIN_PAGE_POSTS_LIMIT}`
const MAIN_PAGE_API_URL = `${BASE_REDIRECT_URL}/api/v1`

const totalUsersSchema = z.object({
  totalCount: z.number().nonnegative(),
})

const mainPagePostSchema = z.object({
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

type MainPageData = {
  totalUsers: number
  latestPosts: MainPagePost[]
}

const fetchValidatedData = async <T>(
  endpoint: string,
  schema: z.ZodSchema<T>,
): Promise<T | null> => {
  try {
    const response = await fetch(`${MAIN_PAGE_API_URL}${endpoint}`, {
      next: { revalidate: MAIN_PAGE_REVALIDATE_SECONDS },
    })

    if (!response.ok) {
      return null
    }

    const rawData: unknown = await response.json()
    const result = schema.safeParse(rawData)

    if (!result.success) {
      return null
    }

    return result.data
  } catch {
    return null
  }
}

export const getMainPageData = async (): Promise<MainPageData> => {
  const [totalUsersResponse, latestPostsResponse] = await Promise.all([
    fetchValidatedData(TOTAL_COUNT_ENDPOINT, totalUsersSchema),
    fetchValidatedData(LATEST_POSTS_ENDPOINT, z.array(mainPagePostSchema)),
  ])

  return {
    totalUsers: totalUsersResponse?.totalCount ?? 0,
    latestPosts: latestPostsResponse ?? [],
  }
}
