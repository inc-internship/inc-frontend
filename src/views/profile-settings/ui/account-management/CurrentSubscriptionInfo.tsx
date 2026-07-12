import { useMemo } from 'react'

import { useI18n } from '@/shared/i18n'
import s from './AccountManagementPage.module.scss'

type Props = {
  expireAt?: string
  nextPaymentDate?: string
}

const localeCodeByLocale: Record<string, string> = {
  en: 'en-US',
  ru: 'ru-RU',
}

const getLocaleCode = (locale: string) => localeCodeByLocale[locale] ?? 'en-US'

const formatDate = (value: string | undefined, formatter: Intl.DateTimeFormat) => {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? '-' : formatter.format(date)
}

export const CurrentSubscriptionInfo = ({ expireAt, nextPaymentDate }: Props) => {
  const { locale } = useI18n()
  const localeCode = getLocaleCode(locale)
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(localeCode, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    [localeCode],
  )

  return (
    <section className={s.currentSubscriptionSection} aria-labelledby="current-subscription-title">
      <h3 className={s.sectionTitle} id="current-subscription-title">
        Current Subscription:
      </h3>

      <dl className={s.currentSubscriptionPanel}>
        <div className={s.currentSubscriptionColumn}>
          <dt className={s.currentSubscriptionLabel}>Expire at</dt>
          <dd className={s.currentSubscriptionValue} suppressHydrationWarning>
            {formatDate(expireAt, dateFormatter)}
          </dd>
        </div>
        <div className={s.currentSubscriptionColumn}>
          <dt className={s.currentSubscriptionLabel}>Next payment</dt>
          <dd className={s.currentSubscriptionValue} suppressHydrationWarning>
            {formatDate(nextPaymentDate, dateFormatter)}
          </dd>
        </div>
      </dl>
    </section>
  )
}
