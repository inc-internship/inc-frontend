import s from './PostFooter.module.scss'
import { ModalFooter } from '@/shared/ui/BaseModal'
import { BookmarkIcon, LikeIcon, ShareIcon } from '@/shared/ui/icons'
import { Typography } from '@/shared/ui/Typography'
import { useI18n } from '@/shared/i18n'
import type { Post } from '@/entities/post'

type Props = {
  isAuthenticated: boolean
  post: Post
}

const formatPostDate = (createdAt: string | undefined, locale: string) => {
  if (!createdAt) {
    return null
  }

  const timestamp = Date.parse(createdAt)

  if (Number.isNaN(timestamp)) {
    return null
  }

  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(timestamp)
}

export const PostFooter = ({ isAuthenticated, post }: Props) => {
  const { locale, t } = useI18n()
  const postDate = formatPostDate(post.createdAt, locale)
  const likesCount = post.likesCount
  const hasLikesCount = typeof likesCount === 'number'

  return (
    <ModalFooter className={s.container}>
      {isAuthenticated && (
        <div className={s.actions}>
          <div className={s.mainActions}>
            <LikeIcon />
            <ShareIcon />
          </div>
          <BookmarkIcon />
        </div>
      )}
      {hasLikesCount && (
        <div className={s.liked}>
          <Typography className={s.likedText} variant="text-m">
            {likesCount.toLocaleString(locale)} &#34;<span>{t('post.liked')}</span>&#34;
          </Typography>
        </div>
      )}
      {postDate && (
        <Typography className={s.postInfo} variant="text-s">
          {postDate}
        </Typography>
      )}
    </ModalFooter>
  )
}
