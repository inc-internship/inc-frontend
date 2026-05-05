import { z } from 'zod'
import { BASE_REDIRECT_URL } from '@/shared/constants'
import { mainPagePostSchema, totalUsersSchema, type MainPagePost } from './mainPage.schemas'

export const MAIN_PAGE_REVALIDATE_SECONDS = 60

const TOTAL_COUNT_ENDPOINT = '/users/total-count'
const MAIN_PAGE_POSTS_LIMIT = 4
const LATEST_POSTS_ENDPOINT = `/posts/latest?limit=${MAIN_PAGE_POSTS_LIMIT}`
const MAIN_PAGE_API_URL = `${BASE_REDIRECT_URL}/api/v1`

export type { MainPagePost }

type MainPageData = {
  totalUsers: number
  latestPosts: MainPagePost[]
}

const LOG_PREFIX = '[main-page-data]'

const fetchValidatedData = async <T>(
  endpoint: string,
  schema: z.ZodSchema<T>,
): Promise<T | null> => {
  try {
    const response = await fetch(`${MAIN_PAGE_API_URL}${endpoint}`, {
      next: { revalidate: MAIN_PAGE_REVALIDATE_SECONDS },
    })

    if (!response.ok) {
      console.error(`${LOG_PREFIX} request failed`, {
        endpoint,
        status: response.status,
        statusText: response.statusText,
      })
      return null
    }

    const rawData: unknown = await response.json()
    const result = schema.safeParse(rawData)

    if (!result.success) {
      console.error(`${LOG_PREFIX} response validation failed`, {
        endpoint,
        issues: result.error.issues,
      })
      return null
    }

    return result.data
  } catch (error) {
    console.error(`${LOG_PREFIX} request error`, { endpoint, error })
    return null
  }
}

export const getMainPageData = async (): Promise<MainPageData> => {
  const [totalUsersResult, latestPostsResult] = await Promise.allSettled([
    fetchValidatedData(TOTAL_COUNT_ENDPOINT, totalUsersSchema),
    fetchValidatedData(LATEST_POSTS_ENDPOINT, z.array(mainPagePostSchema)),
  ])

  const totalUsersResponse = totalUsersResult.status === 'fulfilled' ? totalUsersResult.value : null
  const latestPostsResponse =
    latestPostsResult.status === 'fulfilled' ? latestPostsResult.value : null

  if (totalUsersResult.status === 'rejected') {
    console.error(`${LOG_PREFIX} total users promise rejected`, totalUsersResult.reason)
  }

  if (latestPostsResult.status === 'rejected') {
    console.error(`${LOG_PREFIX} latest posts promise rejected`, latestPostsResult.reason)
  }

  if (latestPostsResult.status === 'rejected' || latestPostsResponse === null) {
    console.error(`${LOG_PREFIX} failed to fetch latest posts, rendering empty state`)
  }

  return {
    totalUsers: totalUsersResponse?.totalCount ?? 0,
    latestPosts: latestPostsResponse ?? [],
  }
}
