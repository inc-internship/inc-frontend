import { CreateNewPasswordPage } from '@/views/create-new-password'
import { RecoveryPasswordPage } from '@/views/recovery-password'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset Password',
}

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const RECOVERY_CODE_REGEXP =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const getQueryParam = (value: string | string[] | undefined) => {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value)) {
    return value[0]
  }

  return undefined
}

export default async function RecoveryPassword({ searchParams }: Props) {
  const recoveryCode = getQueryParam((await searchParams).code)
  const normalizedCode = recoveryCode?.trim()

  if (!normalizedCode || !RECOVERY_CODE_REGEXP.test(normalizedCode)) {
    return <RecoveryPasswordPage />
  }

  return <CreateNewPasswordPage recoveryCode={normalizedCode} />
}
