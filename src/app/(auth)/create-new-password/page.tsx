import { CreateNewPasswordPage } from '@/views/create-new-password'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create new password',
}

export default function CreateNewPassword() {
  return <CreateNewPasswordPage />
}
