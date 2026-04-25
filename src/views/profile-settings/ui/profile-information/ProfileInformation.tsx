'use client'

import { ProfilePhoto } from '@/features/profile-photo'
import s from './ProfileInformation.module.scss'
import { ProfileInformationForm } from '@/features/profile-information/ui/ProfileInformationForm'

export const ProfileInformation = () => {
  return (
    <div className={s.container}>
      <ProfilePhoto />
      <ProfileInformationForm />
    </div>
  )
}
