import { Typography } from '@/shared/ui/Typography'
import s from './ExtraInfo.module.scss'
import { useI18n } from '@/shared/i18n'
import { useAppSelector } from '@/shared/store'
import { selectUser } from '@/entities/user/user.slice'

export const ExtraInfo = () => {
  const { t } = useI18n()
  const isAuthenticated = !!useAppSelector(selectUser)

  return (
    <Typography className={s.extraInfo} variant="text-s">
      <span>2 {t('post.postedAgo')}</span>
      {isAuthenticated && <span>{t('post.liked')}: 1</span>}
      {isAuthenticated && <span>{t('post.reply')}</span>}
    </Typography>
  )
}
