'use client'

import { useMemo, type CSSProperties } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Typography } from '@/shared/ui/Typography'
import { useI18n } from '@/shared/i18n'
import type { Post } from '@/entities/post'
import { ViewPostModal, useViewPost, openPostHandler, closePostHandler } from '@/features/view-post'
import type { MainPagePost } from '@/views/main/model/getMainPageData'
import { PostCard } from './PostCard'
import { getCounterDigits, getCounterWidth } from './mainPage.utils'
import s from './MainPage.module.scss'

type MainPageProps = {
  totalUsers: number
  latestPosts: MainPagePost[]
  initialSelectedPost: Post | null
}

const toPost = (post: MainPagePost): Post => ({
  id: post.id,
  description: post.description,
  images: post.images.map(img => ({ ...img, height: 0, width: 0 })),
  owner: { id: post.owner.id, login: post.owner.login },
})

export const MainPage = ({ totalUsers, latestPosts, initialSelectedPost }: MainPageProps) => {
  const { t, locale } = useI18n()

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const navArgs = { router, pathname, searchParams }

  const { selectedViewPost, setSelectedViewPost, closeViewModalHandler } = useViewPost({
    initialSelectedPost,
  })

  const localeCode = locale === 'ru' ? 'ru-RU' : 'en-US'
  const numberFormatter = useMemo(() => new Intl.NumberFormat(localeCode), [localeCode])
  const hasPosts = latestPosts.length > 0
  const counterDigits = getCounterDigits(totalUsers)
  const counterStyle = useMemo<CSSProperties>(
    () => ({
      width: `${getCounterWidth(counterDigits.length)}px`,
    }),
    [counterDigits.length],
  )

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
              <PostCard
                key={post.id}
                post={post}
                localeCode={localeCode}
                t={t}
                onClick={() =>
                  openPostHandler({ post: toPost(post), setSelectedViewPost, ...navArgs })
                }
              />
            ))}
          </section>
        ) : (
          <div className={s.emptyState}>
            <Typography variant="text-l">{t('main.noPosts')}</Typography>
          </div>
        )}
      </div>

      <ViewPostModal
        open={!!selectedViewPost}
        post={selectedViewPost}
        onCancel={() => closePostHandler({ closeViewModalHandler, ...navArgs })}
      />
    </main>
  )
}
