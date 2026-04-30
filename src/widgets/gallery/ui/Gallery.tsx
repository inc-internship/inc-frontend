'use client'

import Image from 'next/image'
import s from './Gallery.module.scss'
import { useParams } from 'next/navigation'
import { Post, useGetUserPostsInfiniteQuery } from '@/entities/post'
import { Typography } from '@/shared/ui/Typography'
import { GallerySkeleton } from './GallerySkeleton'
import { useInfiniteScroll } from '../model/useInfiniteScroll'
import { DeletePostModal, useDeletePost } from '@/features/delete-post'
import { useState } from 'react'
import { UpdatePostModal, useUpdatePost } from '@/features/update-post'
import { selectUser } from '@/entities/user/user.slice'
import { useAppSelector } from '@/shared/store'
import {
  PostActionsMenu,
  PostActionMenuItem,
} from '@/features/post-actions/ui/PostActionsMenu/PostActionsMenu'
import { EditIcon, TrashBinIcon } from '@/features/post-actions'
import { useI18n } from '@/shared/i18n'

export const Gallery = () => {
  const { t } = useI18n()

  const params = useParams<{ slug?: string | string[] }>()
  const userId = String(params.slug)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetUserPostsInfiniteQuery({ userId })

  const { loadMoreRef } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage })

  //user
  const user = useAppSelector(selectUser)
  const currentUserId = user?.publicId

  //delete post
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

  const closeDeleteModalHandler = () => {
    setIsDeleteModalOpen(false)
    setSelectedPostId(null)
  }

  const confirmDeleteHandler = async () => {
    if (selectedPostId) {
      try {
        await deletePostHandler(selectedPostId, userId)
      } catch (error) {
        return
      }
      closeDeleteModalHandler()
    }
  }

  const { deletePostHandler, isDeleting } = useDeletePost()

  //update post
  const [isUpdatePostModalOpen, setIsUpdatePostModalOpen] = useState(false)
  const [selectedUpdatePostId, setSelectedUpdatePostId] = useState<string | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>(undefined)
  const [selectedInitialDescription, setSelectedInitialDescription] = useState('')

  const { updatePostHandler, isUpdating } = useUpdatePost()

  const confirmUpdateHandler = async (newDescription: string) => {
    if (!selectedUpdatePostId) return
    try {
      await updatePostHandler(selectedUpdatePostId, userId, newDescription)
      closeUpdateModalHandler()
    } catch {
      // ошибка обработается в хуке, можно показать тост при желании
    }
  }

  const closeUpdateModalHandler = () => {
    setIsUpdatePostModalOpen(false)
    setSelectedUpdatePostId(null)
    setSelectedImageUrl(undefined)
    setSelectedInitialDescription('')
  }

  if (isLoading) {
    return <GallerySkeleton />
  }

  const posts: Post[] = data?.pages.flatMap(page => page.items) ?? []
  const hasItems = posts.length > 0

  if (!hasItems) {
    return (
      <section className={s.emptyState}>
        <Typography variant="h2" className={s.noPosts}>
          Oops! No posts yet
        </Typography>
      </section>
    )
  }

  return (
    <>
      <section className={s.container}>
        {posts.map(post => {
          const image = post.images[0]

          const isOwnPost = currentUserId && post.owner?.id === currentUserId

          const menuItems: PostActionMenuItem[] = isOwnPost
            ? [
                {
                  key: 'edit',
                  label: `${t('post.updateTitle')}`,
                  onClick: () => {
                    setSelectedUpdatePostId(post.id)
                    setIsUpdatePostModalOpen(true)
                    setSelectedImageUrl(post.images[0]?.url)
                    setSelectedInitialDescription(post.description ?? '')
                  },
                  icon: <EditIcon />,
                },
                {
                  key: 'delete',
                  label: `${t('post.deleteTitle')}`,
                  onClick: () => {
                    setSelectedPostId(post.id)
                    setIsDeleteModalOpen(true)
                  },
                  icon: <TrashBinIcon />,
                },
              ]
            : []

          return (
            <div key={post.id} className={s.card}>
              {isOwnPost && (
                <PostActionsMenu
                  items={menuItems}
                  className={s.actionsMenu}
                  menuClassName={s.actionsDropdown}
                  triggerClassName={s.actionsTrigger}
                  ariaLabel="Действия с постом"
                />
              )}
              <Image
                className={s.image}
                src={image.url}
                unoptimized
                fill
                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 228px"
                alt={image.id}
              />
            </div>
          )
        })}

        <DeletePostModal
          open={isDeleteModalOpen}
          onCancel={closeDeleteModalHandler}
          onConfirm={confirmDeleteHandler}
          isLoading={isDeleting}
        />

        <UpdatePostModal
          key={selectedUpdatePostId ?? 'new'}
          open={isUpdatePostModalOpen}
          onCancel={closeUpdateModalHandler}
          onConfirm={confirmUpdateHandler}
          isLoading={isUpdating}
          initialDescription={selectedInitialDescription}
          imageUrl={selectedImageUrl}
        />
      </section>
      {hasNextPage && <div ref={loadMoreRef} style={{ height: '1px' }} aria-hidden="true" />}
    </>
  )
}
