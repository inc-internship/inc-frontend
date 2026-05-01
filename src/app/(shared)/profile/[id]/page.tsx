import { ProfilePage } from '@/views/profile'
import { Metadata } from 'next'
import { API_V1_URL } from '@/shared/constants'
import { ResponseGetUserPosts } from '@/entities/post/api/post.types'
import { cache } from 'react'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string }>
}

const getUserPosts = cache(async (id: string): Promise<ResponseGetUserPosts> => {
  const response = await fetch(`https://minglo.blog${API_V1_URL}/posts/user/${id}`)

  return response.json()
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
