import { Statistics } from './Statistics/Statistics'
import s from './ProfileStatistics.module.scss'
import { useI18n } from '@/shared/i18n'
import { useGetFollowersQuery, useGetFollowingQuery } from '@/entities/user/api/user.api'
import { postApi } from '@/entities/post/api/post.api'
import { Spinner } from '@/shared/ui/Spinner'

type Props = {
  userId: string
}

export const ProfileStatistics = ({ userId }: Props) => {
  const { t } = useI18n()

  const { data: postssData, isLoading: isPostsLoading } = postApi.useGetUserPostsInfiniteQuery({
    userId,
  })

  const { data: followersData, isLoading } = useGetFollowersQuery({ userId })
  const { data: followingData, isLoading: isFollowingLoading } = useGetFollowingQuery({ userId })

  if (isLoading) {
    return <Spinner />
  }

  if (isPostsLoading) {
    return <Spinner />
  }

  if (isFollowingLoading) {
    return <Spinner />
  }

  const publicationsQuantity = postssData?.pages[0].items.length
  const followingQuantity = followingData?.items.length
  const followersQuantity = followersData?.items.length

  return (
    <section className={s.container}>
      <Statistics number={followingQuantity} title={t('profile.following')} />
      <Statistics number={followersQuantity} title={t('profile.followers')} />
      <Statistics number={publicationsQuantity} title={t('profile.publications')} />
    </section>
  )
}
