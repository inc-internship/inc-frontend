import { RegistrationPage } from '@/views/registration'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Registration',
}

export default function Registration() {
  return <RegistrationPage />
}
