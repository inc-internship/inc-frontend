import { useEffect, useState } from 'react'
import type { Post } from '@/entities/post'

type Props = {
  initialSelectedPost: Post | null
}

export const useViewPost = ({ initialSelectedPost }: Props) => {
  const [selectedViewPost, setSelectedViewPost] = useState<Post | null>(initialSelectedPost)

  useEffect(() => {
    setSelectedViewPost(initialSelectedPost)
  }, [initialSelectedPost])

  const closeViewModalHandler = () => setSelectedViewPost(null)

  return { selectedViewPost, setSelectedViewPost, closeViewModalHandler }
}
