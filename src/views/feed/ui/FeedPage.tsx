'use client'

import { useGetUserPostsInfiniteQuery } from '@/entities/post'
import { useGetProfileQuery } from '@/entities/profile'
import { selectUser } from '@/entities/user/user.slice'
import { useI18n } from '@/shared/i18n'
import { useAppSelector } from '@/shared/store'
import { Typography } from '@/shared/ui/Typography'
import { useInfiniteScroll } from '@/widgets/gallery/model/useInfiniteScroll'
import { FeedPostCard } from './FeedPostCard/FeedPostCard'
import s from './FeedPage.module.scss'

export const FeedPage = () => {
  const { t } = useI18n()
  const user = useAppSelector(selectUser)
  const userId = user?.publicId

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useGetUserPostsInfiniteQuery({ userId: userId ?? '' }, { skip: !userId })

  const { data: profile } = useGetProfileQuery({ userId: userId ?? '' }, { skip: !userId })

  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    disabled: !userId,
  })

  const posts = data?.pages.flatMap(page => page.items) ?? []
  const avatarUrl = profile?.avatar?.thumbnail?.url ?? profile?.avatar?.original?.url ?? null

  if (!userId || isLoading) {
    return (
      <section className={s.page}>
        <Typography variant="text-m">{t('common.loading')}</Typography>
      </section>
    )
  }

  if (isError) {
    return (
      <section className={s.page}>
        <Typography variant="text-m">{t('common.somethingWentWrong')}</Typography>
      </section>
    )
  }

  if (posts.length === 0) {
    return (
      <section className={s.page}>
        <Typography variant="h2" className={s.empty}>
          {t('feed.empty')}
        </Typography>
      </section>
    )
  }

  return (
    <section className={s.page}>
      <div className={s.list}>
        {posts.map(post => (
          <FeedPostCard key={post.id} post={post} avatarUrl={avatarUrl ?? post.owner.avatar?.url} />
        ))}
      </div>
      {hasNextPage ? <div ref={loadMoreRef} className={s.loadMore} aria-hidden="true" /> : null}
    </section>
  )
}
