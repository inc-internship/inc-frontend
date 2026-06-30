import s from './PostFooter.module.scss'
import { ModalFooter } from '@/shared/ui/BaseModal'
import { BookmarkIcon, LikeIcon, ShareIcon } from '@/shared/ui/icons'
import { Typography } from '@/shared/ui/Typography'
import { useI18n } from '@/shared/i18n'
import { Avatar } from '@/shared/ui/Avatar'

type Props = {
  isAuthenticated: boolean
}

export const PostFooter = ({ isAuthenticated }: Props) => {
  const { t } = useI18n()

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
      <div className={s.liked}>
        <div className={s.likedPhotos}>
          <Avatar size={24} src={null} />
          <Avatar size={24} src={null} />
          <Avatar size={24} src={null} />
        </div>
        <Typography className={s.likedText} variant="text-m">
          2243 &#34;{t('post.liked')}&#34;
        </Typography>
      </div>
      <Typography className={s.postInfo} variant="text-s">
        July 3, 2021
      </Typography>
    </ModalFooter>
  )
}
