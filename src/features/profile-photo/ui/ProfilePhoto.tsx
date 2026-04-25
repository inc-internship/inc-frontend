import Image from 'next/image'
import s from './ProfilePhoto.module.scss'
import { Button } from '@/shared/ui/Button'

export const ProfilePhoto = () => {
  const defaultAvatar = '/images/default-avatar.svg'
  return (
    <div className={s.profilePhotoWrapper}>
      <div className={s.profilePhotoInner}>
        <Image
          alt="Profile avatar"
          className={s.defaultAvatar}
          width={48}
          height={48}
          src={defaultAvatar}
        />
      </div>
      <Button variant="outlined">Select Profile Photo</Button>
    </div>
  )
}
