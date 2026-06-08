'use client'

import s from './ProfilePhoto.module.scss'
import { Button } from '@/shared/ui/Button'
import { useState } from 'react'
import { AddProfilePhotoModal } from '@/features/profile-photo/ui/AddProfilePhotoModal/AddProfilePhotoModal'
import { DeleteAvatarIcon } from '@/shared/ui/icons/DeleteAvatarIcon'
import { DeleteProfilePhotoModal } from '@/features/profile-photo/ui/DeleteProfilePhotoModal/DeleteProfilePhotoModal'
import { selectUser } from '@/entities/user/user.slice'
import { useAppSelector } from '@/shared/store'
import { useI18n } from '@/shared/i18n'
import { useGetProfileQuery, useDeleteAvatarMutation } from '@/entities/user/api/user.api'
import { toast } from 'react-toastify'
import Image from 'next/image'
import { Typography } from '@/shared/ui/Typography'
import { Spinner } from '@/shared/ui/Spinner'

export const ProfilePhoto = () => {
  const { t } = useI18n()
  const user = useAppSelector(selectUser)

  const userId = user?.publicId

  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery(userId!, {
    skip: !userId,
  })

  const [deleteAvatar, { isLoading: isDeleting }] = useDeleteAvatarMutation()

  const [isAddProfilePhotoModalOpen, setIsAddProfilePhotoModalOpen] = useState(false)
  const [isDeleteProfilePhotoModalOpen, setIsDeleteProfilePhotoModalOpen] = useState(false)

  const avatarSrc = profile?.avatar?.original?.url

  const [avatarError, setAvatarError] = useState(false)

  if (isProfileLoading)
    return (
      <div className={s.profilePhotoWrapper}>
        <Spinner />
      </div>
    )

  const handleDeletePhoto = async () => {
    const mediaId = profile?.avatar?.original?.id
    if (!mediaId) {
      setIsDeleteProfilePhotoModalOpen(false)
      return
    }
    try {
      await deleteAvatar({ mediaId }).unwrap()
      setIsDeleteProfilePhotoModalOpen(false)
      toast.success(t('profile.deleteAvatarSuccess'))
    } catch {
      toast.error(t('profile.serverError'))
    }
  }

  return (
    <div className={s.profilePhotoWrapper}>
      <div className={s.profilePhotoInner}>
        <div className={s.avatarWrapper}>
          {avatarSrc && (
            <div className={s.deleteAvatarButtonWrapper}>
              <Button
                className={s.deleteAvatarButton}
                onClick={() => setIsDeleteProfilePhotoModalOpen(true)}
                iconOnly
              >
                <DeleteAvatarIcon />
              </Button>
            </div>
          )}
          {avatarSrc && !avatarError ? (
            <Image
              src={avatarSrc}
              alt="Profile avatar"
              fill
              sizes="204px"
              className={s.avatarImage}
              style={{ objectFit: 'cover' }}
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className={s.defaultAvatarWrapper}>
              <Image
                src="/images/default-avatar.svg"
                alt="Default avatar"
                width={48}
                height={48}
                className={s.defaultAvatar}
              />
              {avatarError && (
                <Typography variant="text-s" className={s.avatarErrorCaption}>
                  {t('main.noImage')}
                </Typography>
              )}
            </div>
          )}
        </div>
        <Button variant="outlined" onClick={() => setIsAddProfilePhotoModalOpen(true)}>
          {t('profile.selectProfilePhotoButton')}
        </Button>
      </div>
      {isAddProfilePhotoModalOpen && (
        <AddProfilePhotoModal
          open={isAddProfilePhotoModalOpen}
          onCancel={() => setIsAddProfilePhotoModalOpen(false)}
          onSave={() => setIsAddProfilePhotoModalOpen(false)}
          className={'addProfilePhotoModal'}
        />
      )}
      {isDeleteProfilePhotoModalOpen && (
        <DeleteProfilePhotoModal
          open={isDeleteProfilePhotoModalOpen}
          onConfirm={handleDeletePhoto}
          onCancel={() => setIsDeleteProfilePhotoModalOpen(false)}
          isLoading={isDeleting}
        />
      )}
    </div>
  )
}
