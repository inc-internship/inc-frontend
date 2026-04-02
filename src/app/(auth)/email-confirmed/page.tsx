'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useConfirmationMutation } from '@/entities/auth/api/auth.api'
import { EmailConfirmedPage } from '@/views/email-confirmed'
import { VerificationLinkExpiredPage } from '@/views/verification-link-expired'

export default function EmailConfirmed() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  const [confirm] = useConfirmationMutation()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(code ? 'loading' : 'error')

  useEffect(() => {
    if (!code) return

    confirm({ code })
      .unwrap()
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [code, confirm])
  if (status === 'loading') return <div>Loading...</div>
  if (status === 'success') return <EmailConfirmedPage />

  return <VerificationLinkExpiredPage />
}
