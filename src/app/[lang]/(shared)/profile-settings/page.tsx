import { ProfileSettingsPage } from '@/views/profile-settings'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile Settings',
}

export default function ProfileSettings() {
  return <ProfileSettingsPage />
}
