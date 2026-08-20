'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { toast } from 'react-toastify'
import type { Post } from '@/entities/post'
import { followUser, selectUnfollowedUserIds, unfollowUser } from '@/entities/follow'
import {
  CopyLink,
  PersonAdd,
  PersonRemove,
  PostActionsMenu,
  type PostActionMenuItem,
} from '@/features/post-actions'
import { getLocalizedPath, useI18n } from '@/shared/i18n'
import { useAppDispatch, useAppSelector } from '@/shared/store'
import { Avatar } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import { ImageSlide, ImageSlider } from '@/shared/ui/ImageSlider'
import { Input } from '@/shared/ui/Input'
import { Typography } from '@/shared/ui/Typography'
import { BookmarkIcon, CommentIcon, LikeIcon, ShareIcon } from '@/shared/ui/icons'
import { getRelativeTimeLabel } from '@/views/main/ui/mainPage.utils'
import s from './FeedPostCard.module.scss'

const LIKES_COUNT = 2243
const COMMENTS_COUNT = 114

type Props = {
  post: Post
  avatarUrl?: string | null
}

export const FeedPostCard = ({ post, avatarUrl }: Props) => {
  const { t, locale } = useI18n()
  const dispatch = useAppDispatch()
  const unfollowedUserIds = useAppSelector(selectUnfollowedUserIds)

  const ownerId = post.owner.id
  const ownerLogin = post.owner.login || t('common.user')
  const ownerAvatar = avatarUrl ?? post.owner.avatar?.url ?? null
  const isFollowing = !unfollowedUserIds.includes(ownerId)
  const profileHref = getLocalizedPath(locale, `/profile/${ownerId}`)

  const slides: ImageSlide[] = post.images.map(image => ({
    ...image,
    src: image.url,
    alt: t('post.imageAlt'),
  }))

  const postTime = post.createdAt
    ? getRelativeTimeLabel(post.createdAt, locale, t('main.justNow'))
    : null

  const menuItems: PostActionMenuItem[] = useMemo(
    () => [
      {
        key: isFollowing ? 'unfollow' : 'follow',
        label: isFollowing ? t('post.unfollow') : t('post.follow'),
        icon: isFollowing ? <PersonRemove /> : <PersonAdd />,
        onClick: () => {
          if (isFollowing) {
            dispatch(unfollowUser(ownerId))
          } else {
            dispatch(followUser(ownerId))
          }
        },
      },
      {
        key: 'copy-link',
        label: t('post.copyLink'),
        icon: <CopyLink />,
        onClick: async () => {
          const url = `${window.location.origin}${profileHref}?postId=${post.id}`

          try {
            await navigator.clipboard.writeText(url)
            toast.success(t('post.linkCopied'))
          } catch {
            toast.error(t('common.somethingWentWrong'))
          }
        },
      },
    ],
    [dispatch, isFollowing, ownerId, post.id, profileHref, t],
  )

  return (
    <article className={s.card}>
      <header className={s.header}>
        <Link href={profileHref} className={s.author}>
          <Avatar size={36} src={ownerAvatar} alt={t('main.avatarAlt', { login: ownerLogin })} />
          <Typography variant="text-m-bold" className={s.userName}>
            {ownerLogin}
          </Typography>
        </Link>
        {postTime ? (
          <Typography variant="text-s" className={s.time}>
            <span className={s.dot} aria-hidden>
              •
            </span>
            {postTime}
          </Typography>
        ) : null}
        <PostActionsMenu
          items={menuItems}
          className={s.menu}
          ariaLabel={t('post.actionsMenu')}
          position="static"
        />
      </header>

      <div className={s.media}>
        {slides.length > 0 ? (
          <ImageSlider
            slides={slides}
            className={s.slider}
            imageViewportClassName={s.imageWrapper}
            imageClassName={s.image}
          />
        ) : (
          <div className={s.imageFallback}>
            <Typography variant="text-s">{t('main.noImage')}</Typography>
          </div>
        )}
      </div>

      <div className={s.actions}>
        <div className={s.mainActions}>
          <button type="button" className={s.actionButton} aria-label={t('post.liked')}>
            <LikeIcon />
          </button>
          <button type="button" className={s.actionButton} aria-label={t('post.addComment')}>
            <CommentIcon />
          </button>
          <button type="button" className={s.actionButton} aria-label={t('post.share')}>
            <ShareIcon />
          </button>
        </div>
        <button type="button" className={s.actionButton} aria-label={t('post.bookmark')}>
          <BookmarkIcon />
        </button>
      </div>

      <div className={s.caption}>
        <Avatar size={36} src={ownerAvatar} alt={t('main.avatarAlt', { login: ownerLogin })} />
        <Typography variant="text-m" className={s.captionText}>
          <Link href={profileHref} className={s.captionAuthor}>
            {ownerLogin}
          </Link>{' '}
          {post.description.trim() || t('main.noDescription')}
        </Typography>
      </div>

      <div className={s.liked}>
        <div className={s.likedPhotos}>
          <Avatar size={24} src={null} />
          <Avatar size={24} src={null} />
          <Avatar size={24} src={null} />
        </div>
        <Typography variant="text-m" className={s.likedText}>
          {LIKES_COUNT.toLocaleString(locale)} &quot;{t('post.liked')}&quot;
        </Typography>
      </div>

      <button type="button" className={s.viewComments}>
        {t('post.viewAllComments', { count: COMMENTS_COUNT })}
      </button>

      <div className={s.addComment}>
        <Input
          wrapperClassName={s.inputWrapper}
          className={s.input}
          placeholder={`${t('post.addComment')}...`}
        />
        <Button className={s.publishButton}>{t('post.sendComment')}</Button>
      </div>
    </article>
  )
}
