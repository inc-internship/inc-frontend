import Image from 'next/image'
import s from './ProfilePhoto.module.scss'
import { Button } from '@/shared/ui/Button'
import { useState } from 'react'
import { AddProfilePhotoModal } from '@/features/profile-photo/ui/AddProfilePhotoModal/AddProfilePhotoModal'
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/Avatar'
import { DeleteAvatarIcon } from '@/shared/ui/icons/DeleteAvatarIcon'
import { DeleteProfilePhotoModal } from '@/features/profile-photo/ui/DeleteProfilePhotoModal/DeleteProfilePhotoModal'
import { selectUser } from '@/entities/user/user.slice'
import { useAppSelector } from '@/shared/store'
import { useI18n } from '@/shared/i18n'

export const ProfilePhoto = () => {
  // const defaultAvatar = '/images/default-avatar.svg'

  const { t } = useI18n()
  const user = useAppSelector(selectUser)
  console.log(user)

  const defaultAvatar = '/images/mountain.jpgg'
  const [avatarSrc, setAvatarSrc] = useState(defaultAvatar)

  const [isAddProfilePhotoModalOpen, setIsAddProfilePhotoModalOpen] = useState(false)
  const [isDeleteProfilePhotoModalOpen, setIsDeleteProfilePhotoModalOpen] = useState(false)

  const closeModal = () => setIsAddProfilePhotoModalOpen(false)

  const handleSavePhoto = (newAvatarUrl: string) => {
    setAvatarSrc(newAvatarUrl)
    closeModal()
  }

  const handleDeletePhoto = () => {
    console.log(user)
    setIsDeleteProfilePhotoModalOpen(false)
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
          <Avatar className={s.avatar}>
            <AvatarImage src={avatarSrc} alt="Profile avatar" />
            <AvatarFallback>
              <Image
                alt="Default avatar"
                className={s.defaultAvatar}
                width={48}
                height={48}
                src="/images/default-avatar.svg"
              />
            </AvatarFallback>
          </Avatar>
        </div>
        <Button variant="outlined" onClick={() => setIsAddProfilePhotoModalOpen(true)}>
          {t('profile.selectProfilePhotoButton')}
        </Button>
      </div>
      {isAddProfilePhotoModalOpen && (
        <AddProfilePhotoModal
          open={isAddProfilePhotoModalOpen}
          onCancel={closeModal}
          onSave={handleSavePhoto}
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
