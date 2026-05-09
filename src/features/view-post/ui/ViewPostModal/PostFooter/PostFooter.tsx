import s from './PostFooter.module.scss'
import { ModalFooter } from '@/shared/ui/BaseModal'
import { BookmarkIcon, LikeIcon, ShareIcon } from '@/shared/ui/icons'
import { Typography } from '@/shared/ui/Typography'

export const PostFooter = () => {
  return (
    <ModalFooter className={s.container}>
      <div className={s.actions}>
        <div className={s.mainActions}>
          <LikeIcon />
          <ShareIcon />
        </div>
        <BookmarkIcon />
      </div>
      <div className={s.liked}>
        <div className={s.likedPhotos}>
          <div
            style={{
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              backgroundColor: 'green',
            }}
          />
          <div
            style={{
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              backgroundColor: 'orange',
            }}
          />
          <div
            style={{
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              backgroundColor: 'blue',
            }}
          />
        </div>
        <Typography className={s.likedText} variant="text-m">
          2243 &#34;Like&#34;
        </Typography>
      </div>
      <Typography className={s.postInfo} variant="text-s">
        July 3, 2021
      </Typography>
    </ModalFooter>
  )
}
