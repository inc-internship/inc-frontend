import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import { GetUserPostsArgs, ResponseGetUserPosts } from './post.types'

export const postApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getUserPosts: build.query<ResponseGetUserPosts, GetUserPostsArgs>({
      query: ({ userId }) => ({
        url: `${API_V1_URL}/posts/user/${userId}`,
      }),
    }),
  }),
})

export const { useGetUserPostsQuery } = postApi
