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

type Props = {
  isAuthenticated: boolean
  post: Post
  user: MeData | null
}

export const PostFooter = ({ isAuthenticated, post, user }: Props) => {
  const { t } = useI18n()

  const { data } = useGetLikesInfiniteQuery({ postId: post?.id }, { initialPageParam: null })

  const allLikers = data?.pages.flatMap(page => page.items) ?? []
  const likesCount = allLikers.length
  const firstLikers = allLikers.slice(0, 3)

  // Проверяем, лайкнул ли текущий пользователь
  const isLiked = user ? allLikers.some(liker => liker.id === user.publicId) : false

  // Мутации
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

  console.log('data', data)

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
          {likesCount} &#34;{t('post.liked')}&#34;
        </Typography>
      </div>
      <Typography className={s.postInfo} variant="text-s">
        July 3, 2021
      </Typography>
    </ModalFooter>
  )
}
