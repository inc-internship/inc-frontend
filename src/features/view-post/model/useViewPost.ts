import { useEffect, useRef, useState } from 'react'
import type { Post } from '@/entities/post'
import type { NavArgs } from './postViewHandlers'

type Props = {
  initialSelectedPost: Post | null
  navArgs?: NavArgs
}

export const useViewPost = ({ initialSelectedPost, navArgs }: Props) => {
  const [selectedViewPost, setSelectedViewPost] = useState<Post | null>(initialSelectedPost)
  const [prevInitialPost, setPrevInitialPost] = useState(initialSelectedPost)
  const navArgsRef = useRef(navArgs)

  useEffect(() => {
    navArgsRef.current = navArgs
  })

  if (prevInitialPost !== initialSelectedPost) {
    setPrevInitialPost(initialSelectedPost)
    setSelectedViewPost(initialSelectedPost)
  }

  useEffect(() => {
    if (initialSelectedPost !== null || !navArgsRef.current) return

    const { router, pathname, searchParams } = navArgsRef.current
    const params = new URLSearchParams(searchParams.toString())

    if (!params.has('postId')) return

    params.delete('postId')
    const search = params.toString()
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false })
  }, [initialSelectedPost])

  const closeViewModalHandler = () => setSelectedViewPost(null)

  return { selectedViewPost, setSelectedViewPost, closeViewModalHandler }
}
