'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useConfirmationMutation } from '@/entities/auth'
import { EmailConfirmedPage } from '@/views/email-confirmed'
import { VerificationLinkExpiredPage } from '@/views/verification-link-expired'
import { useI18n } from '@/shared/i18n'

export function EmailConfirmedClientPage() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  const [confirm, { isUninitialized, isLoading, isSuccess }] = useConfirmationMutation()

  useEffect(() => {
    if (!code || !isUninitialized) return

    void confirm({ code })
  }, [code, confirm, isUninitialized])

  if (!code) return <VerificationLinkExpiredPage />
  if (isUninitialized || isLoading) return <div>{t('common.loading')}</div>
  if (isSuccess) return <EmailConfirmedPage />

  return <VerificationLinkExpiredPage />
}
