import type { Post } from '@/entities/post/api/post.types'

type MaybePromise<T> = T | Promise<T>

type OpenPostHandlerArgs = {
  post: Post
  setSelectedViewPost: (post: Post) => void
}

type ClosePostHandlerArgs = {
  closeViewModalHandler: () => void
}

type ConfirmUpdatePostHandlerArgs = ClosePostHandlerArgs & {
  description: string
  confirmUpdateHandler: (description: string) => MaybePromise<void>
}

type ConfirmDeletePostHandlerArgs = ClosePostHandlerArgs & {
  confirmDeleteHandler: () => MaybePromise<void>
}

export const openPostHandler = ({ post, setSelectedViewPost }: OpenPostHandlerArgs) => {
  setSelectedViewPost(post)

  const url = new URL(window.location.href)
  url.searchParams.set('postId', post.id)

  window.history.pushState(null, '', url)
}

export const closePostHandler = ({ closeViewModalHandler }: ClosePostHandlerArgs) => {
  closeViewModalHandler()

  const url = new URL(window.location.href)
  url.searchParams.delete('postId')

  window.history.replaceState(null, '', url.pathname + url.search)
}

export const confirmUpdatePostHandler = async ({
  description,
  closeViewModalHandler,
  confirmUpdateHandler,
}: ConfirmUpdatePostHandlerArgs) => {
  closePostHandler({ closeViewModalHandler })

  await confirmUpdateHandler(description)
}

export const confirmDeletePostHandler = async ({
  closeViewModalHandler,
  confirmDeleteHandler,
}: ConfirmDeletePostHandlerArgs) => {
  closePostHandler({ closeViewModalHandler })

  await confirmDeleteHandler()
}

export const createConfirmUpdatePostHandler = ({
  closeViewModalHandler,
  confirmUpdateHandler,
}: Omit<ConfirmUpdatePostHandlerArgs, 'description'>) => {
  return (description: string) =>
    confirmUpdatePostHandler({
      description,
      closeViewModalHandler,
      confirmUpdateHandler,
    })
}

export const createConfirmDeletePostHandler = ({
  closeViewModalHandler,
  confirmDeleteHandler,
}: ConfirmDeletePostHandlerArgs) => {
  return () =>
    confirmDeletePostHandler({
      closeViewModalHandler,
      confirmDeleteHandler,
    })
}
