'use client'

import { useMemo, type CSSProperties } from 'react'
import { Typography } from '@/shared/ui/Typography'
import { useI18n } from '@/shared/i18n'
import type { MainPagePost } from '@/views/main/model/getMainPageData'
import { PostCard } from './PostCard'
import { getCounterDigits, getCounterWidth } from './mainPage.utils'
import s from './MainPage.module.scss'

type MainPageProps = {
  totalUsers: number
  latestPosts: MainPagePost[]
}

export const MainPage = ({ totalUsers, latestPosts }: MainPageProps) => {
  const { t, locale } = useI18n()
  const localeCode = locale === 'ru' ? 'ru-RU' : 'en-US'
  const numberFormatter = useMemo(() => new Intl.NumberFormat(localeCode), [localeCode])
  const hasPosts = latestPosts.length > 0
  const counterDigits = getCounterDigits(totalUsers)
  const counterStyle = useMemo<CSSProperties>(() => {
    return {
      width: `${getCounterWidth(counterDigits.length)}px`,
    }
  }, [counterDigits.length])

  return (
    <main className={s.main}>
      <div className={s.container}>
        <section className={s.alerts}>
          <Typography variant="h2" className={s.alertsLabel}>
            {t('main.registeredUsersLabel')}
          </Typography>
          <div
            className={s.counter}
            style={counterStyle}
            aria-label={`${t('main.registeredUsersLabel')} ${numberFormatter.format(totalUsers)}`}
          >
            {counterDigits.map((digit, index) => (
              <span className={s.counterDigit} key={index}>
                {digit}
              </span>
            ))}
          </div>
        </section>

        {hasPosts ? (
          <section className={s.postsGrid}>
            {latestPosts.map(post => (
              <PostCard key={post.id} post={post} localeCode={localeCode} t={t} />
            ))}
          </section>
        ) : (
          <div className={s.emptyState}>
            <Typography variant="text-l">{t('main.noPosts')}</Typography>
          </div>
        )}
      </div>
    </main>
  )
}
