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

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NODE_ENV === 'development' ? '' : BASE_URL,
  credentials: 'include',
  prepareHeaders: headers => {
    if (!isBrowser()) {
      return headers
    }

    const token = localStorage.getItem('accessToken')

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  },
})

export const baseQueryWithReauth: BaseQueryFn<
  FetchArgs | string,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()

  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    const shouldRefresh = ENDPOINTS_WITH_REFRESH.has(api.endpoint)

    if (shouldRefresh) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire()
        try {
          const refreshResult = (await baseQuery(
            { url: `${API_V1_URL}/auth/refresh-token`, method: 'POST' },
            api,
            extraOptions,
          )) as { data?: RefreshResponse }

          if ('data' in refreshResult && refreshResult.data) {
            const { accessToken } = refreshResult.data as RefreshResponse

            if (isBrowser()) {
              localStorage.setItem('accessToken', accessToken)
            }

            result = await baseQuery(args, api, extraOptions)
          } else {
            const { clearAuthHintCookie } = await import('@/shared/lib/authHintCookie')
            clearAuthHintCookie()
            if (isBrowser()) {
              localStorage.removeItem('accessToken')

              const pathname = window.location.pathname

              if (isPrivateRoute(pathname)) {
                const locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE
                window.location.href = getLocalizedRoute(locale, ROUTES.login)
              }
            }
          }
        } catch (error) {
          console.error('[refresh-token] ' + error)
        } finally {
          release()
        }
      } else {
        await mutex.waitForUnlock()
        result = await baseQuery(args, api, extraOptions)
      }
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Sessions', 'UserPosts', 'Billing', 'Post'],
  endpoints: () => ({}),
})
