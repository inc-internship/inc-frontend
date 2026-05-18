import { ProfilePage } from '@/views/profile'
import { Metadata } from 'next'
import { ResponseGetUserPosts } from '@/entities/post/api/post.types'
import { cache } from 'react'
import { BASE_REDIRECT_URL } from '@/shared/constants'

type Props = {
  params: Promise<{ id: string; lang: string }>
  searchParams: Promise<{ [key: string]: string }>
}

const PROFILE_API_URL = `${BASE_REDIRECT_URL}/api/v1`

const EMPTY_USER_POSTS: ResponseGetUserPosts = {
  items: [],
  nextCursor: null,
  hasNextPage: false,
}

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

const getUserPosts = cache(async (id: string): Promise<ResponseGetUserPosts> => {
  try {
    const response = await fetch(`${PROFILE_API_URL}/posts/user/${id}`)

    if (!response.ok) {
      console.error('[profile-page] failed to fetch user posts', {
        status: response.status,
        statusText: response.statusText,
      })

      return EMPTY_USER_POSTS
    }

    const data: unknown = await response.json()

    if (!isUserPostsResponse(data)) {
      console.error('[profile-page] invalid user posts response')

      return EMPTY_USER_POSTS
    }

    return data
  } catch (error) {
    console.error('[profile-page] user posts request error', error)

    return EMPTY_USER_POSTS
  }
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id
  const postsData = await getUserPosts(id)

  return {
    title: `Profile ${postsData.items[0]?.owner?.login ?? 'page'}`,
  }
}

export default async function Profile(props: Props) {
  const params = await props.params
  const postsData = await getUserPosts(params.id)

  return <ProfilePage userId={params.id} postsData={postsData} />
}
