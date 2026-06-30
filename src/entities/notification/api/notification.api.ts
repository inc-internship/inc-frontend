import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import { GetNotificationsResponse } from '@/entities/notification/api/notification.types'

export const notificationApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getNotifications: build.infiniteQuery<GetNotificationsResponse, void, string | null>({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: lastPage => (lastPage.hasNextPage ? lastPage.nextCursor : undefined),
      },
      query: ({ pageParam }) => ({
        url: `${API_V1_URL}/notifications`,
        params: pageParam ? { cursor: pageParam } : undefined,
      }),
    }),
  }),
})

export const { useGetNotificationsInfiniteQuery } = notificationApi
