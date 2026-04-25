import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import { ResponseGetUserPosts } from './post.types'

export const postApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getUserPosts: build.infiniteQuery<ResponseGetUserPosts, { userId: string }, string | null>({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
      },
      query: ({ queryArg, pageParam }) => ({
        url: `${API_V1_URL}/posts/user/${queryArg.userId}`,
        params: pageParam ? { cursor: pageParam } : undefined,
      }),
    }),
  }),
})

export const { useGetUserPostsInfiniteQuery } = postApi
