'use client'

import Image from 'next/image'
import s from './Gallery.module.scss'
import { useParams } from 'next/navigation'
import { useGetUserPostsInfiniteQuery } from '@/entities/post'
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

  const posts = data?.pages.flatMap(page => page.items) ?? []
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
        {posts.map(image => (
          <div key={image.id} className={s.card}>
            <Image className={s.image} src={image.images[0].url} fill alt={image.images[0].id} />
          </div>
        ))}
      </section>
      {hasNextPage && <div ref={loadMoreRef} style={{ height: '1px' }} aria-hidden="true" />}
    </>
  )
}
