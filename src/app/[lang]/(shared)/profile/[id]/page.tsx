import { ProfilePage } from '@/views/profile'
import type { Metadata } from 'next'
import { fetchPost, fetchUserPosts } from '@/entities/post'

type Props = {
  params: Promise<{ id: string; lang: string }>
  searchParams: Promise<{ postId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const postsData = await fetchUserPosts(id)

  return {
    title: `Profile ${postsData.items[0]?.owner?.login ?? 'page'}`,
  }
}

export default async function Profile(props: Props) {
  const { id } = await props.params
  const { postId } = await props.searchParams

  const postsData = await fetchUserPosts(id)

  const selectedPost = postId ? await fetchPost(postId) : null
  const selectedOwnerPost = selectedPost?.owner.id === id ? selectedPost : null

  return <ProfilePage userId={id} postsData={postsData} initialSelectedPost={selectedOwnerPost} />
}
