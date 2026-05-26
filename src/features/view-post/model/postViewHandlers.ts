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
  targetPathname?: string
  from?: string
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
  targetPathname,
  from,
}: OpenPostHandlerArgs) => {
  const navigateTo = targetPathname ?? pathname
  const isNavigatingAway = !!targetPathname && targetPathname !== pathname

  if (!isNavigatingAway) {
    setSelectedViewPost(post)
  }

  const params = new URLSearchParams(searchParams.toString())
  params.set('postId', post.id)
  if (from) params.set('from', from)

  router.push(`${navigateTo}?${params.toString()}`, { scroll: false })
}

export const closePostHandler = ({
  closeViewModalHandler,
  router,
  pathname,
  searchParams,
}: ClosePostHandlerArgs) => {
  closeViewModalHandler()

  const params = new URLSearchParams(searchParams.toString())
  const from = params.get('from')
  params.delete('postId')
  params.delete('from')
  const search = params.toString()

  if (from) {
    router.replace(from)
  } else {
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false })
  }
}
