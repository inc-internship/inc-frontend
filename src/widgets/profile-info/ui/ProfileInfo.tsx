'use client'

import Image from 'next/image'
import s from './ProfileInfo.module.scss'
import { ProfileHeader } from './ProfileDetails/ProfileHeader/ProfileHeader'
import { ProfileStatistics } from './ProfileDetails/ProfileStatistics/ProfileStatistics'
import { ProfileDescription } from './ProfileDetails/ProfileDescription/ProfileDescription'

export const ProfileInfo = () => {
  const imageUrl = '/images/mountain.jpg'

  return (
    <section className={s.container}>
      <div className={s.avatar}>
        <Image className={s.photo} src={imageUrl} width={204} height={204} alt="Mount" />
      </div>
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
