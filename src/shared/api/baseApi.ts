import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { API_V1_URL, BASE_URL, ENDPOINTS_WITH_REFRESH } from '@/shared/constants'
import { Mutex } from 'async-mutex'

type RefreshResponse = {
  accessToken: string
}

type BaseApiState = {
  auth?: {
    accessToken?: string | null
  }
}

const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, api) => {
    const token = (api.getState() as BaseApiState).auth?.accessToken

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
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    console.log('401 detected')

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

            localStorage.setItem('accessToken', accessToken)

            result = await baseQuery(args, api, extraOptions)
          } else {
            localStorage.removeItem('accessToken')
            window.location.href = '/login'
          }
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
  endpoints: () => ({}),
})
