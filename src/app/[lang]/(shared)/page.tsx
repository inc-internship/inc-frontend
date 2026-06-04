import { MainPage } from '@/views/main'
import { getMainPageData } from '@/views/main/model/getMainPageData'
import { fetchPost } from '@/entities/post'
import type { Post } from '@/entities/post'

type Props = {
  searchParams: Promise<{ postId?: string }>
}

export default async function Main({ searchParams }: Props) {
  const { totalUsers, latestPosts } = await getMainPageData()
  const { postId } = await searchParams

  const initialSelectedPost: Post | null = postId ? await fetchPost(postId) : null

  return (
    <MainPage
      totalUsers={totalUsers}
      latestPosts={latestPosts}
      initialSelectedPost={initialSelectedPost}
    />
  )
}
