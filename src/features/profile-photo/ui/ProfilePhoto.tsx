import Image from 'next/image'
import s from './ProfilePhoto.module.scss'
import { Button } from '@/shared/ui/Button'
import { useState } from 'react'
import { AddProfilePhotoModal } from '@/features/profile-photo/ui/AddProfilePhotoModal/AddProfilePhotoModal'

export const ProfilePhoto = () => {
  const defaultAvatar = '/images/default-avatar.svg'

  const [isAddProfilePhotoModalOpen, setIsAddProfilePhotoModalOpen] = useState(false)
  const closeAddProfilePhotoModalHandler = () => setIsAddProfilePhotoModalOpen(false)

  return (
    <div className={s.profilePhotoWrapper}>
      <div className={s.profilePhotoInner}>
        <div className={s.avatarWrapper}>
          <Image
            alt="Profile avatar"
            className={s.defaultAvatar}
            width={48}
            height={48}
            src={defaultAvatar}
          />
        </div>
        <Button variant="outlined" onClick={() => setIsAddProfilePhotoModalOpen(true)}>
          Add a Profile Photo
        </Button>
      </div>
      {isAddProfilePhotoModalOpen && (
        <AddProfilePhotoModal
          open={isAddProfilePhotoModalOpen}
          onCansel={closeAddProfilePhotoModalHandler}
        />
      )}
    </div>
  )
}
