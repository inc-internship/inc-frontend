import Image from 'next/image'
import { useState } from 'react'
import { Typography } from '@/shared/ui/Typography'
import type { MainPagePost } from '@/views/main/model/getMainPageData'
import { getDescriptionPreview, getRelativeTimeLabel, type TranslateFn } from './mainPage.utils'
import s from './MainPage.module.scss'

type PostCardProps = {
  post: MainPagePost
  localeCode: string
  t: TranslateFn
}

export const PostCard = ({ post, localeCode, t }: PostCardProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const hasMultipleImages = post.images.length > 1
  const activeImage = post.images[activeImageIndex] ?? post.images[0]
  const avatarUrl = post.owner.avatarUrl?.trim() ?? ''
  const userInitial = post.owner.login.trim().charAt(0).toUpperCase()
  const fullDescription = post.description.trim() || t('main.noDescription')
  const preview = getDescriptionPreview(fullDescription, t('main.noDescription'))
  const hasDescriptionToggle = preview.isTruncated
  const description =
    isDescriptionExpanded || !hasDescriptionToggle ? fullDescription : preview.text
  const postTime = getRelativeTimeLabel(post.createdAt, localeCode, t('main.justNow'))

  const prevImageHandler = () => {
    setActiveImageIndex(prev => (prev === 0 ? post.images.length - 1 : prev - 1))
  }

  const nextImageHandler = () => {
    setActiveImageIndex(prev => (prev === post.images.length - 1 ? 0 : prev + 1))
  }

  const toggleDescriptionHandler = () => {
    setIsDescriptionExpanded(prev => !prev)
  }

  return (
    <article className={s.postCard}>
      <div className={s.media}>
        {activeImage ? (
          <Image
            className={s.mediaImage}
            src={activeImage.url}
            alt={t('main.postImageAlt', { login: post.owner.login })}
            fill
            sizes="234px"
          />
        ) : (
          <div className={s.mediaFallback}>
            <Typography variant="text-s">{t('main.noImage')}</Typography>
          </div>
        )}

        {hasMultipleImages ? (
          <>
            <button
              type="button"
              className={`${s.navButton} ${s.navPrev}`}
              onClick={prevImageHandler}
              aria-label={t('common.previousSlide')}
            >
              <span className={s.navIcon} aria-hidden>
                &#8249;
              </span>
            </button>
            <button
              type="button"
              className={`${s.navButton} ${s.navNext}`}
              onClick={nextImageHandler}
              aria-label={t('common.nextSlide')}
            >
              <span className={s.navIcon} aria-hidden>
                &#8250;
              </span>
            </button>
            <div className={s.pagination}>
              {post.images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  className={`${s.paginationDot} ${index === activeImageIndex ? s.paginationDotActive : ''}`}
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={t('main.goToSlide', { slide: index + 1 })}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className={s.postBody}>
        <div className={s.authorRow}>
          <div className={s.avatar}>
            {avatarUrl ? (
              <Image
                className={s.avatarImage}
                src={avatarUrl}
                alt={t('main.avatarAlt', { login: post.owner.login })}
                fill
                sizes="36px"
              />
            ) : (
              <span className={s.avatarFallback}>{userInitial || 'U'}</span>
            )}
          </div>
          <Typography variant="text-l" className={s.userName}>
            {post.owner.login || t('common.user')}
          </Typography>
        </div>
        <Typography variant="text-s" className={s.timeLabel}>
          {postTime}
        </Typography>
        <Typography variant="text-m" className={s.description}>
          {description}
          {hasDescriptionToggle ? (
            <>
              {' '}
              <button
                type="button"
                className={s.showMoreButton}
                onClick={toggleDescriptionHandler}
                aria-expanded={isDescriptionExpanded}
              >
                {isDescriptionExpanded ? t('main.hide') : t('main.showMore')}
              </button>
            </>
          ) : null}
        </Typography>
      </div>
    </article>
  )
}
