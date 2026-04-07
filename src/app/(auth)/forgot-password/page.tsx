import { ForgotPasswordPage } from '@/views/forgot-password'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot password',
}

export default function ForgotPassword() {
  return <ForgotPasswordPage />
}
