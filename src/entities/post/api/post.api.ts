import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import { CreatePostRequest, CreatePostResponse } from './post.types'
import type {
  ResponseGetUserPosts,
  UploadImagesResponseType,
  DeleteUserPost,
  UpdateUserPost,
} from './post.types'

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
      providesTags: (result, error, { userId }) =>
        result ? [{ type: 'UserPosts', id: userId }] : [],
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
    updatePost: build.mutation<void, UpdateUserPost>({
      query: ({ postId, description }) => ({
        url: `${API_V1_URL}/posts/${postId}`,
        method: 'put',
        body: { description },
      }),
      async onQueryStarted({ postId, userId, description }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postApi.util.updateQueryData('getUserPosts', { userId }, draft => {
            for (const page of draft.pages) {
              const post = page.items.find(p => p.id === postId)
              if (post) {
                post.description = description
                break
              }
            }
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
    deletePost: build.mutation<void, DeleteUserPost>({
      query: ({ postId }) => ({
        url: `${API_V1_URL}/posts/${postId}`,
        method: 'delete',
      }),
      async onQueryStarted({ postId, userId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postApi.util.updateQueryData('getUserPosts', { userId }, draft => {
            draft.pages.forEach(page => {
              page.items = page.items.filter(post => post.id !== postId)
            })
          }),
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (result, error, { userId }) => [{ type: 'UserPosts', id: userId }],
    }),
  }),
})

export const {
  useGetUserPostsInfiniteQuery,
  useUploadImagesMutation,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postApi
