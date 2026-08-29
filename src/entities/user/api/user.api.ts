import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import { UserSearchRequest, UserSearchResponse, User } from '@/entities/user'

export const userApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getUsers: build.query<UserSearchResponse, UserSearchRequest>({
      query: ({ username, cursor }) => ({
        url: `${API_V1_URL}/users/search`,
        params: {
          username,
          ...(cursor ? { cursor } : {}),
        },
      }),
      serializeQueryArgs: ({ queryArgs }) => {
        return `${queryArgs.username}`
      },
      merge: (currentCache, newItems) => {
        if (newItems.items) {
          currentCache.items.push(...newItems.items)
        }
        currentCache.nextCursor = newItems.nextCursor
        currentCache.hasNextPage = newItems.hasNextPage
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.cursor !== previousArg?.cursor
      },
    }),
  }),
})

export const { useGetUsersQuery } = userApi
