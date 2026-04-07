'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useConfirmationMutation } from '@/entities/auth'
import { EmailConfirmedPage } from '@/views/email-confirmed'
import { VerificationLinkExpiredPage } from '@/views/verification-link-expired'

export function EmailConfirmedClientPage() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  const [confirm, { isUninitialized, isLoading, isSuccess }] = useConfirmationMutation()

  useEffect(() => {
    if (!code || !isUninitialized) return

    void confirm({ code })
  }, [code, confirm, isUninitialized])

  if (!code) return <VerificationLinkExpiredPage />
  if (isUninitialized || isLoading) return <div>Loading...</div>
  if (isSuccess) return <EmailConfirmedPage />

  return <VerificationLinkExpiredPage />
}
