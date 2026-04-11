import { CreateNewPasswordPage } from '@/views/create-new-password'
import { ROUTES } from '@/shared/constants'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Create new password',
}

type SearchParams = Record<string, string | string[] | undefined>

type Props = {
  searchParams: Promise<SearchParams>
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

export default async function CreateNewPassword({ searchParams }: Props) {
  const params = await searchParams
  const recoveryCode = getQueryParam(params.code)?.trim()

  if (!recoveryCode || !RECOVERY_CODE_REGEXP.test(recoveryCode)) {
    redirect(ROUTES.recoveryPassword)
  }

  return <CreateNewPasswordPage recoveryCode={recoveryCode} />
}
