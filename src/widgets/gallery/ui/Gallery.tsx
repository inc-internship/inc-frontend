'use client'

import Image from 'next/image'
import s from './Gallery.module.scss'
import { useParams } from 'next/navigation'
import { Post, useGetUserPostsInfiniteQuery } from '@/entities/post'
import { Typography } from '@/shared/ui/Typography'
import { GallerySkeleton } from './GallerySkeleton'
import { useInfiniteScroll } from '../model/useInfiniteScroll'

export const Gallery = () => {
  const params = useParams<{ slug?: string | string[] }>()
  const userId = String(params.slug)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetUserPostsInfiniteQuery({ userId })

  const { loadMoreRef } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage })

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

          return (
            <div key={post.id} className={s.card}>
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
      {hasNextPage && <div ref={loadMoreRef} style={{ height: '1px' }} aria-hidden="true" />}
    </>
  )
}
