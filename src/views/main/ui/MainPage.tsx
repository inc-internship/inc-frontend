'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { z } from 'zod'
import { API_V1_URL } from '@/shared/constants'
import { Typography } from '@/shared/ui/Typography'
import { useI18n } from '@/shared/i18n'
import type { MainPagePost } from '@/views/main/model/getMainPageData'
import { LATEST_POSTS_ENDPOINT } from '@/views/main/model/mainPage.constants'
import { mainPagePostSchema } from '@/views/main/model/mainPage.schemas'
import { PostCard } from './PostCard'
import { getCounterDigits, getCounterWidth } from './mainPage.utils'
import s from './MainPage.module.scss'

type MainPageProps = {
  totalUsers: number
  latestPosts: MainPagePost[] | null
}

export const MainPage = ({ totalUsers, latestPosts }: MainPageProps) => {
  const { t, locale } = useI18n()
  const [clientLatestPosts, setClientLatestPosts] = useState<MainPagePost[] | null>(null)
  const shouldFetchLatestPosts = latestPosts === null
  const localeCode = locale === 'ru' ? 'ru-RU' : 'en-US'
  const numberFormatter = useMemo(() => new Intl.NumberFormat(localeCode), [localeCode])
  const posts = latestPosts ?? clientLatestPosts ?? []
  const hasPosts = posts.length > 0
  const isLoadingLatestPosts = shouldFetchLatestPosts && clientLatestPosts === null
  const counterDigits = getCounterDigits(totalUsers)
  const counterStyle = useMemo<CSSProperties>(() => {
    return {
      width: `${getCounterWidth(counterDigits.length)}px`,
    }
  }, [counterDigits.length])

  useEffect(() => {
    if (!shouldFetchLatestPosts) {
      return
    }

    const controller = new AbortController()

    const fetchLatestPosts = async () => {
      try {
        const response = await fetch(`${API_V1_URL}${LATEST_POSTS_ENDPOINT}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          setClientLatestPosts([])
          return
        }

        const rawData: unknown = await response.json()
        const result = z.array(mainPagePostSchema).safeParse(rawData)

        setClientLatestPosts(result.success ? result.data : [])
      } catch {
        if (!controller.signal.aborted) {
          setClientLatestPosts([])
        }
      }
    }

    void fetchLatestPosts()

    return () => {
      controller.abort()
    }
  }, [shouldFetchLatestPosts])

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

        {isLoadingLatestPosts ? (
          <div className={s.emptyState}>
            <Typography variant="text-l">{t('common.loading')}</Typography>
          </div>
        ) : hasPosts ? (
          <section className={s.postsGrid}>
            {posts.map(post => (
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
