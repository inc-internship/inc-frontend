'use client'

import Image from 'next/image'
import s from './Gallery.module.scss'
import { useParams } from 'next/navigation'
import { Post, useGetUserPostsInfiniteQuery } from '@/entities/post'
import { Typography } from '@/shared/ui/Typography'
import { GallerySkeleton } from './GallerySkeleton'
import { useInfiniteScroll } from '../model/useInfiniteScroll'
import { Button } from '@/shared/ui/Button'
import { DeletePostModal, useDeletePost } from '@/features/delete-post'
import { useState } from 'react'

export const Gallery = () => {
  const params = useParams<{ slug?: string | string[] }>()
  const userId = String(params.slug)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetUserPostsInfiniteQuery({ userId })

  const { loadMoreRef } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage })

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

          console.log(post)

          return (
            <div key={post.id} className={s.card}>
              <Button
                className={s.button}
                onClick={() => {
                  setSelectedPostId(post.id)
                  setIsDeleteModalOpen(true)
                }}
              >
                Удалить пост
              </Button>
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
      </section>
      {hasNextPage && <div ref={loadMoreRef} style={{ height: '1px' }} aria-hidden="true" />}
    </>
  )
}
