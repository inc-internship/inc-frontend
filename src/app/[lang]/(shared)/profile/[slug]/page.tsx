import { ProfilePage } from '@/views/profile'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile',
}

export default function Profile() {
  return <ProfilePage />
}
