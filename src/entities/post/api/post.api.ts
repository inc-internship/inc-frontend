import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import { CreatePostRequest, CreatePostResponse, GetLikesResponse } from './post.types'
import type {
  ResponseGetUserPosts,
  UploadImagesResponseType,
  DeleteUserPost,
  UpdateUserPost,
} from './post.types'
import type { MeData } from '@/entities/auth'
import { selectUser } from '@/entities/user/user.slice'
import { getApiErrorMessage } from '@/shared/api/lib/getApiErrorMessage'
import { toast } from 'react-toastify'

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
      invalidatesTags: (result, error, { userId }) =>
        error ? [] : [{ type: 'UserPosts', id: userId }],
    }),
    getLikes: build.infiniteQuery<GetLikesResponse, { postId: string }, string | null>({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
      },
      query: ({ queryArg, pageParam }) => ({
        url: `${API_V1_URL}/posts/${queryArg.postId}/likes`,
        params: pageParam ? { cursor: pageParam } : undefined,
      }),
      providesTags: (result, error, { postId }) =>
        result ? [{ type: 'PostLikes', id: postId }] : [],
    }),
    likePost: build.mutation<void, { postId: string; user: Pick<MeData, 'publicId' | 'login'> }>({
      query: ({ postId }) => ({
        url: `${API_V1_URL}/posts/${postId}/likes`,
        method: 'POST',
      }),
      async onQueryStarted({ postId, user }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postApi.util.updateQueryData('getLikes', { postId }, draft => {
            const firstPage = draft.pages[0]
            if (firstPage && !firstPage.items.some(item => item.id === user.publicId)) {
              firstPage.items.unshift({
                id: user.publicId,
                login: user.login,
                avatarUrl: '',
                likedAt: new Date().toISOString(),
              })
            }
          }),
        )
        try {
          await queryFulfilled
        } catch (error) {
          patchResult.undo()
          const message = getApiErrorMessage(error, 'Не удалось поставить лайк')
          toast.error(message)
        }
      },
      invalidatesTags: (result, error, { postId }) => [{ type: 'PostLikes', id: postId }],
    }),
    unlikePost: build.mutation<void, { postId: string; user: Pick<MeData, 'publicId' | 'login'> }>({
      query: ({ postId }) => ({
        url: `${API_V1_URL}/posts/${postId}/likes`,
        method: 'DELETE',
      }),
      async onQueryStarted({ postId, user }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postApi.util.updateQueryData('getLikes', { postId }, draft => {
            const firstPage = draft.pages[0]
            if (firstPage) {
              firstPage.items = firstPage.items.filter(item => item.id !== user.publicId)
            }
          }),
        )
        try {
          await queryFulfilled
        } catch (error) {
          patchResult.undo()
          const message = getApiErrorMessage(error, 'Не удалось далить лайк')
          toast.error(message)
        }
      },
      invalidatesTags: (result, error, { postId }) => [{ type: 'PostLikes', id: postId }],
    }),
    likeComment: build.mutation<void, { postId: string; commentId: string }>({
      query: ({ postId, commentId }) => ({
        url: `${API_V1_URL}/posts/${postId}/comments/${commentId}/likes`,
        method: 'POST',
      }),

      invalidatesTags: (result, error, { commentId }) => [{ type: 'CommentLikes', id: commentId }],
    }),
    unlikeComment: build.mutation<void, { postId: string; commentId: string }>({
      query: ({ postId, commentId }) => ({
        url: `${API_V1_URL}/posts/${postId}/comments/${commentId}/likes`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { commentId }) => [{ type: 'CommentLikes', id: commentId }],
    }),
  }),
})

export const {
  useGetUserPostsInfiniteQuery,
  useUploadImagesMutation,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetLikesInfiniteQuery,
  useLikePostMutation,
  useUnlikePostMutation,
  useLikeCommentMutation,
  useUnlikeCommentMutation,
} = postApi
