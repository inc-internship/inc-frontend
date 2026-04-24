import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import type { CreatePostRequest, CreatePostResponse, UploadImagesResponseType } from './post.types'

export const postApi = baseApi.injectEndpoints({
  endpoints: build => ({
    uploadImages: build.mutation<UploadImagesResponseType, FormData>({
      query: body => ({
        url: `${API_V1_URL}/posts/upload-images`,
        method: 'post',
        body,
      }),
    }),
    createPost: build.mutation<CreatePostResponse, CreatePostRequest>({
      query: body => ({
        url: `${API_V1_URL}/posts`,
        method: 'post',
        body,
      }),
    }),
  }),
})

export const { useUploadImagesMutation, useCreatePostMutation } = postApi
