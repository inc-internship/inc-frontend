import { ProfilePage } from '@/views/profile'
import { Metadata } from 'next'
import { BASE_REDIRECT_URL } from '@/shared/constants'
import { Post, ResponseGetUserPosts } from '@/entities/post/api/post.types'
import { cache } from 'react'

type Props = {
  params: Promise<{ id: string; lang: string }>
  searchParams: Promise<{ postId: string }>
}

const PROFILE_API_URL = `${BASE_REDIRECT_URL}/api/v1`

const isUserPostsResponse = (value: unknown): value is ResponseGetUserPosts => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const data = value as Partial<ResponseGetUserPosts>

  return (
    Array.isArray(data.items) &&
    (typeof data.nextCursor === 'string' || data.nextCursor === null) &&
    typeof data.hasNextPage === 'boolean'
  )
}

const getUserPosts = cache(async (id: string): Promise<ResponseGetUserPosts | null> => {
  try {
    const response = await fetch(`${PROFILE_API_URL}/posts/user/${id}`)

    if (!response.ok) {
      console.error('[profile-page] failed to fetch user posts', {
        status: response.status,
        statusText: response.statusText,
      })

      return null
    }

    const data: unknown = await response.json()

    if (!isUserPostsResponse(data)) {
      console.error('[profile-page] invalid user posts response')

      return null
    }

    return data
  } catch (error) {
    console.error('[profile-page] user posts request error', error)

    return null
  }
})

const getUserPost = cache(async (postId: string): Promise<Post | null> => {
  const response = await fetch(`${BASE_REDIRECT_URL}/api/v1/posts/${postId}`)

  if (!response.ok) return null

  return response.json()
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id
  const postsData = await getUserPosts(id)

  return {
    title: `Profile ${postsData?.items[0]?.owner?.login ?? 'page'}`,
  }
}

export default async function Profile(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams

  const postsData = await getUserPosts(params.id)

  const selectedPost = searchParams.postId ? await getUserPost(searchParams.postId) : null
  const selectedOwnerPost = selectedPost?.owner.id === params.id ? selectedPost : null

  return (
    <ProfilePage userId={params.id} postsData={postsData} initialSelectedPost={selectedOwnerPost} />
  )
}
