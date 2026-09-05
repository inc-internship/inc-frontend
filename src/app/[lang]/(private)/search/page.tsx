import { Metadata } from 'next'
import { SearchPage } from '@/views/search/ui/SearchPage'

export const metadata: Metadata = {
  title: 'Search Users Page',
}

export default function Search() {
  return <SearchPage />
}
