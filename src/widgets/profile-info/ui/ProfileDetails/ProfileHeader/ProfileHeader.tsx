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
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetFollowingQuery,
} from '@/entities/user/api/user.api'
import { toast } from 'react-toastify'
import { getApiErrorMessage } from '@/shared/api'

type Props = {
  profile?: Profile
  userName: string
}

export const ProfileHeader = ({ profile, userName }: Props) => {
  const params = useParams()
  const user = useAppSelector(selectUser)
  const { t } = useI18n()
  const userId = params.id ? String(params.id) : undefined
  const currentUserId = user?.publicId ?? ''

  const { data: followingData, isLoading: isFollowingLoading } = useGetFollowingQuery(
    { userId: currentUserId },
    { skip: !currentUserId },
  )

  const [followUser, { isLoading: isFollowLoading }] = useFollowUserMutation()
  const [unfollowUser, { isLoading: isUnfollowLoading }] = useUnfollowUserMutation()

  const isFollowing = followingData?.items.some(u => u.id === userId) ?? false
  const isMutationLoading = isFollowLoading || isUnfollowLoading

  const toggleFollowHandler = async () => {
    if (!userId) return
    try {
      if (isFollowing) {
        await unfollowUser({ userId, currentUserId }).unwrap()
      } else {
        await followUser({ userId, currentUserId }).unwrap()
      }
    } catch (error) {
      console.error('Follow toggle failed', error)
      toast.error(getApiErrorMessage(error))
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
        <Button
          variant={isFollowing ? 'secondary' : 'primary'}
          className={s.button}
          onClick={toggleFollowHandler}
          disabled={isMutationLoading || isFollowingLoading}
        >
          {isFollowing ? t('profile.unfollow') : t('profile.follow')}
        </Button>
      )}
    </section>
  )
}
