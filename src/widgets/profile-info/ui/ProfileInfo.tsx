import Image from 'next/image'
import s from './ProfileInfo.module.scss'
import { ProfileDetails } from './ProfileDetails/ProfileDetails'

export const ProfileInfo = () => {
  const imageUrl = '/images/mountain.jpg'

  return (
    <section className={s.container}>
      <Image className={s.photo} src={imageUrl} width={204} height={204} alt="Mount" />
      <ProfileDetails />
    </section>
  )
}
