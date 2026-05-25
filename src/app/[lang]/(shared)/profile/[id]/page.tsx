import { ProfilePage } from '@/views/profile'
import { Metadata } from 'next'
import { SERVER_API_V1_URL } from '@/shared/constants'
import { Post, ResponseGetUserPosts } from '@/entities/post/api/post.types'
import { cache } from 'react'

type Props = {
  params: Promise<{ id: string; lang: string }>
  searchParams: Promise<{ postId: string }>
}

const getUserPosts = cache(async (id: string): Promise<ResponseGetUserPosts> => {
  const response = await fetch(`${SERVER_API_V1_URL}/posts/user/${id}`)

  return response.json()
})

const getUserPost = cache(async (postId: string): Promise<Post | null> => {
  const response = await fetch(`${SERVER_API_V1_URL}/posts/${postId}`)

  if (!response.ok) return null

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
  const searchParams = await props.searchParams

  const postsData = await getUserPosts(params.id)

  const selectedPost = searchParams.postId ? await getUserPost(searchParams.postId) : null
  const selectedOwnerPost = selectedPost?.owner.id === params.id ? selectedPost : null

  return (
    <ProfilePage userId={params.id} postsData={postsData} initialSelectedPost={selectedOwnerPost} />
  )
}
