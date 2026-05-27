'use client'

import { ProfilePhoto } from '@/features/profile-photo'
import s from './ProfileInformation.module.scss'
import { ProfileInformationForm } from '@/features/profile-information/ui/ProfileInformationForm'

import { useGetProfileQuery } from '@/entities/user/api/user.api'

export const ProfileInformation = () => {
  const { data: profile, isLoading, error } = useGetProfileQuery()

  if (isLoading) return <div>Загрузка профиля...</div>
  if (error) return <div>Ошибка загрузки</div>
  if (!profile) return null // на случай, если data так и не пришла

  console.log(profile)

  return (
    <div className={s.container}>
      <h1>
        {profile.firstName} {profile.lastName}
      </h1>
      <p>@{profile.login}</p>
      <p>{profile.countryId}</p>
      <p>{profile.cityId}</p>
      <p>{profile.aboutMe}</p>
      <p>{profile.birthday}</p>
      <ProfilePhoto />
      <ProfileInformationForm />
    </div>
  )
}
