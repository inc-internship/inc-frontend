import { useEffect, useRef } from 'react'

type Props = {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  disabled: boolean
}

export const useInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  disabled = false,
}: Props) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = loadMoreRef.current

    if (!node || !hasNextPage || disabled) {
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
  }, [hasNextPage, fetchNextPage, isFetchingNextPage, disabled])

  return { loadMoreRef }
}
