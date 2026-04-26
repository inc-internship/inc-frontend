import { useEffect, useRef } from 'react'

type Props = {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
}

export const useInfiniteScroll = ({ hasNextPage, isFetchingNextPage, fetchNextPage }: Props) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = loadMoreRef.current

    if (!node || !hasNextPage) {
      return
    }

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !isFetchingNextPage) {
        fetchNextPage()
      }
    })

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [hasNextPage, fetchNextPage, isFetchingNextPage])

  return { loadMoreRef }
}
