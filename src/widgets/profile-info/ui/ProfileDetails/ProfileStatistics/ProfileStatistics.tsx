import { Statistics } from './Statistics/Statistics'
import s from './ProfileStatistics.module.scss'
import { useI18n } from '@/shared/i18n'
import { selectUnfollowedCount, selectUnfollowedUserIds } from '@/entities/follow'
import { selectUser } from '@/entities/user/user.slice'
import { useAppSelector } from '@/shared/store'

const BASE_FOLLOWING = 2218
const BASE_FOLLOWERS = 2358
const BASE_PUBLICATIONS = 2764

type Props = {
  profileUserId?: string
}

export const ProfileStatistics = ({ profileUserId }: Props) => {
  const { t } = useI18n()
  const currentUser = useAppSelector(selectUser)
  const unfollowedCount = useAppSelector(selectUnfollowedCount)
  const unfollowedUserIds = useAppSelector(selectUnfollowedUserIds)

  const isOwnProfile = !!currentUser?.publicId && currentUser.publicId === profileUserId
  const following = isOwnProfile ? Math.max(0, BASE_FOLLOWING - unfollowedCount) : BASE_FOLLOWING

  const followers =
    profileUserId && unfollowedUserIds.includes(profileUserId)
      ? Math.max(0, BASE_FOLLOWERS - 1)
      : BASE_FOLLOWERS

  return (
    <section className={s.container}>
      <Statistics number={following} title={t('profile.following')} />
      <Statistics number={followers} title={t('profile.followers')} />
      <Statistics number={BASE_PUBLICATIONS} title={t('profile.publications')} />
    </section>
  )
}
