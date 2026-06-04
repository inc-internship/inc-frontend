'use client'

import s from './ProfilePhoto.module.scss'
import { Button } from '@/shared/ui/Button'
import { useState } from 'react'
import { AddProfilePhotoModal } from '@/features/profile-photo/ui/AddProfilePhotoModal/AddProfilePhotoModal'
import { Avatar } from '@/shared/ui/Avatar'
import { DeleteAvatarIcon } from '@/shared/ui/icons/DeleteAvatarIcon'
import { DeleteProfilePhotoModal } from '@/features/profile-photo/ui/DeleteProfilePhotoModal/DeleteProfilePhotoModal'
import { selectUser } from '@/entities/user/user.slice'
import { useAppSelector } from '@/shared/store'
import { useI18n } from '@/shared/i18n'
import { useGetProfileQuery, useDeleteAvatarMutation } from '@/entities/user/api/user.api'
import { toast } from 'react-toastify'
import Image from 'next/image'

export const ProfilePhoto = () => {
  // const defaultAvatar = '/images/default-avatar.svg'

  const { t } = useI18n()
  const user = useAppSelector(selectUser)
  console.log(user)

  const userId = user?.publicId

  // Запрос данных профиля (автоматически обновляется после мутаций)
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery(userId!, {
    skip: !userId,
  })

  const [deleteAvatar, { isLoading: isDeleting }] = useDeleteAvatarMutation()

  const [isAddProfilePhotoModalOpen, setIsAddProfilePhotoModalOpen] = useState(false)
  const [isDeleteProfilePhotoModalOpen, setIsDeleteProfilePhotoModalOpen] = useState(false)

  // const avatarSrc = profile?.avatar?.original?.url || '/images/default-avatar.svg'
  const avatarSrc = profile?.avatar?.original?.url

  if (isProfileLoading) return <div className={s.profilePhotoWrapper}>Загрузка...</div>

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
    } catch (error) {
      toast.error(t('common.somethingWentWrong'))
    }
  }

  return (
    <div className={s.profilePhotoWrapper}>
      <div className={s.profilePhotoInner}>
        <div className={s.avatarWrapper}>
          <Button
            className={s.deleteAvatarButton}
            onClick={() => setIsDeleteProfilePhotoModalOpen(true)}
            iconOnly
          >
            <DeleteAvatarIcon />
          </Button>
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt="Profile avatar"
              fill
              sizes="204px"
              className={s.avatarImage}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            /* Если нет — дефолтная иконка 48×48 */
            <Image
              src="/images/default-avatar.svg"
              alt="Default avatar"
              width={48}
              height={48}
              className={s.defaultAvatar}
            />
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
        />
      )}
    </div>
  )
}
