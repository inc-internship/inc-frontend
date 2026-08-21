import s from './PostFooter.module.scss'
import { ModalFooter } from '@/shared/ui/BaseModal'
import { BookmarkIcon, LikeIcon, ShareIcon } from '@/shared/ui/icons'
import { Typography } from '@/shared/ui/Typography'
import { useI18n } from '@/shared/i18n'
import { Avatar } from '@/shared/ui/Avatar'
import {
  useGetLikesInfiniteQuery,
  useLikePostMutation,
  useUnlikePostMutation,
} from '@/entities/post/api/post.api'
import type { Post } from '@/entities/post'
import { MeData } from '@/entities/auth'
import { Button } from '@/shared/ui/Button'
import type { Post } from '@/entities/post'

type Props = {
  isAuthenticated: boolean
  post: Post
  user: MeData | null
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

export const PostFooter = ({ isAuthenticated, post, user }: Props) => {
  const { locale, t } = useI18n()
  const postDate = formatPostDate(post.createdAt, locale)
  const likesCount = post.likesCount
  const hasLikesCount = typeof likesCount === 'number'

  const { data } = useGetLikesInfiniteQuery({ postId: post?.id }, { initialPageParam: null })

  const allLikers = data?.pages.flatMap(page => page.items) ?? []
  const allLikesCount = allLikers.length
  const firstLikers = allLikers.slice(0, 3)

  const isLiked = user ? allLikers.some(liker => liker.id === user.publicId) : false

  const [likePost] = useLikePostMutation()
  const [unlikePost] = useUnlikePostMutation()

  const handleLikeToggle = () => {
    if (!user) return
    if (isLiked) {
      unlikePost({ postId: post.id, user: { publicId: user.publicId, login: user.login } })
    } else {
      likePost({ postId: post.id, user: { publicId: user.publicId, login: user.login } })
    }
  }

  return (
    <ModalFooter className={s.container}>
      {isAuthenticated && (
        <div className={s.actions}>
          <div className={s.mainActions}>
            <Button iconOnly onClick={handleLikeToggle}>
              <LikeIcon className={s.likedIcon} filled={isLiked} />
            </Button>
            <ShareIcon />
          </div>
          <BookmarkIcon />
        </div>
      )}
      <div className={s.liked}>
        <div className={s.likedPhotos}>
          {firstLikers.map(user => (
            <Avatar key={user.id} size={24} src={user.avatarUrl} alt={user.login} />
          ))}
        </div>
        <Typography className={s.likedText} variant="text-m">
          {allLikesCount} &#34;{t('post.liked')}&#34;
        </Typography>
      </div>
      <Typography className={s.postInfo} variant="text-s">
        July 3, 2021
      </Typography>

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
