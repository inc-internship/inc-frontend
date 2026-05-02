import { MainPage } from '@/views/main'
import { getMainPageData } from '@/views/main/model/getMainPageData'

export default async function Main() {
  const { totalUsers, latestPosts } = await getMainPageData()

  return <MainPage totalUsers={totalUsers} latestPosts={latestPosts} />
}
