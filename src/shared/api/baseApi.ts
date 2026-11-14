import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import {
  API_V1_URL,
  BASE_URL,
  ENDPOINTS_WITH_REFRESH,
  ROUTES,
  getLocalizedRoute,
} from '@/shared/constants'
import { Mutex } from 'async-mutex'
import { DEFAULT_LOCALE } from '@/shared/i18n/config'
import { getLocaleFromPathname } from '@/shared/i18n/routing'
import { isPrivateRoute } from '@/shared/lib/isPrivateRoute'

type RefreshResponse = {
  accessToken: string
}

const mutex = new Mutex()
const isBrowser = () => typeof window !== 'undefined'

const prepareAuthHeaders = (headers: Headers) => {
  if (!isBrowser()) {
    return headers
  }

  const token = localStorage.getItem('accessToken')

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return headers
}

const mainBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NODE_ENV === 'development' ? '' : BASE_URL,
  credentials: 'include',
  prepareHeaders: prepareAuthHeaders,
})

const clearSessionAndRedirect = async () => {
  const { clearAuthHintCookie } = await import('@/shared/lib/authHintCookie')
  clearAuthHintCookie()

  if (!isBrowser()) {
    return
  }

  localStorage.removeItem('accessToken')

  const pathname = window.location.pathname

  if (isPrivateRoute(pathname)) {
    const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE
    window.location.href = getLocalizedRoute(locale, ROUTES.login)
  }
}

export const withReauth =
  (
    query: BaseQueryFn<FetchArgs | string, unknown, FetchBaseQueryError>,
  ): BaseQueryFn<FetchArgs | string, unknown, FetchBaseQueryError> =>
  async (args, api, extraOptions) => {
    await mutex.waitForUnlock()

    let result = await query(args, api, extraOptions)

    if (result.error && result.error.status === 401) {
      const shouldRefresh = ENDPOINTS_WITH_REFRESH.has(api.endpoint)

      if (shouldRefresh) {
        if (!mutex.isLocked()) {
          const release = await mutex.acquire()
          try {
            const refreshResult = (await mainBaseQuery(
              { url: `${API_V1_URL}/auth/refresh-token`, method: 'POST' },
              api,
              extraOptions,
            )) as { data?: RefreshResponse }

            if ('data' in refreshResult && refreshResult.data) {
              const { accessToken } = refreshResult.data

              if (isBrowser()) {
                localStorage.setItem('accessToken', accessToken)
              }

              result = await query(args, api, extraOptions)
            } else {
              await clearSessionAndRedirect()
            }
          } catch (error) {
            console.error('[refresh-token] ' + error)
          } finally {
            release()
          }
        } else {
          await mutex.waitForUnlock()
          result = await query(args, api, extraOptions)
        }
      }
    }

    return result
  }

export const baseQueryWithReauth = withReauth(mainBaseQuery)

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Sessions',
    'UserPosts',
    'Profile',
    'Billing',
    'Post',
    'Comments',
    'Conversations',
    'Messages',
    'Notifications',
    'Followers',
  ],
  endpoints: () => ({}),
})
