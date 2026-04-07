import { CreateNewPasswordPage } from '@/views/create-new-password'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset Password',
}

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

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

  if (typeof recoveryCode !== 'string' || recoveryCode.trim().length === 0) {
    redirect('/recovery-password/expired-link')
  }

  return <CreateNewPasswordPage recoveryCode={recoveryCode.trim()} />
}
