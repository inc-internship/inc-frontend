'use client'

import { Gallery } from '@/widgets/gallery'
import { ProfileInfo } from '@/widgets/profile-info'
import s from './ProfilePage.module.scss'

export const ProfilePage = () => {
  return (
    <div className={s.page}>
      <div className={s.container}>
        <ProfileInfo />
        <Gallery />
      </div>
    </div>
  )
}
