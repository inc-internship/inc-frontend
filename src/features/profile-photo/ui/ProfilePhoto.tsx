import Image from 'next/image'
import s from './ProfilePhoto.module.scss'
import { Button } from '@/shared/ui/Button'
import { useState } from 'react'
import { AddProfilePhotoModal } from '@/features/profile-photo/ui/AddProfilePhotoModal/AddProfilePhotoModal'
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/Avatar'

export const ProfilePhoto = () => {
  const defaultAvatar = '/images/default-avatar.svg'
  // const defaultAvatar = '/images/mountain.jpgg'
  const [avatarSrc, setAvatarSrc] = useState(defaultAvatar)

  const [isAddProfilePhotoModalOpen, setIsAddProfilePhotoModalOpen] = useState(false)

  const closeModal = () => setIsAddProfilePhotoModalOpen(false)

  const handleSavePhoto = (newAvatarUrl: string) => {
    setAvatarSrc(newAvatarUrl)
    closeModal()
  }

  return (
    <div className={s.profilePhotoWrapper}>
      <div className={s.profilePhotoInner}>
        <div className={s.avatarWrapper}>
          <Avatar>
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
          Add a Profile Photo
        </Button>
      </div>
      {isAddProfilePhotoModalOpen && (
        <AddProfilePhotoModal
          open={isAddProfilePhotoModalOpen}
          onCansel={closeModal}
          onSave={handleSavePhoto}
        />
      )}
    </div>
  )
}
