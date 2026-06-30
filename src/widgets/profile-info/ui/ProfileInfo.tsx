'use client'

import s from './ProfileInfo.module.scss'
import { ProfileHeader } from './ProfileDetails/ProfileHeader/ProfileHeader'
import { ProfileStatistics } from './ProfileDetails/ProfileStatistics/ProfileStatistics'
import { ProfileDescription } from './ProfileDetails/ProfileDescription/ProfileDescription'
import { Avatar } from '@/shared/ui/Avatar'
import type { Profile } from '@/entities/profile'

type Props = {
  profile?: Profile
  userName: string
}

export const ProfileInfo = ({ profile, userName }: Props) => {
  return (
    <section className={s.container}>
      <Avatar className={s.avatar} src={profile?.avatar?.original?.url ?? null} alt="User Avatar" />
      <div className={s.header}>
        <ProfileHeader profile={profile} userName={userName} />
      </div>
      <div className={s.statistics}>
        <ProfileStatistics />
      </div>
      <div className={s.description}>
        <ProfileDescription profile={profile} />
      </div>
    </section>
  )
}
