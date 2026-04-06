import { PrivacyPolicyPage } from '@/views/privacy-policy'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy & policy',
}

export default function PrivacyPolicy() {
  return <PrivacyPolicyPage />
}
