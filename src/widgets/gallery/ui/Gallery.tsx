'use client'

import type { Post, ResponseGetUserPosts, InfinitePostsData } from '@/entities/post/api/post.types'
import { selectUser } from '@/entities/user/user.slice'
import { DeletePostModal } from '@/features/delete-post'
import { UpdatePostModal } from '@/features/update-post'
import { useI18n } from '@/shared/i18n'
import { useAppSelector } from '@/shared/store'
import { Typography } from '@/shared/ui/Typography'
import { useInfiniteScroll } from '../model/useInfiniteScroll'
import s from './Gallery.module.scss'
import { ViewPostModal, openPostHandler, closePostHandler } from '@/features/view-post'
import { useGalleryPostActions } from '../model/useGalleryPostActions'
import {
  createConfirmDeletePostHandler,
  createConfirmUpdatePostHandler,
} from '../model/galleryHandlers'
import { GalleryCard } from './GalleryCard'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Props = {
  userId: string
  initialPosts: ResponseGetUserPosts
  skipQuery: boolean
  initialSelectedPost: Post | null
  data?: InfinitePostsData
  fetchNextPage: () => void
  hasNextPage?: boolean
  isFetchingNextPage: boolean
}

export const Gallery = ({
  userId,
  initialPosts,
  initialSelectedPost,
  skipQuery,
  data,
  fetchNextPage,
  hasNextPage = false,
  isFetchingNextPage,
}: Props) => {
  const { t } = useI18n()

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const navArgs = { router, pathname, searchParams }

  const user = useAppSelector(selectUser)
  const currentUserId = user?.publicId

  const posts: Post[] = data?.pages.flatMap(page => page.items) ?? initialPosts.items
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
  } = useGalleryPostActions({ userId, initialSelectedPost, currentUserId, t, navArgs })

  const confirmDeletePostHandler = createConfirmDeletePostHandler({
    closeViewModalHandler,
    confirmDeleteHandler,
    ...navArgs,
  })

  const confirmUpdatePostHandler = createConfirmUpdatePostHandler({
    closeViewModalHandler,
    confirmUpdateHandler,
    ...navArgs,
  })

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
        {posts.map((post, index) => {
          return (
            <GalleryCard
              key={`${post.id}-${post.images[0]?.url ?? 'no-image'}`}
              post={post}
              noImageLabel={t('main.noImage')}
              priorityImage={index < 3}
              onClick={post => openPostHandler({ post, setSelectedViewPost, ...navArgs })}
            />
          )
        })}
      </section>

      <ViewPostModal
        open={!!selectedViewPost && !isUpdatePostModalOpen}
        post={selectedViewPost}
        menuItems={selectedViewPostMenuItems}
        onCancel={() => closePostHandler({ closeViewModalHandler, ...navArgs })}
      />

      <DeletePostModal
        open={isDeleteModalOpen}
        onCancel={closeDeleteModalHandler}
        onConfirm={confirmDeletePostHandler}
        isLoading={isDeleting}
      />

      <UpdatePostModal
        key={selectedUpdatePostId ?? 'new'}
        open={isUpdatePostModalOpen}
        onCancel={closeUpdateModalHandler}
        onConfirm={confirmUpdatePostHandler}
        isLoading={isUpdating}
        initialDescription={selectedInitialDescription}
        imageUrl={selectedImageUrl}
      />

      {hasNextPage && <div ref={loadMoreRef} style={{ height: '1px' }} aria-hidden="true" />}
    </>
  )
}
