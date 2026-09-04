'use client'

import { useEffect, useRef } from 'react'

type UseInfiniteCommentsScrollArgs = {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  disabled?: boolean
}

export const useInfiniteCommentsScroll = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  disabled = false,
}: UseInfiniteCommentsScrollArgs) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = loadMoreRef.current

    if (!node || !hasNextPage || disabled) {
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { rootMargin: '200px 0px' },
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [disabled, fetchNextPage, hasNextPage, isFetchingNextPage])

  return { loadMoreRef }
}
