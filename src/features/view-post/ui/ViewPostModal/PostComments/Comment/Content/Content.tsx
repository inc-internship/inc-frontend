import s from './Content.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { Post } from '@/entities/post'
import { useI18n } from '@/shared/i18n'
import { LikeIcon } from '@/shared/ui/icons'
import { Avatar } from '@/shared/ui/Avatar'

type Props = {
  post: Post
}

export const Content = ({ post }: Props) => {
  const { t } = useI18n()

  return (
    <div className={s.container}>
      <div className={s.main}>
        <Avatar size={36} src={null} className={s.avatar} />
        <Typography variant="text-m" className={s.text}>
          {post.owner.login || t('common.user')} {post.description || t('common.user')}
        </Typography>
      </div>
      <LikeIcon className={s.like} />
    </div>
  )
}
