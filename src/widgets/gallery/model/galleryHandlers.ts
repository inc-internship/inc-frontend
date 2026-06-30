import { closePostHandler, type ClosePostHandlerArgs } from '@/features/view-post'

type MaybePromise<T> = T | Promise<T>

type ConfirmUpdatePostHandlerArgs = ClosePostHandlerArgs & {
  description: string
  confirmUpdateHandler: (description: string) => MaybePromise<void>
}

type ConfirmDeletePostHandlerArgs = ClosePostHandlerArgs & {
  confirmDeleteHandler: () => MaybePromise<void>
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
