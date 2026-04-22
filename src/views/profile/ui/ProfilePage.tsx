'use client'

import { Gallery } from '@/widgets/gallery'
import { ProfileInfo } from '@/widgets/profile-info'

const imageUrl = '/images/mountain.jpg'

const images: string[] = []
for (let i = 0; i < 10; i++) {
  images.push(imageUrl)
}

export const ProfilePage = () => {
  return (
    <>
      <ProfileInfo />
      <Gallery images={images} />
    </>
  )
}
