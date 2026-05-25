import type { Post } from '@/entities/post'

type RouterLike = {
  push: (url: string, options?: { scroll?: boolean }) => void
  replace: (url: string, options?: { scroll?: boolean }) => void
}

export type NavArgs = {
  router: RouterLike
  pathname: string
  searchParams: { toString: () => string }
}

type OpenPostHandlerArgs = NavArgs & {
  post: Post
  setSelectedViewPost: (post: Post) => void
}

export type ClosePostHandlerArgs = NavArgs & {
  closeViewModalHandler: () => void
}

export const openPostHandler = ({
  post,
  setSelectedViewPost,
  router,
  pathname,
  searchParams,
}: OpenPostHandlerArgs) => {
  setSelectedViewPost(post)

  const params = new URLSearchParams(searchParams.toString())
  params.set('postId', post.id)

  router.push(`${pathname}?${params.toString()}`, { scroll: false })
}

export const closePostHandler = ({
  closeViewModalHandler,
  router,
  pathname,
  searchParams,
}: ClosePostHandlerArgs) => {
  closeViewModalHandler()

  const params = new URLSearchParams(searchParams.toString())
  params.delete('postId')
  const search = params.toString()

  router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false })
}
