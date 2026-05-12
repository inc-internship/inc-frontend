'use client'

import type { InfiniteData } from '@reduxjs/toolkit/query'
import type { Post } from '@/entities/post'
import type { ResponseGetUserPosts } from '@/entities/post/api/post.types'
import { useCreatePostMutation, useUploadImagesMutation } from '@/entities/post'
import { postApi } from '@/entities/post/api/post.api'
import { selectUser } from '@/entities/user/user.slice'
import { useAppDispatch, useAppSelector } from '@/shared/store'
import type { AddPostImageSlide } from './cropTypes'
import { API_URLS } from '@/shared/constants'

type PublishArgs = {
  description: string
  slides: AddPostImageSlide[]
}

const resolveOptimisticImageUrl = (slide: AddPostImageSlide) => {
  if (typeof slide.displaySrc === 'string') {
    return slide.displaySrc
  }

  if (slide.displaySrc) {
    return slide.displaySrc.src
  }

  return typeof slide.src === 'string' ? slide.src : slide.src.src
}

const insertOptimisticPost = (
  draft: InfiniteData<ResponseGetUserPosts, string | null>,
  optimisticPost: Post,
) => {
  if (!draft.pages.length) {
    draft.pages.push({
      items: [optimisticPost],
      nextCursor: null,
      hasNextPage: false,
    })
    draft.pageParams.push(null)

    return
  }

  draft.pages[0].items.unshift(optimisticPost)
}

const replaceOptimisticPostId = (
  draft: InfiniteData<ResponseGetUserPosts, string | null>,
  tempPostId: string,
  createdPostId: string,
) => {
  draft.pages.forEach(page => {
    const post = page.items.find((item: Post) => item.id === tempPostId)

    if (post) {
      post.id = createdPostId
    }
  })
}

export const usePublishPost = () => {
  const dispatch = useAppDispatch()
  const [uploadImages, uploadState] = useUploadImagesMutation()
  const [createPost, createState] = useCreatePostMutation()
  const user = useAppSelector(selectUser)

  const isUnauthorizedError = (error: unknown): error is { status: number } => {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      typeof (error as { status?: unknown }).status === 'number' &&
      (error as { status: number }).status === 401
    )
  }

  const refreshAccessToken = async () => {
    const response = await fetch(`${API_URLS.v1}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Refresh token request failed')
    }

    const data = (await response.json()) as { accessToken?: string }

    if (!data.accessToken) {
      throw new Error('Refresh token response has no access token')
    }

    localStorage.setItem('accessToken', data.accessToken)
  }

  const publishPost = async ({ description, slides }: PublishArgs) => {
    if (!user) {
      throw new Error('User is not initialized')
    }

    const trimmedDescription = description.trim()
    const files = slides.map(slide => slide.file).filter((file): file is File => Boolean(file))

    if (!files.length) {
      throw new Error('No files to upload')
    }

    const tempPostId = `temp-post-${crypto.randomUUID()}`
    const optimisticPost: Post = {
      id: tempPostId,
      description: trimmedDescription,
      images: slides.map((slide, index) => ({
        id: `temp-image-${index}`,
        url: resolveOptimisticImageUrl(slide),
        width: 228,
        height: 228,
      })),
      owner: {
        id: user.publicId,
        login: user.login,
      },
    }
    const patchResult = dispatch(
      postApi.util.updateQueryData('getUserPosts', { userId: user.publicId }, draft =>
        insertOptimisticPost(draft, optimisticPost),
      ),
    )

    const executeUpload = async () => {
      const formData = new FormData()

      files.forEach(file => {
        formData.append('files', file)
      })

      return uploadImages(formData).unwrap()
    }

    try {
      await refreshAccessToken()
    } catch {}

    let uploadResult

    try {
      uploadResult = await executeUpload()
    } catch (error) {
      if (!isUnauthorizedError(error)) {
        patchResult.undo()
        throw error
      }

      try {
        await refreshAccessToken()
        uploadResult = await executeUpload()
      } catch (retryError) {
        patchResult.undo()
        throw retryError
      }
    }

    if (!uploadResult.ids.length) {
      patchResult.undo()
      throw new Error('Upload failed: no uploaded ids')
    }

    try {
      const createdPost = await createPost({
        description: trimmedDescription,
        uploadIds: uploadResult.ids,
      }).unwrap()

      dispatch(
        postApi.util.updateQueryData('getUserPosts', { userId: user.publicId }, draft =>
          replaceOptimisticPostId(draft, tempPostId, createdPost.id),
        ),
      )

      return createdPost
    } catch (error) {
      if (!isUnauthorizedError(error)) {
        patchResult.undo()
        throw error
      }

      await refreshAccessToken()

      try {
        const createdPost = await createPost({
          description: trimmedDescription,
          uploadIds: uploadResult.ids,
        }).unwrap()

        dispatch(
          postApi.util.updateQueryData('getUserPosts', { userId: user.publicId }, draft =>
            replaceOptimisticPostId(draft, tempPostId, createdPost.id),
          ),
        )

        return createdPost
      } catch (retryError) {
        patchResult.undo()
        throw retryError
      }
    }
  }

  return {
    publishPost,
    isLoading: uploadState.isLoading || createState.isLoading,
    error: uploadState.error ?? createState.error,
  }
}
