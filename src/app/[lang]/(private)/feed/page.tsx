import { FeedPage } from '@/views/feed'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Feed',
}

export default function Feed() {
  return <FeedPage />
}
