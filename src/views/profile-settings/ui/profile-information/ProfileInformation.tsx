'use client'

import { ProfilePhoto } from '@/features/profile-photo'
import s from './ProfileInformation.module.scss'
import { ProfileInformationForm } from '@/features/profile-information/ui/ProfileInformationForm'

import { useGetProfileQuery } from '@/entities/user/api/user.api'
import { useSelector } from 'react-redux'
import { selectUser } from '@/entities/user/user.slice'
import { Loader } from 'storybook/internal/components'

export const ProfileInformation = () => {
  const user = useSelector(selectUser)

  const userId = user?.publicId

  const { data: profile, isLoading, error } = useGetProfileQuery(userId!, { skip: !userId })

  if (isLoading) return <Loader />
  if (error) return <div>Ошибка загрузки</div>
  if (!profile) return null

  return (
    <div className={s.container}>
      <ProfilePhoto />
      <ProfileInformationForm />
    </div>
  )
}
