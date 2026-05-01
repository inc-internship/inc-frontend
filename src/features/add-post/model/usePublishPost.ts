'use client'

import { useCreatePostMutation, useUploadImagesMutation } from '@/entities/post'
import { API_V1_URL } from '@/shared/constants'
import type { AddPostImageSlide } from './cropTypes'

type PublishArgs = {
  description: string
  slides: AddPostImageSlide[]
}

export const usePublishPost = () => {
  const [uploadImages, uploadState] = useUploadImagesMutation()
  const [createPost, createState] = useCreatePostMutation()

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
    const response = await fetch(`${API_V1_URL}/auth/refresh-token`, {
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
    const files = slides.map(slide => slide.file).filter((file): file is File => Boolean(file))

    if (!files.length) {
      throw new Error('No files to upload')
    }

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
        throw error
      }

      await refreshAccessToken()
      uploadResult = await executeUpload()
    }

    if (!uploadResult.ids.length) {
      throw new Error('Upload failed: no uploaded ids')
    }

    try {
      return await createPost({
        description: description.trim(),
        uploadIds: uploadResult.ids,
      }).unwrap()
    } catch (error) {
      if (!isUnauthorizedError(error)) {
        throw error
      }

      await refreshAccessToken()

      return createPost({
        description: description.trim(),
        uploadIds: uploadResult.ids,
      }).unwrap()
    }
  }

  return {
    publishPost,
    isLoading: uploadState.isLoading || createState.isLoading,
    error: uploadState.error ?? createState.error,
  }
}
