import { cache } from 'react'
import { SERVER_API_V1_URL } from '@/shared/constants'
import type { Post, ResponseGetUserPosts } from './post.types'

const LOG_PREFIX = '[post-server]'

const EMPTY_USER_POSTS: ResponseGetUserPosts = { items: [], nextCursor: null, hasNextPage: false }

export const fetchPost = cache(async (postId: string): Promise<Post | null> => {
  const url = `${SERVER_API_V1_URL}/posts/${postId}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      console.error(`${LOG_PREFIX} fetchPost failed`, { url, status: response.status })
      return null
    }

    return response.json()
  } catch (error) {
    console.error(`${LOG_PREFIX} fetchPost error`, { url, error })
    return null
  }
})

export const fetchUserPosts = cache(async (userId: string): Promise<ResponseGetUserPosts> => {
  const url = `${SERVER_API_V1_URL}/posts/user/${userId}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      console.error(`${LOG_PREFIX} fetchUserPosts failed`, { url, status: response.status })
      return EMPTY_USER_POSTS
    }

    return response.json()
  } catch (error) {
    console.error(`${LOG_PREFIX} fetchUserPosts error`, { url, error })
    return EMPTY_USER_POSTS
  }
})
