import { Suspense } from 'react'
import { EmailConfirmedClientPage } from './EmailConfirmedClientPage'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { LOCALE_COOKIE_NAME, resolveLocale } from '@/shared/i18n/config'
import { translate } from '@/shared/i18n/translate'

export const metadata: Metadata = {
  title: 'Email confirmed',
}

export default async function EmailConfirmed() {
  const cookieStore = await cookies()
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value)

  return (
    <Suspense fallback={<div>{translate(locale, 'common.loading')}</div>}>
      <EmailConfirmedClientPage />
    </Suspense>
  )
}
