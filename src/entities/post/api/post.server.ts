import { cache } from 'react'
import { SERVER_API_V1_URL } from '@/shared/constants'
import type { Post, ResponseGetUserPosts } from './post.types'

export const fetchPost = cache(async (postId: string): Promise<Post | null> => {
  const response = await fetch(`${SERVER_API_V1_URL}/posts/${postId}`)

  if (!response.ok) return null

  return response.json()
})

export const fetchUserPosts = cache(async (userId: string): Promise<ResponseGetUserPosts> => {
  const response = await fetch(`${SERVER_API_V1_URL}/posts/user/${userId}`)

  return response.json()
})
