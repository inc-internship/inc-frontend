import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import {
  UserSearchRequest,
  UserSearchResponse,
  User,
  FollowListResponse,
  FollowListRequest,
} from '@/entities/user'

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
    followUser: build.mutation<void, { userId: string }>({
      query: ({ userId }) => ({
        url: `${API_V1_URL}/users/${userId}/follow`,
        method: 'POST',
      }),
    }),
    unfollowUser: build.mutation<void, { userId: string }>({
      query: ({ userId }) => ({
        url: `${API_V1_URL}/users/${userId}/follow`,
        method: 'DELETE',
      }),
    }),
    getFollowers: build.query<FollowListResponse, FollowListRequest>({
      query: ({ userId, cursor }) => ({
        url: `${API_V1_URL}/users/${userId}/followers`,
        params: {
          ...(cursor ? { cursor } : {}),
        },
      }),
      serializeQueryArgs: ({ queryArgs }) => {
        return `${queryArgs.userId}`
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
    getFollowing: build.query<FollowListResponse, FollowListRequest>({
      query: ({ userId, cursor }) => ({
        url: `${API_V1_URL}/users/${userId}/following`,
        params: {
          ...(cursor ? { cursor } : {}),
        },
      }),
      serializeQueryArgs: ({ queryArgs }) => {
        return `${queryArgs.userId}`
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

export const {
  useGetUsersQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetFollowersQuery,
  useGetFollowingQuery,
} = userApi
