'use client'

import Image from 'next/image'
import { postApi } from '@/entities/post/api/post.api'
import type { ResponseGetUserPosts } from '@/entities/post/api/post.types'
import { selectUser } from '@/entities/user/user.slice'
import { DeletePostModal } from '@/features/delete-post'
import { UpdatePostModal } from '@/features/update-post'
import { useI18n } from '@/shared/i18n'
import { useAppSelector } from '@/shared/store'
import { Typography } from '@/shared/ui/Typography'
import { useInfiniteScroll } from '../model/useInfiniteScroll'
import s from './Gallery.module.scss'
import { ViewPostModal } from '@/features/view-post'
import { useGalleryPostActions } from '../model/useGalleryPostActions'

type Props = {
  userId: string
  initialPosts: ResponseGetUserPosts
  skipQuery: boolean
}

export const Gallery = ({ userId, initialPosts, skipQuery }: Props) => {
  const { t } = useI18n()
  const user = useAppSelector(selectUser)
  const currentUserId = user?.publicId

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    postApi.useGetUserPostsInfiniteQuery({ userId }, { skip: skipQuery })

  const posts = data?.pages.flatMap(page => page.items) ?? initialPosts.items
  const hasItems = posts.length > 0

  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    disabled: skipQuery,
  })

  const {
    selectedViewPost,
    selectedUpdatePostId,
    selectedViewPostMenuItems,
    isDeleteModalOpen,
    isUpdatePostModalOpen,
    selectedImageUrl,
    selectedInitialDescription,
    isDeleting,
    isUpdating,
    setSelectedViewPost,
    closeViewModalHandler,
    closeDeleteModalHandler,
    confirmDeleteHandler,
    closeUpdateModalHandler,
    confirmUpdateHandler,
  } = useGalleryPostActions({ userId, currentUserId, t })

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

          return (
            <div key={post.id} onClick={() => setSelectedViewPost(post)} className={s.card}>
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

      <ViewPostModal
        open={!!selectedViewPost}
        post={selectedViewPost}
        menuItems={selectedViewPostMenuItems}
        onCancel={closeViewModalHandler}
      />

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

      {hasNextPage && <div ref={loadMoreRef} style={{ height: '1px' }} aria-hidden="true" />}
    </>
  )
}
