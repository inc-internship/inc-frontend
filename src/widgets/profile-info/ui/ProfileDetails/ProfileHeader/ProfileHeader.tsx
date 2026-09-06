'use client'

import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import s from './ProfileHeader.module.scss'
import { selectUser } from '@/entities/user/user.slice'
import { useAppSelector } from '@/shared/store'
import { useParams } from 'next/navigation'
import type { Profile } from '@/entities/profile'
import Link from 'next/link'
import { ROUTES } from '@/shared/constants'
import { getLocalizedPath, useI18n } from '@/shared/i18n'

type Props = {
  profile?: Profile
  userName: string
}

export const ProfileHeader = ({ profile, userName }: Props) => {
  const params = useParams()
  const user = useAppSelector(selectUser)
  const { t, locale } = useI18n()

  const userId = params.id ? String(params.id) : undefined
  const isOwnProfile = !!user && !!userId && user.publicId === userId
  const canMessage = !!user && !!userId && !isOwnProfile

  const messengerHref = userId
    ? getLocalizedPath(locale, `${ROUTES.messenger}?userId=${encodeURIComponent(userId)}`)
    : getLocalizedPath(locale, ROUTES.messenger)

  return (
    <section className={s.container}>
      <Typography variant="h1" className={s.title}>
        {profile?.login ?? userName ?? ''}
      </Typography>
      {isOwnProfile ? (
        <Button variant="secondary" className={s.button} asChild>
          <Link href={ROUTES.profileSettings}>{t('menu.profileSettings')}</Link>
        </Button>
      ) : null}
      {canMessage ? (
        <Button variant="secondary" className={s.button} asChild>
          <Link href={messengerHref}>{t('profile.sendMessage')}</Link>
        </Button>
      ) : null}
    </section>
  )
}
