import { ProfilePage } from '@/views/profile'
import { Metadata } from 'next'
import { BASE_REDIRECT_URL } from '@/shared/constants'
import { ResponseGetUserPosts } from '@/entities/post/api/post.types'
import { cache } from 'react'

type Props = {
  params: Promise<{ id: string; lang: string }>
  searchParams: Promise<{ [key: string]: string }>
}

const getUserPosts = cache(async (id: string): Promise<ResponseGetUserPosts> => {
  const emptyPosts: ResponseGetUserPosts = {
    items: [],
    nextCursor: null,
    hasNextPage: false,
  }

  try {
    const response = await fetch(`${BASE_REDIRECT_URL}/api/v1/posts/user/${id}`)

    if (!response.ok) {
      console.error('[profile-page] failed to fetch posts', {
        id,
        status: response.status,
        statusText: response.statusText,
      })

      return emptyPosts
    }

    return await response.json()
  } catch (error) {
    console.error('[profile-page] posts request error', { id, error })

    return emptyPosts
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
