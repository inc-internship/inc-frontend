import { EmailConfirmedPage } from '@/views/email-confirmed'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Email confirmed',
}

export default function EmailConfirmed() {
  return <EmailConfirmedPage />
}
