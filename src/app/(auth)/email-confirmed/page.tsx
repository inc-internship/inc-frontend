import { EmailConfirmedPage } from '@/views/email-confirmed'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Email confirmed',
}
import { VerificationLinkExpiredPage } from '@/views/verification-link-expired'
import { useConfirmationMutation } from '@/entities/auth'

export default function EmailConfirmed() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  const [confirm, { isUninitialized, isLoading, isSuccess, isError }] = useConfirmationMutation()

  useEffect(() => {
    if (!code || !isUninitialized) return

    void confirm({ code })
  }, [code, confirm, isUninitialized])

  if (!code) return <VerificationLinkExpiredPage />
  if (isUninitialized || isLoading) return <div>Loading...</div>
  if (isSuccess) return <EmailConfirmedPage />

  return <VerificationLinkExpiredPage />
}
