import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import { CreatePostRequest, CreatePostResponse } from './post.types'
import type { ResponseGetUserPosts, UploadImagesResponseType } from './post.types'

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
    uploadImages: build.mutation<UploadImagesResponseType, FormData>({
      query: body => ({
        url: `${API_V1_URL}/posts/upload-images`,
        method: 'post',
        body,
      }),
    }),
    createPost: build.mutation<CreatePostResponse, CreatePostRequest>({
      query: ({ description, uploadIds }) => ({
        url: `${API_V1_URL}/posts`,
        method: 'post',
        body: { description, uploadIds },
      }),
    }),
  }),
})

export const { useGetUserPostsInfiniteQuery, useUploadImagesMutation, useCreatePostMutation } =
  postApi
