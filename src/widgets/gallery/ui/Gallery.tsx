'use client'

import Image from 'next/image'
import s from './Gallery.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { ResponseGetUserPosts } from '@/entities/post/api/post.types'
import { postApi } from '@/entities/post/api/post.api'
import { useInfiniteScroll } from '../model/useInfiniteScroll'

type Props = {
  userId: string
  initialPosts: ResponseGetUserPosts
  skipQuery: boolean
}

export const Gallery = ({ userId, initialPosts, skipQuery }: Props) => {
  console.log('Gallery')
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    postApi.useGetUserPostsInfiniteQuery({ userId }, { skip: skipQuery })

  console.log(initialPosts.items)

  const posts = data?.pages.flatMap(page => page.items) ?? initialPosts.items
  const hasItems = posts.length > 0

  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    disabled: skipQuery,
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
