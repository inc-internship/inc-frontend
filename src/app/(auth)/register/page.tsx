import { SignUpPage } from '@/views/sign-up'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Registration',
}

export default function SignUp() {
  return <SignUpPage />
}
