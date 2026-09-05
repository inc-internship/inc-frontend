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
        if (!newItems.nextCursor || !currentCache.nextCursor) {
          currentCache.items = newItems.items
        } else {
          currentCache.items.push(...newItems.items)
        }
        currentCache.nextCursor = newItems.nextCursor
        currentCache.hasNextPage = newItems.hasNextPage
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.cursor !== previousArg?.cursor
      },
      providesTags: result =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    followUser: build.mutation<void, { userId: string; currentUserId?: string }>({
      query: ({ userId }) => ({
        url: `${API_V1_URL}/users/${userId}/follow`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { userId, currentUserId }) => [
        { type: 'User', id: userId },
        ...(currentUserId ? [{ type: 'User' as const, id: currentUserId }] : []),
      ],
    }),
    unfollowUser: build.mutation<void, { userId: string; currentUserId?: string }>({
      query: ({ userId }) => ({
        url: `${API_V1_URL}/users/${userId}/follow`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { userId, currentUserId }) => [
        { type: 'User', id: userId },
        ...(currentUserId ? [{ type: 'User' as const, id: currentUserId }] : []),
      ],
    }),
    getFollowers: build.query<FollowListResponse, FollowListRequest>({
      query: ({ userId, cursor }) => ({
        url: `${API_V1_URL}/users/${userId}/followers`,
        params: {
          ...(cursor ? { cursor } : {}),
        },
      }),
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        return `${endpointName}-${queryArgs.userId}`
      },
      merge: (currentCache, newItems, { arg }) => {
        if (!arg.cursor) {
          currentCache.items = newItems.items
        } else {
          if (newItems.items) {
            currentCache.items.push(...newItems.items)
          }
        }
        currentCache.nextCursor = newItems.nextCursor
        currentCache.hasNextPage = newItems.hasNextPage
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.cursor !== previousArg?.cursor
      },
      providesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
    }),
    getFollowing: build.query<FollowListResponse, FollowListRequest>({
      query: ({ userId, cursor }) => ({
        url: `${API_V1_URL}/users/${userId}/following`,
        params: {
          ...(cursor ? { cursor } : {}),
        },
      }),
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        return `${endpointName}-${queryArgs.userId}`
      },
      merge: (currentCache, newItems, { arg }) => {
        if (!arg.cursor) {
          currentCache.items = newItems.items
        } else {
          if (newItems.items) {
            currentCache.items.push(...newItems.items)
          }
        }
        currentCache.nextCursor = newItems.nextCursor
        currentCache.hasNextPage = newItems.hasNextPage
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.cursor !== previousArg?.cursor
      },
      providesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
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
