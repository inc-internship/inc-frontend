import { Suspense } from 'react'
import { EmailConfirmedClientPage } from './EmailConfirmedClientPage'
import type { Metadata } from 'next'
import { resolveLocale } from '@/shared/i18n/config'
import { translate } from '@/shared/i18n/translate'

export const metadata: Metadata = {
  title: 'Email confirmed',
}

type Props = {
  params: Promise<{ lang: string }>
}

export default async function EmailConfirmed({ params }: Props) {
  const { lang } = await params
  const locale = resolveLocale(lang)

  return (
    <Suspense fallback={<div>{translate(locale, 'common.loading')}</div>}>
      <EmailConfirmedClientPage />
    </Suspense>
  )
}
