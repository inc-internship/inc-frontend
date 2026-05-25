import type { Post } from '@/entities/post/api/post.types'

type MaybePromise<T> = T | Promise<T>

type RouterLike = {
  push: (url: string, options?: { scroll?: boolean }) => void
  replace: (url: string, options?: { scroll?: boolean }) => void
}

type NavArgs = {
  router: RouterLike
  pathname: string
  searchParams: { toString: () => string }
}

type OpenPostHandlerArgs = NavArgs & {
  post: Post
  setSelectedViewPost: (post: Post) => void
}

type ClosePostHandlerArgs = NavArgs & {
  closeViewModalHandler: () => void
}

type ConfirmUpdatePostHandlerArgs = ClosePostHandlerArgs & {
  description: string
  confirmUpdateHandler: (description: string) => MaybePromise<void>
}

type ConfirmDeletePostHandlerArgs = ClosePostHandlerArgs & {
  confirmDeleteHandler: () => MaybePromise<void>
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

export const confirmUpdatePostHandler = async ({
  description,
  closeViewModalHandler,
  confirmUpdateHandler,
  router,
  pathname,
  searchParams,
}: ConfirmUpdatePostHandlerArgs) => {
  closePostHandler({ closeViewModalHandler, router, pathname, searchParams })

  await confirmUpdateHandler(description)
}

export const confirmDeletePostHandler = async ({
  closeViewModalHandler,
  confirmDeleteHandler,
  router,
  pathname,
  searchParams,
}: ConfirmDeletePostHandlerArgs) => {
  closePostHandler({ closeViewModalHandler, router, pathname, searchParams })

  await confirmDeleteHandler()
}

export const createConfirmUpdatePostHandler = ({
  closeViewModalHandler,
  confirmUpdateHandler,
  router,
  pathname,
  searchParams,
}: Omit<ConfirmUpdatePostHandlerArgs, 'description'>) => {
  return (description: string) =>
    confirmUpdatePostHandler({
      description,
      closeViewModalHandler,
      confirmUpdateHandler,
      router,
      pathname,
      searchParams,
    })
}

export const createConfirmDeletePostHandler = ({
  closeViewModalHandler,
  confirmDeleteHandler,
  router,
  pathname,
  searchParams,
}: ConfirmDeletePostHandlerArgs) => {
  return () =>
    confirmDeletePostHandler({
      closeViewModalHandler,
      confirmDeleteHandler,
      router,
      pathname,
      searchParams,
    })
}
