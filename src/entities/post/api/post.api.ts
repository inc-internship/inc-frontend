import { baseApi } from '@/shared/api'
import { API_V1_URL } from '@/shared/constants'
import type { InfiniteData } from '@reduxjs/toolkit/query'
import { CreatePostRequest, CreatePostResponse } from './post.types'
import type {
  CreatedCommentResponse,
  CreateCommentRequest,
  ResponseGetUserPosts,
  ResponseGetPostComments,
  UploadImagesResponseType,
  DeleteUserPost,
  GetCommentRepliesArgs,
  GetPostCommentsArgs,
  GetUserPostsArgs,
  PostComment,
  ReplyToCommentRequest,
  ToggleCommentLikeRequest,
  UpdateUserPost,
} from './post.types'

const createTemporaryId = (prefix: string) => {
  const id =
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`

  return `${prefix}-${id}`
}

const getPostCommentsTag = (postId: string) => ({ type: 'Comments' as const, id: `POST-${postId}` })

const getCommentRepliesTag = (commentId: string) => ({
  type: 'Comments' as const,
  id: `COMMENT-${commentId}`,
})

const createOptimisticComment = ({
  id,
  text,
  author,
}: Pick<PostComment, 'id' | 'text' | 'author'>): PostComment => {
  const currentDate = new Date().toISOString()

  return {
    id,
    text,
    author,
    likesCount: 0,
    repliesCount: 0,
    isLiked: false,
    isOwn: true,
    createdAt: currentDate,
    updatedAt: currentDate,
  }
}

const insertOptimisticComment = (
  draft: InfiniteData<ResponseGetPostComments, string | null>,
  comment: PostComment,
) => {
  if (!draft.pages.length) {
    draft.pages.push({
      items: [comment],
      nextCursor: null,
      hasNextPage: false,
    })
    draft.pageParams.push(null)

    return
  }

  draft.pages[0].items.unshift(comment)
}

const replaceOptimisticCommentId = (
  draft: InfiniteData<ResponseGetPostComments, string | null>,
  tempCommentId: string,
  createdCommentId: string,
) => {
  draft.pages.forEach(page => {
    const comment = page.items.find(item => item.id === tempCommentId)

    if (comment) {
      comment.id = createdCommentId
    }
  })
}

const updateCommentLike = (
  draft: InfiniteData<ResponseGetPostComments, string | null>,
  commentId: string,
  isLiked: boolean,
) => {
  for (const page of draft.pages) {
    const comment = page.items.find(item => item.id === commentId)

    if (!comment) {
      continue
    }

    if (comment.isLiked === isLiked) {
      return
    }

    comment.isLiked = isLiked
    comment.likesCount = Math.max(0, comment.likesCount + (isLiked ? 1 : -1))
    return
  }
}

const updateCommentRepliesCount = (
  draft: InfiniteData<ResponseGetPostComments, string | null>,
  commentId: string,
  delta: number,
) => {
  for (const page of draft.pages) {
    const comment = page.items.find(item => item.id === commentId)

    if (!comment) {
      continue
    }

    comment.repliesCount = Math.max(0, comment.repliesCount + delta)
    break
  }
}

const createCommentsInfiniteData = (
  comment: PostComment,
): InfiniteData<ResponseGetPostComments, string | null> => ({
  pages: [
    {
      items: [comment],
      nextCursor: null,
      hasNextPage: false,
    },
  ],
  pageParams: [null],
})

const removeCommentById = (
  draft: InfiniteData<ResponseGetPostComments, string | null>,
  commentId: string,
) => {
  draft.pages.forEach(page => {
    page.items = page.items.filter(comment => comment.id !== commentId)
  })
}

export const postApi = baseApi.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === 'development',
  endpoints: build => ({
    getUserPosts: build.infiniteQuery<ResponseGetUserPosts, GetUserPostsArgs, string | null>({
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
    getPostComments: build.infiniteQuery<
      ResponseGetPostComments,
      GetPostCommentsArgs,
      string | null
    >({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: lastPage => (lastPage.hasNextPage ? lastPage.nextCursor : undefined),
      },
      query: ({ queryArg, pageParam }) => ({
        url: `${API_V1_URL}/posts/${queryArg.postId}/comments`,
        params: pageParam ? { cursor: pageParam } : undefined,
      }),
      providesTags: (result, error, { postId }) => [getPostCommentsTag(postId)],
    }),
    getCommentReplies: build.infiniteQuery<
      ResponseGetPostComments,
      GetCommentRepliesArgs,
      string | null
    >({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: lastPage => (lastPage.hasNextPage ? lastPage.nextCursor : undefined),
      },
      query: ({ queryArg, pageParam }) => ({
        url: `${API_V1_URL}/posts/${queryArg.postId}/comments/${queryArg.commentId}/replies`,
        params: pageParam ? { cursor: pageParam } : undefined,
      }),
      providesTags: (result, error, { commentId }) => [getCommentRepliesTag(commentId)],
    }),
    createComment: build.mutation<CreatedCommentResponse, CreateCommentRequest>({
      query: ({ postId, text }) => ({
        url: `${API_V1_URL}/posts/${postId}/comments`,
        method: 'post',
        body: { text },
      }),
      async onQueryStarted({ postId, text, author }, { dispatch, queryFulfilled }) {
        const tempCommentId = createTemporaryId('temp-comment')
        const optimisticComment = createOptimisticComment({
          id: tempCommentId,
          text,
          author,
        })
        const patchResult = dispatch(
          postApi.util.updateQueryData('getPostComments', { postId }, draft =>
            insertOptimisticComment(draft, optimisticComment),
          ),
        )

        try {
          const { data } = await queryFulfilled

          dispatch(
            postApi.util.updateQueryData('getPostComments', { postId }, draft =>
              replaceOptimisticCommentId(draft, tempCommentId, data.id),
            ),
          )
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (result, error, { postId }) => (error ? [] : [getPostCommentsTag(postId)]),
    }),
    replyToComment: build.mutation<CreatedCommentResponse, ReplyToCommentRequest>({
      query: ({ postId, commentId, text }) => ({
        url: `${API_V1_URL}/posts/${postId}/comments/${commentId}/replies`,
        method: 'post',
        body: { text },
      }),
      async onQueryStarted(
        { postId, commentId, text, author },
        { dispatch, getState, queryFulfilled },
      ) {
        const tempCommentId = createTemporaryId('temp-reply')
        const optimisticComment = createOptimisticComment({
          id: tempCommentId,
          text,
          author,
        })
        const repliesArgs = { postId, commentId }
        const repliesQueryState =
          postApi.endpoints.getCommentReplies.select(repliesArgs)(getState())
        const hasRepliesCache = Boolean(repliesQueryState.data)
        let undoRepliesPatch: (() => void) | null = null

        if (hasRepliesCache) {
          const repliesPatchResult = dispatch(
            postApi.util.updateQueryData('getCommentReplies', repliesArgs, draft =>
              insertOptimisticComment(draft, optimisticComment),
            ),
          )

          undoRepliesPatch = repliesPatchResult.undo
        } else {
          dispatch(
            postApi.util.upsertQueryData(
              'getCommentReplies',
              repliesArgs,
              createCommentsInfiniteData(optimisticComment),
            ),
          )
        }
        const commentsPatchResult = dispatch(
          postApi.util.updateQueryData('getPostComments', { postId }, draft =>
            updateCommentRepliesCount(draft, commentId, 1),
          ),
        )

        try {
          const { data } = await queryFulfilled

          dispatch(
            postApi.util.updateQueryData('getCommentReplies', repliesArgs, draft =>
              replaceOptimisticCommentId(draft, tempCommentId, data.id),
            ),
          )
        } catch {
          if (undoRepliesPatch) {
            undoRepliesPatch()
          } else {
            dispatch(
              postApi.util.updateQueryData('getCommentReplies', repliesArgs, draft =>
                removeCommentById(draft, tempCommentId),
              ),
            )
          }
          commentsPatchResult.undo()
        }
      },
    }),
    toggleCommentLike: build.mutation<void, ToggleCommentLikeRequest>({
      query: ({ postId, commentId, isLiked }) => ({
        url: `${API_V1_URL}/posts/${postId}/comments/${commentId}/likes`,
        method: isLiked ? 'delete' : 'post',
      }),
      async onQueryStarted(
        { postId, commentId, isLiked, parentCommentId },
        { dispatch, queryFulfilled },
      ) {
        const nextIsLiked = !isLiked
        const patchResults = [
          dispatch(
            postApi.util.updateQueryData('getPostComments', { postId }, draft =>
              updateCommentLike(draft, commentId, nextIsLiked),
            ),
          ),
        ]

        if (parentCommentId) {
          patchResults.push(
            dispatch(
              postApi.util.updateQueryData(
                'getCommentReplies',
                { postId, commentId: parentCommentId },
                draft => updateCommentLike(draft, commentId, nextIsLiked),
              ),
            ),
          )
        }

        try {
          await queryFulfilled
        } catch {
          patchResults.forEach(patchResult => patchResult.undo())
        }
      },
    }),
  }),
})

export const {
  useGetUserPostsInfiniteQuery,
  useUploadImagesMutation,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostCommentsInfiniteQuery,
  useGetCommentRepliesInfiniteQuery,
  useCreateCommentMutation,
  useReplyToCommentMutation,
  useToggleCommentLikeMutation,
} = postApi
