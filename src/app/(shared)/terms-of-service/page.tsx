import { TermsOfServicePage } from '@/views/terms-of-service'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of service',
}

export default function TermsOfService() {
  return <TermsOfServicePage />
}
