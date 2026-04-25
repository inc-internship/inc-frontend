import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import {
  DeleteUserPost,
  GetUserPostsArgs,
  ResponseGetUserPosts,
  UpdateUserPost,
} from './post.types'

export const postApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getUserPosts: build.query<ResponseGetUserPosts, GetUserPostsArgs>({
      query: ({ userId }) => ({
        url: `${API_V1_URL}/posts/user/${userId}`,
      }),
    }),
    updatePost: build.mutation<void, UpdateUserPost>({
      query: ({ postId, description }) => ({
        url: `${API_V1_URL}/posts/${postId}`,
        method: 'put',
        body: { description },
      }),
    }),
    deletePost: build.mutation<void, DeleteUserPost>({
      query: ({ postId }) => ({
        url: `${API_V1_URL}/posts/${postId}`,
        method: 'delete',
      }),
    }),
  }),
})

export const { useGetUserPostsQuery, useUpdatePostMutation, useDeletePostMutation } = postApi
