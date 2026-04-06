import { RecoveryPasswordPage } from '@/views/recovery-password'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Password recovery',
}

export default function RecoveryPassword() {
  return <RecoveryPasswordPage />
}
