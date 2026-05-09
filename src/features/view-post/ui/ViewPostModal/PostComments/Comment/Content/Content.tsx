import s from './Content.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { Post } from '@/entities/post'
import { useI18n } from '@/shared/i18n'
import { LikeIcon } from '@/shared/ui/icons'

type Props = {
  post: Post
}

export const Content = ({ post }: Props) => {
  const { t } = useI18n()

  return (
    <div className={s.container}>
      <div className={s.main}>
        <div
          style={{
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            backgroundColor: 'red',
          }}
        ></div>
        <Typography variant="text-m" className={s.text}>
          {post.owner.login || t('common.user')} {post.description || t('common.user')}
        </Typography>
      </div>
      <LikeIcon className={s.like} />
    </div>
  )
}
