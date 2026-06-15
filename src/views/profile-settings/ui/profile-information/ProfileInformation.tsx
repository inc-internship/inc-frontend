'use client'

import { ProfilePhoto } from '@/features/profile-photo'
import s from './ProfileInformation.module.scss'
import { ProfileInformationForm } from '@/features/profile-information/ui/ProfileInformationForm'

import { useSelector } from 'react-redux'
import { selectUser } from '@/entities/user/user.slice'
import { Spinner } from '@/shared/ui/Spinner'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useI18n } from '@/shared/i18n'
import { useGetProfileQuery } from '@/entities/profile'

export const ProfileInformation = () => {
  const user = useSelector(selectUser)

  const userId = user?.publicId

  const {
    data: profile,
    isLoading,
    error,
  } = useGetProfileQuery({ userId: userId! }, { skip: !userId })

  const { t } = useI18n()

  useEffect(() => {
    if (error) {
      toast.error(t('profile.serverError'))
    }
  }, [error, t])

  if (isLoading)
    return (
      <div className={s.spinnerContainer}>
        <Spinner size="lg" />
      </div>
    )
  if (error) return null
  if (!profile) return null

  return (
    <div className={s.container}>
      <ProfilePhoto />
      <ProfileInformationForm />
    </div>
  )
}
