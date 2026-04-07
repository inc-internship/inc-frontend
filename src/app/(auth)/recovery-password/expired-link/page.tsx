import { RecoveryPasswordPage } from '@/views/recovery-password'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset Password',
}

export default function RecoveryPasswordExpiredLink() {
  return <RecoveryPasswordPage />
}
