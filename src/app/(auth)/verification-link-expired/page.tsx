import { VerificationLinkExpiredPage } from '@/views/verification-link-expired'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verification link expired',
}

export default function VerificationLinkExpired() {
  return <VerificationLinkExpiredPage />
}
