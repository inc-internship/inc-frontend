import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import s from './ProfileHeader.module.scss'
import { selectUser } from '@/entities/user/user.slice'
import { useAppSelector } from '@/shared/store'
import { useParams } from 'next/navigation'
import type { Profile } from '@/entities/profile'
import Link from 'next/link'
import { ROUTES } from '@/shared/constants'
import { useI18n } from '@/shared/i18n'
import { useFollowUserMutation, useUnfollowUserMutation } from '@/entities/user/api/user.api'
import { useGetUsersQuery } from '@/entities/user/api/user.api'

type Props = {
  profile?: Profile
  userName: string
}

export const ProfileHeader = ({ profile, userName }: Props) => {
  const params = useParams()
  const user = useAppSelector(selectUser)

  const { t } = useI18n()

  const userId = params.id ? String(params.id) : undefined

  const { data: searchData, isLoading: isSearchLoading } = useGetUsersQuery(
    { userId },
    { skip: userId }, // пропустить, если нет имени
  )

  const [followUser, { isLoading, isError, error }] = useFollowUserMutation()

  const [unfollowUser, { isLoading: isLoadingUnfollow }] = useUnfollowUserMutation()

  if (isLoading) {
    return 'Loading'
  }

  const followUserHandler = async () => {
    try {
      await followUser({ userId }).unwrap()
      console.log('Following user', userId)
    } catch (error) {
      console.error(error)
    }
  }

  const unfollowUserHandler = async () => {
    try {
      await unfollowUser({ userId }).unwrap()
      console.log('Unfollowing user', userId)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <section className={s.container}>
      <Typography variant="h1" className={s.title}>
        {profile?.login ?? userName ?? ''}
      </Typography>
      {user && userId && user.publicId === userId && (
        <Button variant="secondary" className={s.button} asChild>
          <Link href={ROUTES.profileSettings}>{t('menu.profileSettings')}</Link>
        </Button>
      )}
      {user && userId && user.publicId !== userId && (
        <div>
          <Button variant="primary" className={s.button} onClick={followUserHandler}>
            {t('profile.follow')}
          </Button>
          <Button variant="primary" className={s.button} onClick={unfollowUserHandler}>
            {t('profile.unfollow')}
          </Button>
        </div>
      )}
    </section>
  )
}
