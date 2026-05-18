'use client'

import s from './ProfileInfo.module.scss'
import { ProfileHeader } from './ProfileDetails/ProfileHeader/ProfileHeader'
import { ProfileStatistics } from './ProfileDetails/ProfileStatistics/ProfileStatistics'
import { ProfileDescription } from './ProfileDetails/ProfileDescription/ProfileDescription'
import { Avatar } from '@/shared/ui/Avatar'

export const ProfileInfo = () => {
  const imageUrl = '/images/mountain.jpg'

  return (
    <section className={s.container}>
      <Avatar className={s.avatar} src={imageUrl} alt="User Avatar" />
      <div className={s.header}>
        <ProfileHeader />
      </div>
      <div className={s.statistics}>
        <ProfileStatistics />
      </div>
      <div className={s.description}>
        <ProfileDescription />
      </div>
    </section>
  )
}
