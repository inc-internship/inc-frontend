'use client'

import { useState } from 'react'
import Image from 'next/image'
import { postApi } from '@/entities/post/api/post.api'
import type { ResponseGetUserPosts } from '@/entities/post/api/post.types'
import { selectUser } from '@/entities/user/user.slice'
import { DeletePostModal, useDeletePost } from '@/features/delete-post'
import {
  EditIcon,
  PostActionsMenu,
  TrashBinIcon,
  type PostActionMenuItem,
} from '@/features/post-actions'
import { UpdatePostModal, useUpdatePost } from '@/features/update-post'
import { useI18n } from '@/shared/i18n'
import { useAppSelector } from '@/shared/store'
import { Typography } from '@/shared/ui/Typography'
import { useInfiniteScroll } from '../model/useInfiniteScroll'
import { GallerySkeleton } from './GallerySkeleton'
import s from './Gallery.module.scss'

type Props = {
  userId: string
  initialPosts: ResponseGetUserPosts | null
  skipQuery: boolean
}

export const Gallery = ({ userId, initialPosts, skipQuery }: Props) => {
  const { t } = useI18n()
  const user = useAppSelector(selectUser)
  const currentUserId = user?.publicId

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isLoading } =
    postApi.useGetUserPostsInfiniteQuery({ userId }, { skip: skipQuery })

  const posts = data?.pages.flatMap(page => page.items) ?? initialPosts?.items ?? []
  const hasItems = posts.length > 0

  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    disabled: skipQuery,
  })

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const { deletePostHandler, isDeleting } = useDeletePost()

  const closeDeleteModalHandler = () => {
    setIsDeleteModalOpen(false)
    setSelectedPostId(null)
  }

  const confirmDeleteHandler = async () => {
    if (!selectedPostId) {
      return
    }

    const postId = selectedPostId

    closeDeleteModalHandler()

    void deletePostHandler(postId, userId).catch(() => {
      // rollback произойдет в RTK Query onQueryStarted
    })
  }

  const [isUpdatePostModalOpen, setIsUpdatePostModalOpen] = useState(false)
  const [selectedUpdatePostId, setSelectedUpdatePostId] = useState<string | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>(undefined)
  const [selectedInitialDescription, setSelectedInitialDescription] = useState('')
  const { updatePostHandler, isUpdating } = useUpdatePost()

  const closeUpdateModalHandler = () => {
    setIsUpdatePostModalOpen(false)
    setSelectedUpdatePostId(null)
    setSelectedImageUrl(undefined)
    setSelectedInitialDescription('')
  }

  const confirmUpdateHandler = async (newDescription: string) => {
    if (!selectedUpdatePostId) {
      return
    }

    const postId = selectedUpdatePostId

    closeUpdateModalHandler()

    void updatePostHandler(postId, userId, newDescription).catch(() => {
      // rollback произойдет в RTK Query onQueryStarted
    })
  }

  if (!hasItems && !skipQuery && (isLoading || isFetching)) {
    return <GallerySkeleton />
  }

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

          if (!image) {
            return null
          }

          const isOwnPost = currentUserId === post.owner?.id
          const menuItems: PostActionMenuItem[] = isOwnPost
            ? [
                {
                  key: 'edit',
                  label: t('post.updateTitle'),
                  onClick: () => {
                    setSelectedUpdatePostId(post.id)
                    setSelectedImageUrl(image.url)
                    setSelectedInitialDescription(post.description ?? '')
                    setIsUpdatePostModalOpen(true)
                  },
                  icon: <EditIcon />,
                },
                {
                  key: 'delete',
                  label: t('post.deleteTitle'),
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
              {isOwnPost ? (
                <PostActionsMenu
                  items={menuItems}
                  className={s.actionsMenu}
                  ariaLabel="Post actions"
                />
              ) : null}

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
      </section>

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

      {hasNextPage ? <div ref={loadMoreRef} style={{ height: '1px' }} aria-hidden="true" /> : null}
    </>
  )
}
